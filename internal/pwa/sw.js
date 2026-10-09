// snowglobe's service worker: the site keeps working offline once it has run.
//
// The shell (page, emulator, terminal, BIOS) is cached on install. Everything else (the snapshot,
// the warm pack, the guest's file blobs, including a pooled ../blobs store) is cached the first
// time the page fetches it, so installing doesn't download it a second time. Blobs are named by
// content hash and a new build gets a new cache, so cached files never go stale.
const CACHE = "__CACHE__";
const SHELL = __SHELL__;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("snowglobe-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// The page lists what it fetched before this worker was in control; keep those too
self.addEventListener("message", (event) => {
  const urls = event.data?.cache;
  if (!Array.isArray(urls)) return;
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(urls.map(async (url) => {
        if (new URL(url).origin !== location.origin || (await cache.match(url, { ignoreSearch: true }))) return;
        try {
          const response = await fetch(url);
          if (response.ok && response.status === 200) await cache.put(url, response);
        } catch {}
      }))),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== location.origin || request.headers.has("range")) return;

  // The page itself: the network first, so a new build shows up; the cache when offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request, { ignoreSearch: true }).then((hit) => hit || caches.match("./"))),
    );
    return;
  }

  // Everything else is immutable for this build: the cache first, then the network, kept
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(
      (hit) =>
        hit ||
        fetch(request).then((response) => {
          if (response.ok && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
    ),
  );
});
