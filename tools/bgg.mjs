#!/usr/bin/env node
// Holt Spieldaten von BoardGameGeek und gibt sie in dem Format aus, das
// "Was spielen wir heute?" unter „Sicherung & Umzug" einliest.
//
//   node tools/bgg.mjs "Sky Team" "Hive Pocket"      einzelne Titel
//   node tools/bgg.mjs --user DeinBggName            ganze BGG-Sammlung (nur Besitz)
//   node tools/bgg.mjs --id 224517                   direkt über die BGG-Nummer
//   node tools/bgg.mjs "Scout" --out sammlung.json   in eine Datei schreiben
//
// Braucht Node 18 oder neuer, sonst nichts.

const API = "https://boardgamegeek.com/xmlapi2";
const PAUSE_MS = 1500;              // BGG bittet um gemächliche Abfragen
const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ---------- HTTP ---------- */

async function get(url, tries = 6){
  for(let attempt = 1; attempt <= tries; attempt++){
    let res;
    try{
      res = await fetch(url, { headers:{ "User-Agent":"spieleabend-import/1.0" } });
    }catch(err){
      if(attempt === tries) throw new Error("Keine Verbindung zu BGG: " + err.message);
      await sleep(PAUSE_MS * attempt);
      continue;
    }
    // 202 = Anfrage steht in der Warteschlange (vor allem bei Sammlungen)
    if(res.status === 202 || res.status === 429 || res.status >= 500){
      const wait = Number(res.headers.get("retry-after")) * 1000 || PAUSE_MS * attempt * 2;
      if(attempt === tries) throw new Error("BGG antwortet nicht (" + res.status + ") — später noch einmal.");
      process.stderr.write("… BGG lässt warten (" + res.status + "), neuer Versuch in " + Math.round(wait/1000) + " s\n");
      await sleep(wait);
      continue;
    }
    if(!res.ok) throw new Error("BGG antwortet mit " + res.status + " auf " + url);
    return res.text();
  }
  throw new Error("BGG bleibt unerreichbar: " + url);
}

/* ---------- XML, so viel wie nötig ---------- */

const unescapeXml = s => String(s)
  .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"')
  .replace(/&#0?39;/g,"'").replace(/&apos;/g,"'").replace(/&amp;/g,"&");

const attr = (chunk, tag, name = "value") => {
  const m = chunk.match(new RegExp("<" + tag + "\\b[^>]*\\b" + name + '="([^"]*)"'));
  return m ? unescapeXml(m[1]) : null;
};
const num = (chunk, tag) => {
  const v = attr(chunk, tag);
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
// <item …> … </item> bzw. selbstschließend
const items = xml => xml.split(/<item\b/).slice(1).map(part => "<item " + part.split("</item>")[0]);

function primaryName(chunk){
  const m = chunk.match(/<name\b[^>]*type="primary"[^>]*value="([^"]*)"/)
        || chunk.match(/<name\b[^>]*value="([^"]*)"[^>]*type="primary"/)
        || chunk.match(/<name\b[^>]*value="([^"]*)"/);
  return m ? unescapeXml(m[1]) : null;
}

/* ---------- Beste Spielerzahl aus der BGG-Umfrage ---------- */

function bestPlayers(chunk, min, max){
  const poll = chunk.match(/<poll\b[^>]*name="suggested_numplayers"[\s\S]*?<\/poll>/);
  if(!poll) return null;
  const rows = poll[0].split(/<results\b/).slice(1).map(r => "<results " + r);
  const scored = [];
  for(const row of rows){
    const label = (row.match(/numplayers="([^"]*)"/) || [])[1];
    if(!label) continue;
    const n = parseInt(label, 10);                       // "4+" wird zu 4
    if(!Number.isFinite(n) || n < min || n > max) continue;
    const votes = t => {
      const m = row.match(new RegExp('<result\\b[^>]*value="' + t + '"[^>]*numvotes="(\\d+)"'))
            || row.match(new RegExp('<result\\b[^>]*numvotes="(\\d+)"[^>]*value="' + t + '"'));
      return m ? Number(m[1]) : 0;
    };
    scored.push({ n, best:votes("Best"), rec:votes("Recommended"), not:votes("Not%20Recommended") + votes("Not Recommended") });
  }
  if(!scored.length) return null;
  const top = Math.max(...scored.map(s => s.best));
  if(!top) return null;
  // Alle Spielerzahlen, die mindestens 70 % der Bestmarke holen — das ergibt die Spanne
  const good = scored.filter(s => s.best >= top * 0.7).map(s => s.n).sort((a,b) => a - b);
  return [good[0], good[good.length - 1]];
}

/* ---------- BGG-Kategorien zu Stimmungen ---------- */

const MOOD_RULES = [
  [/Party Game/i,                         ["party"]],
  [/Real-?time/i,                         ["party","schnell"]],
  [/Cooperative Game|Co-operative/i,      ["koop"]],
  [/Trivia|Educational/i,                 ["wissen"]],
  [/Word Game/i,                          ["reden","wissen"]],
  [/Deduction|Murder\/Mystery/i,          ["wissen"]],
  [/Humor|Acting|Storytelling/i,          ["reden","party"]],
  [/Science Fiction|Fantasy|Adventure|Horror|Movies|Novel-based|Wargame|Medieval|Mythology/i, ["thema"]],
  [/Puzzle|Abstract Strategy/i,           ["gruebeln"]],
  [/Animals|Environmental|Farming|Nature/i, ["entspannt"]]
];

function moodsFor(chunk, weight, playtime){
  const links = [...chunk.matchAll(/<link\b[^>]*type="boardgame(?:category|mechanic)"[^>]*value="([^"]*)"/g)]
    .map(m => unescapeXml(m[1])).join(" | ");
  const found = new Set();
  for(const [re, moods] of MOOD_RULES) if(re.test(links)) moods.forEach(m => found.add(m));
  if(weight >= 3) found.add("gruebeln");
  if(playtime && playtime <= 25) found.add("schnell");
  if(!found.size) found.add(weight >= 2.4 ? "gruebeln" : "schnell");
  return [...found].slice(0, 3);
}

/* ---------- Ein BGG-Eintrag zu einem Spiel der App ---------- */

function toGame(chunk){
  const name = primaryName(chunk);
  if(!name) return null;
  const min = num(chunk, "minplayers") || 1;
  const max = Math.max(num(chunk, "maxplayers") || min, min);
  const playing = num(chunk, "playingtime") || 30;
  const d0 = num(chunk, "minplaytime") || playing;
  const d1 = Math.max(num(chunk, "maxplaytime") || playing, d0);
  const weightRaw = Number(attr(chunk, "averageweight"));
  const weight = Number.isFinite(weightRaw) && weightRaw > 0 ? Math.round(weightRaw * 10) / 10 : 2;
  const best = bestPlayers(chunk, min, max) || [min, max];
  return {
    name, min, max, best,
    dur:[d0, d1],
    weight,
    moods: moodsFor(chunk, weight, d1),
    note:"",
    bggId: Number(attr(chunk, "item", "id")) || undefined
  };
}

/* ---------- Abfragen ---------- */

async function searchId(title){
  const exact = await get(API + "/search?type=boardgame&exact=1&query=" + encodeURIComponent(title));
  let list = items(exact);
  if(!list.length){
    await sleep(PAUSE_MS);
    const loose = await get(API + "/search?type=boardgame&query=" + encodeURIComponent(title));
    list = items(loose);
  }
  if(!list.length) return null;
  const norm = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
  const hit = list.find(c => norm(primaryName(c) || "") === norm(title)) || list[0];
  return { id: attr(hit, "item", "id"), name: primaryName(hit) };
}

async function fetchThings(ids){
  const out = [];
  for(let i = 0; i < ids.length; i += 20){
    const batch = ids.slice(i, i + 20);
    const xml = await get(API + "/thing?stats=1&id=" + batch.join(","));
    for(const chunk of items(xml)){
      const g = toGame(chunk);
      if(g) out.push(g);
    }
    if(i + 20 < ids.length) await sleep(PAUSE_MS);
  }
  return out;
}

async function collectionIds(user){
  const xml = await get(API + "/collection?own=1&excludesubtype=boardgameexpansion&username=" + encodeURIComponent(user));
  return items(xml).map(c => attr(c, "item", "objectid") || attr(c, "item", "id")).filter(Boolean);
}

/* ---------- Ablauf ---------- */

async function main(){
  const args = process.argv.slice(2);
  const titles = [], ids = [];
  let user = null, out = null;

  for(let i = 0; i < args.length; i++){
    const a = args[i];
    if(a === "--user") user = args[++i];
    else if(a === "--id") ids.push(args[++i]);
    else if(a === "--out") out = args[++i];
    else if(a === "--help" || a === "-h"){ process.stdout.write(helpText()); return; }
    else if(a.startsWith("--")) throw new Error("Unbekannte Option: " + a);
    else titles.push(a);
  }
  if(!titles.length && !ids.length && !user){ process.stdout.write(helpText()); return; }

  if(user){
    process.stderr.write("Sammlung von " + user + " holen …\n");
    const found = await collectionIds(user);
    process.stderr.write(found.length + " Spiele im Besitz.\n");
    ids.push(...found);
    await sleep(PAUSE_MS);
  }

  for(const title of titles){
    process.stderr.write('Suche "' + title + '" … ');
    const hit = await searchId(title);
    if(!hit){ process.stderr.write("nichts gefunden\n"); continue; }
    process.stderr.write(hit.name + " (#" + hit.id + ")\n");
    ids.push(hit.id);
    await sleep(PAUSE_MS);
  }

  if(!ids.length){ process.stderr.write("Nichts zu holen.\n"); process.exitCode = 1; return; }

  const games = await fetchThings([...new Set(ids)]);
  games.sort((a,b) => a.name.localeCompare(b.name, "de"));
  const json = JSON.stringify(games, null, 1);

  if(out){
    const { writeFileSync } = await import("node:fs");
    writeFileSync(out, json + "\n");
    process.stderr.write(games.length + " Spiele nach " + out + " geschrieben.\n");
  }else{
    process.stdout.write(json + "\n");
  }
  process.stderr.write("\nEinspielen: Text kopieren, auf der Seite unter „Sammlung bearbeiten“ →\n" +
                      "„Sicherung & Umzug“ einfügen und „Aus Text einspielen“ tippen.\n" +
                      "Die Notizen sind leer — die schreibst du am besten selbst.\n");
}

function helpText(){
  return [
    "Spieldaten von BoardGameGeek holen:",
    "",
    '  node tools/bgg.mjs "Sky Team" "Hive Pocket"     einzelne Titel',
    "  node tools/bgg.mjs --user DeinBggName           ganze BGG-Sammlung (nur Besitz)",
    "  node tools/bgg.mjs --id 224517                  direkt über die BGG-Nummer",
    "  node tools/bgg.mjs --user X --out sammlung.json in eine Datei schreiben",
    "",
    "Übernommen werden Spielerzahl, beste Besetzung (aus der BGG-Umfrage),",
    "Dauer und Anspruch (averageweight). Die Stimmungen sind aus den BGG-",
    "Kategorien geraten und wollen auf der Seite nachgebessert werden.",
    ""
  ].join("\n");
}

export { toGame, bestPlayers, moodsFor, items, primaryName };

const { pathToFileURL } = await import("node:url");
if(process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href){
  main().catch(err => {
    process.stderr.write("Abbruch: " + err.message + "\n");
    process.exitCode = 1;
  });
}
