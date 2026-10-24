/* Service Worker der Web-Version (GitHub Pages).

   Er macht aus der Seite eine Offline-Seite: nach dem ersten Besuch startet
   sie auch ohne Netz, auf dem iPhone vom Home-Bildschirm aus.

   Die Seite selbst wird NETZ ZUERST geladen. Wer online ist, bekommt damit
   immer die neueste Fassung, ohne dass hier eine Versionsnummer steht - der
   Cache heisst immer gleich, es gibt keine vierte Stelle, die bei einer neuen
   Fassung hochzuzaehlen waere. Nur wenn das Netz fehlt, springt der Cache ein.

   Alles andere (Symbole, Manifest) kommt aus dem Cache und wird im Hintergrund
   aufgefrischt: schnell, und beim naechsten Mal ist es aktuell.

   Fremde Adressen (Wikidata) fasst er nicht an: Die Antworten gehoeren nicht
   in den Cache, und eine verbrauchte Drosselantwort (429) darf nicht haengen
   bleiben. Die Suche braucht ohnehin Netz. */

const CACHE = "spieleabend";
const VORRAT = ["./", "index.html", "manifest.webmanifest",
                "icon-32.png", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(VORRAT)));
  self.skipWaiting();
});

self.addEventListener("activate", ev => {
  ev.waitUntil(
    caches.keys()
      .then(namen => Promise.all(namen.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Antwort in den Cache legen, aber nur eine heile.
function merken(anfrage, antwort){
  if(!antwort || !antwort.ok) return antwort;
  const kopie = antwort.clone();
  caches.open(CACHE).then(c => c.put(anfrage, kopie)).catch(() => {});
  return antwort;
}

self.addEventListener("fetch", ev => {
  const anfrage = ev.request;
  if(anfrage.method !== "GET") return;
  const url = new URL(anfrage.url);
  if(url.origin !== self.location.origin) return;   // Fremdes: nicht anfassen

  if(anfrage.mode === "navigate" || url.pathname.endsWith(".html")){
    // Seite: Netz zuerst, Cache nur als Rueckfall.
    ev.respondWith(
      fetch(anfrage).then(a => merken(anfrage, a)).catch(() =>
        caches.match(anfrage)
          .then(a => a || caches.match("index.html"))
          .then(a => a || caches.match("./"))
          .then(a => a || Response.error()))
    );
    return;
  }

  // Rest: aus dem Cache, im Hintergrund auffrischen.
  ev.respondWith(
    caches.match(anfrage).then(gemerkt => {
      const frisch = fetch(anfrage).then(a => merken(anfrage, a));
      if(gemerkt){
        ev.waitUntil(frisch.catch(() => {}));
        return gemerkt;
      }
      return frisch;
    })
  );
});
