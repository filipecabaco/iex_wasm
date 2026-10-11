const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const workerPath = __dirname + '/preview-worker.js';
const available = fs.existsSync(workerPath);
test('private preview worker is shipped', () => assert.ok(available));
const check = (name, fn) => test(name, { skip: !available }, fn);
function worker() {
  const listeners = {};
  const context = { URL, Response, Request, Headers, MessageChannel, setTimeout, clearTimeout,
    location: { origin: 'https://demo.test' }, self: { registration: { scope: 'https://demo.test/snowglobe/fullstack/' },
      addEventListener: (name, fn) => listeners[name] = fn, clients: {} } };
  vm.runInNewContext(fs.readFileSync(workerPath, 'utf8'), context);
  return { ...context, listeners };
}
check('preview requests stay within the example scope and target one VM owner, including after worker restart', async () => {
  const w = worker();
  assert.equal(w.self.snowglobePreviewRequest(new Request('https://demo.test/other/__preview/id/')), false);
  assert.equal(w.self.snowglobePreviewRequest(new Request('https://else.test/snowglobe/fullstack/__preview/id/')), false);
  const calls = [];
  w.self.clients.get = async id => ({ url: 'https://demo.test/snowglobe/fullstack/', postMessage: (data, ports) => {
    calls.push([id, data]); ports[0].postMessage({ status: 200, headers: { 'Content-Type': 'text/plain' }, body: new TextEncoder().encode('hello').buffer });
  } });
  let result;
  w.listeners.fetch({ request: new Request('https://demo.test/snowglobe/fullstack/__preview/owner/supabase/rest/v1/notes?select=*', { method: 'POST', body: '{}' }), respondWith: p => result = p });
  const response = await result;
  assert.equal(await response.text(), 'hello');
  assert.equal(calls[0][0], 'owner');
  assert.equal(calls[0][1].path, '/supabase/rest/v1/notes?select=*');
  assert.equal(calls[0][1].method, 'POST');
  assert.equal(response.headers.get('Cache-Control'), 'no-store');
});
check('closed owners and clients outside the exact example page fail locally, never falling back to the host', async () => {
  for (const owner of [null, { url: 'https://demo.test/snowglobe/another/' }, { url: 'https://demo.test/snowglobe/fullstack/__preview/other/' }]) {
    const w = worker(); w.self.clients.get = async () => owner;
    let result;
    w.listeners.fetch({ request: new Request('https://demo.test/snowglobe/fullstack/__preview/missing/'), respondWith: p => result = p });
    assert.equal((await result).status, 503);
  }
});
check('empty-body HTTP statuses do not create illegal Responses', async () => {
  const w = worker(); w.self.clients.get = async () => ({ url: 'https://demo.test/snowglobe/fullstack/index.html',
    postMessage: (_, ports) => ports[0].postMessage({ status: 204, headers: {}, body: new ArrayBuffer(0) }) });
  let result; w.listeners.fetch({ request: new Request('https://demo.test/snowglobe/fullstack/__preview/id/supabase/rest/v1/notes'), respondWith: p => result = p });
  assert.equal((await result).status, 204);
});
