#!/usr/bin/env node
// Kleiner Server für "Was spielen wir heute?" auf dem eigenen Rechner.
// Liefert index.html aus und verwahrt die Sammlung in sammlung.json,
// damit alle Geräte im Heimnetz dieselbe Liste sehen.
//
//   node spieleabend-server.mjs              Port 8099, Dateien aus diesem Ordner
//   node spieleabend-server.mjs --port 9000  anderer Port
//
// Braucht Node 18 oder neuer, sonst nichts. Nur fürs Heimnetz gedacht:
// es gibt keine Anmeldung, wer die Adresse kennt, darf die Sammlung ändern.

import { createServer } from "node:http";
import { readFile, writeFile, rename, mkdir, readdir, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { networkInterfaces } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const argOf = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };

const PORT = Number(argOf("--port") || process.env.PORT || 8099);
const ROOT = argOf("--root") || HERE;
const DATA = argOf("--data") || join(ROOT, "sammlung.json");
const SICHERUNGEN = join(dirname(DATA), "sicherungen");
const MAX_SICHERUNGEN = 10;
const MAX_BODY = 2 * 1024 * 1024;          // 2 MB reichen für ein paar tausend Spiele

const TYPES = {
  ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8",
  ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8",
  ".png":"image/png", ".jpg":"image/jpeg", ".svg":"image/svg+xml",
  ".ico":"image/x-icon", ".webmanifest":"application/manifest+json"
};

const send = (res, code, body, type = "text/plain; charset=utf-8", extra = {}) => {
  res.writeHead(code, { "content-type":type, "cache-control":"no-store", ...extra });
  res.end(body);
};
const sendJson = (res, code, obj) => send(res, code, JSON.stringify(obj), TYPES[".json"]);

/* ---------- Sammlung lesen und schreiben ---------- */

async function readCollection(){
  try{
    const raw = await readFile(DATA, "utf8");
    const parsed = JSON.parse(raw);
    if(parsed && Array.isArray(parsed.games)) return parsed;
    if(Array.isArray(parsed)) return { games:parsed, updatedAt:0 };
  }catch(e){ /* noch keine Datei: leere Sammlung */ }
  return { games:[], updatedAt:0 };
}

// Nur der Inhalt zählt: wiederholte, gleiche PUTs sollen keine Kopienflut auslösen.
const inhaltVon = text => {
  try{
    const o = JSON.parse(text);
    return JSON.stringify(o && o.games !== undefined ? o.games : o);
  }catch(e){ return text; }
};

// Sichert den bisherigen Stand, bevor er überschrieben wird. Darf niemals
// verhindern, dass geschrieben wird - im Zweifel nur eine Zeile auf stderr.
async function sichere(neuerText){
  let alt;
  try{ alt = await readFile(DATA, "utf8"); }
  catch(e){ return; }                     // noch keine Datei: nichts zu sichern
  if(inhaltVon(alt) === inhaltVon(neuerText)) return;

  await mkdir(SICHERUNGEN, { recursive:true });
  const stempel = new Date().toISOString().replace(/[:.]/g, "-");
  await writeFile(join(SICHERUNGEN, "sammlung-" + stempel + ".json"), alt, "utf8");

  const alte = (await readdir(SICHERUNGEN))
    .filter(n => n.startsWith("sammlung-") && n.endsWith(".json"))
    .sort();                              // ISO-Zeitstempel: alphabetisch = chronologisch
  for(const name of alte.slice(0, Math.max(0, alte.length - MAX_SICHERUNGEN))){
    await unlink(join(SICHERUNGEN, name));
  }
}

let writing = Promise.resolve();          // Schreibvorgänge nacheinander, nie überlappend
function writeCollection(payload){
  writing = writing.then(async () => {
    const text = JSON.stringify(payload, null, 1);
    try{
      await sichere(text);
    }catch(e){
      process.stderr.write("Sicherung fehlgeschlagen (wird trotzdem gespeichert): " + e.message + "\n");
    }
    await mkdir(dirname(DATA), { recursive:true });
    const tmp = DATA + ".tmp";
    await writeFile(tmp, text, "utf8");
    await rename(tmp, DATA);              // erst umbenennen: nie eine halb geschriebene Datei
  });
  return writing;
}

function readBody(req){
  return new Promise((resolve, reject) => {
    let size = 0;
    const parts = [];
    req.on("data", c => {
      size += c.length;
      if(size > MAX_BODY){ reject(new Error("zu groß")); req.destroy(); return; }
      parts.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(parts).toString("utf8")));
    req.on("error", reject);
  });
}

/* ---------- Dateien ausliefern ---------- */

async function serveFile(res, urlPath){
  const rel = decodeURIComponent(urlPath.split("?")[0]);
  const wanted = rel === "/" || rel === "" ? "index.html" : rel.replace(/^\/+/, "");
  const full = normalize(join(ROOT, wanted));
  if(!full.startsWith(ROOT + sep) && full !== join(ROOT, "index.html"))
    return send(res, 403, "Verboten");                       // kein Ausbruch aus dem Ordner
  if(!existsSync(full)) return send(res, 404, "Nicht gefunden");
  const type = TYPES[extname(full).toLowerCase()] || "application/octet-stream";
  try{
    send(res, 200, await readFile(full), type);
  }catch(e){
    send(res, 500, "Datei nicht lesbar");
  }
}

/* ---------- Server ---------- */

const server = createServer(async (req, res) => {
  res.setHeader("x-content-type-options", "nosniff");
  const url = req.url || "/";

  if(url.split("?")[0] === "/api/sammlung"){
    if(req.method === "GET"){
      return sendJson(res, 200, await readCollection());
    }
    if(req.method === "PUT" || req.method === "POST"){
      let body;
      try{ body = await readBody(req); }
      catch(e){ return sendJson(res, 413, { error:"Die Sammlung ist zu groß." }); }
      let data;
      try{ data = JSON.parse(body); }
      catch(e){ return sendJson(res, 400, { error:"Das war kein gültiges JSON." }); }
      if(!data || !Array.isArray(data.games))
        return sendJson(res, 400, { error:"Erwartet wird ein Objekt mit einer Liste games." });
      const payload = { games:data.games, updatedAt:Date.now() };
      try{
        await writeCollection(payload);
      }catch(e){
        process.stderr.write("Schreiben fehlgeschlagen: " + e.message + "\n");
        return sendJson(res, 500, { error:"Konnte die Sammlung nicht speichern." });
      }
      return sendJson(res, 200, { ok:true, updatedAt:payload.updatedAt, count:payload.games.length });
    }
    return send(res, 405, "Methode nicht erlaubt", "text/plain; charset=utf-8", { allow:"GET, PUT" });
  }

  if(req.method !== "GET" && req.method !== "HEAD") return send(res, 405, "Methode nicht erlaubt");
  return serveFile(res, url);
});

server.listen(PORT, () => {
  const nets = Object.values(networkInterfaces()).flat()
    .filter(n => n.family === "IPv4" && !n.internal).map(n => n.address);
  process.stdout.write("\nSpieleabend läuft.\n\n");
  process.stdout.write("  Auf diesem Rechner:  http://localhost:" + PORT + "\n");
  for(const ip of nets) process.stdout.write("  Im Heimnetz:         http://" + ip + ":" + PORT + "\n");
  process.stdout.write("\n  Sammlung liegt in:   " + DATA + "\n");
  process.stdout.write("  Beenden mit Strg+C\n\n");
});

server.on("error", err => {
  if(err.code === "EADDRINUSE")
    process.stderr.write("\nPort " + PORT + " ist schon belegt. Anderen Port wählen:\n" +
                         "  node spieleabend-server.mjs --port 8100\n\n");
  else process.stderr.write("\nServer konnte nicht starten: " + err.message + "\n\n");
  process.exit(1);
});
