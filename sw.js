/* Service worker of the web version (GitHub Pages).

   It turns the page into an offline page: after the first visit it also
   starts without a network, on the iPhone from the home screen.

   The page itself is loaded NETWORK FIRST. Anyone who is online always gets
   the newest version, without a version number standing here - the cache
   always has the same name, so there is no fourth digit to count up with each
   new version. Only when the network is missing does the cache step in.

   Everything else (icons, manifest) comes from the cache and is refreshed in
   the background: fast, and next time it is up to date.

   It does not touch foreign addresses (Wikidata): the answers do not belong
   in the cache, and a used-up throttling answer (429) must not stick around.
   The search needs a network anyway. */

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

// Put a response into the cache, but only an intact one.
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
  if(url.origin !== self.location.origin) return;   // Foreign: do not touch

  if(anfrage.mode === "navigate" || url.pathname.endsWith(".html")){
    // Page: network first, cache only as a fallback.
    ev.respondWith(
      fetch(anfrage).then(a => merken(anfrage, a)).catch(() =>
        caches.match(anfrage)
          .then(a => a || caches.match("index.html"))
          .then(a => a || caches.match("./"))
          .then(a => a || Response.error()))
    );
    return;
  }

  // Rest: from the cache, refreshed in the background.
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
