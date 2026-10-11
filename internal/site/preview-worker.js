// Private browser -> owning tab -> guest transport. Never fetch or cache a preview URL.
// The owner ID is the browser-assigned client ID, so worker restarts need no routing state.
(() => {
  const prefix = new URL('__preview/', self.registration.scope).href;
  self.snowglobePreviewRequest = request => request.url.startsWith(prefix);
  self.addEventListener('message', event => {
    if (event.data?.type === 'preview-owner') event.ports[0]?.postMessage({ id: event.source.id });
  });
  self.addEventListener('fetch', event => {
    if (!self.snowglobePreviewRequest(event.request)) return;
    event.respondWith(forward(event.request).catch(error => new Response(
      'Preview unavailable. Keep the VM tab open and use Sync & preview. ' + error.message,
      { status: 503, headers: { 'Content-Type': 'text/plain', 'Cache-Control': 'no-store' } })));
  });
  async function forward(request) {
    const suffix = request.url.slice(prefix.length), slash = suffix.indexOf('/');
    if (slash < 1) throw new Error('Invalid preview route');
    const owner = await self.clients.get(suffix.slice(0, slash));
    const url = owner && new URL(owner.url);
    const scope = new URL(self.registration.scope);
    if (!url || url.origin !== scope.origin || ![scope.pathname, scope.pathname + 'index.html'].includes(url.pathname)) {
      throw new Error('The owning VM tab is closed');
    }
    const body = ['GET', 'HEAD'].includes(request.method) ? null : await request.arrayBuffer();
    if (body?.byteLength > 1 << 20) throw new Error('Request body exceeds 1 MiB');
    const reply = await new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Guest request timed out')); }, 60000);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close();
        if (event.data.error) reject(new Error(event.data.error)); else resolve(event.data);
      };
      owner.postMessage({ type: 'preview-fetch', method: request.method, path: suffix.slice(slash),
        headers: Object.fromEntries(request.headers), body }, [channel.port2]);
    });
    const headers = new Headers(reply.headers);
    headers.set('Cache-Control', 'no-store');
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    return new Response(request.method === 'HEAD' || [204, 205, 304].includes(reply.status) ? null : reply.body,
      { status: reply.status, headers });
  }
})();
