// snowglobe's service worker for sites with several CPUs: they share memory between Web Workers
// (SharedArrayBuffer), which browsers only allow in a cross-origin isolated page. Static hosts
// can't send the headers for that, so this worker adds them to the page itself.
//
// `snowglobe pwa` replaces this file with its own worker, which does the same and caches.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.mode !== "navigate" || new URL(request.url).origin !== location.origin) return;
  event.respondWith(fetch(request).then(isolate));
});

// Same-origin files need nothing more; fetch() to other origins uses CORS, which passes
function isolate(response) {
  if (!response.ok && response.status !== 304) return response;
  const headers = new Headers(response.headers);
  headers.set("Cross-Origin-Opener-Policy", "same-origin");
  headers.set("Cross-Origin-Embedder-Policy", "require-corp");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
