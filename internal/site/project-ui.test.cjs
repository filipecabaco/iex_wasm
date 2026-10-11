const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const available = fs.existsSync(__dirname + '/project-ui.js');
const P = available ? require('./project-ui.js') : {};
test('external-editor project UI is shipped', () => assert.ok(available));
const check = (name, fn) => test(name, { skip: !available }, fn);
check('starter initialization refuses nonempty folders without writing anything', async () => {
  let writes = 0;
  await assert.rejects(P.initialize({ directory: { entries: async function* () { yield ['existing', {}]; } }, write: () => writes++ }, []), /empty/);
  assert.equal(writes, 0);
});
check('starter is validated before writing, writes ordinary files only and never requests overwrite', async () => {
  const calls = [], disk = { directory: { entries: async function* () {} }, write: async (...args) => calls.push(args) };
  await assert.rejects(P.initialize(disk, [{ path: 'valid', data: '' }, { path: '../bad', data: '' }]), /path/);
  assert.equal(calls.length, 0);
  await P.initialize(disk, [{ path: 'src/+page.svelte', data: btoa('hello') }]);
  assert.equal(calls[0][0], 'src/+page.svelte');
  assert.equal(new TextDecoder().decode(calls[0][1]), 'hello');
  assert.equal(calls[0][2], null);
});

check('changing the selected source folder invalidates the previous preview link until the next sync', async t => {
  const previous = {};
  for (const name of ['document', 'location', 'addEventListener', 'confirm', 'showDirectoryPicker']) previous[name] = Object.getOwnPropertyDescriptor(globalThis, name);
  t.after(() => { for (const [name, descriptor] of Object.entries(previous)) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name];
  } });
  const nodes = new Map();
  globalThis.document = { getElementById: id => { if (!nodes.has(id)) nodes.set(id, { hidden: false, dataset: {},
    removeAttribute(name) { delete this[name]; } }); return nodes.get(id); } };
  globalThis.location = { href: 'https://demo.test/fullstack/' };
  globalThis.addEventListener = () => {};
  globalThis.confirm = () => true;
  globalThis.showDirectoryPicker = async () => ({ name: 'new-project', entries: async function* () {} });
  require('./working-folder.js');
  const ui = new globalThis.SnowglobeProjectUI({ captureBusy: false });
  ui.store = { settings: async () => {} }; ui.base = '/preview';
  ui.handle = { name: 'old-project' }; ui.previewURL = '/old-preview/'; ui.preview.hidden = false;
  ui.preview.onclick();
  ui.chooseButton.onclick();
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(ui.handle.name, 'new-project');
  assert.equal(ui.preview.hidden, true, 'A preview from another source folder must not be presented as the current project');
  assert.equal(ui.previewPane.hidden, true); assert.equal(ui.previewFrame.src, undefined);
  assert.notEqual(ui.status.dataset.error, 'true');
});

check('public npm reads strip CORS-blocked metadata headers but retain the supported Accept header', async t => {
  const original = globalThis.fetch; t.after(() => globalThis.fetch = original);
  const calls = []; globalThis.fetch = async (...args) => { calls.push(args); return new Response('{}'); };
  assert.equal(typeof P.npmFetch, 'function', 'The project needs a public-registry network adapter');
  await P.npmFetch('https://registry.npmjs.org/msn-weather', { method: 'GET', headers: new Headers({
    accept: 'application/vnd.npm.install-v1+json', 'npm-command': 'install', 'npm-auth-type': 'web', 'npm-session': 'test-session', 'if-none-match': 'etag'
  }) });
  assert.deepEqual(Object.fromEntries(calls[0][1].headers), { accept: 'application/vnd.npm.install-v1+json' });
  assert.equal(calls[0][1].credentials, 'omit');
  const options = { headers: { 'x-client-info': 'test' } };
  await P.npmFetch('https://api.github.com/zen', options);
  assert.equal(calls[1][1], options, 'Other APIs must retain their original networking contract');
  await assert.rejects(P.npmFetch('https://registry.npmjs.org/private', { headers: { authorization: 'test-only-auth' } }), /Authenticated/);
  assert.equal(calls.length, 2, 'Authenticated registry requests must not silently become anonymous reads');
});

check('explicit manifest commits preflight all files, refuse external edits and never export arbitrary guest paths', async () => {
  const encoder = new TextEncoder(), bytes = text => encoder.encode(text);
  const before = new Map([['package.json', bytes('{"name":"old"}')], ['package-lock.json', bytes('{"lockfileVersion":3}')]]);
  const files = [...before].map(([path, data]) => ({ path, data: Buffer.from(data).toString('base64') }));
  const calls = [], disk = { checked: async path => calls.push('check:'+path), write: async path => calls.push('write:'+path) };
  assert.equal(typeof P.commitManifests, 'function');
  await P.commitManifests(disk, files, before);
  assert.deepEqual(calls, ['check:package.json', 'check:package-lock.json', 'write:package.json', 'write:package-lock.json']);
  calls.length = 0; disk.checked = async path => { if (path === 'package-lock.json') throw new Error('File changed on disk'); };
  await assert.rejects(P.commitManifests(disk, files, before), /changed on disk/);
  assert.deepEqual(calls, [], 'No first-file write when another manifest already conflicts');
  await assert.rejects(P.commitManifests(disk, [{ path: '.env', data: 'e30=' }], before), /manifest/);
  await assert.rejects(P.commitManifests(disk, [{ path: 'package.json', data: 'bm90LWpzb24=' }], before));
  assert.deepEqual(calls, []);
});

async function uiFixture(t) {
  const previous = {};
  for (const name of ['document', 'location', 'addEventListener', 'confirm', 'SnowglobeWorkingFolder']) previous[name] = Object.getOwnPropertyDescriptor(globalThis, name);
  t.after(() => { for (const [name, descriptor] of Object.entries(previous)) {
    if (descriptor) Object.defineProperty(globalThis, name, descriptor); else delete globalThis[name];
  } });
  const nodes = new Map();
  globalThis.document = { getElementById: id => { if (!nodes.has(id)) nodes.set(id, { hidden: false, dataset: {}, inert: false,
    removeAttribute(name) { delete this[name]; } }); return nodes.get(id); } };
  globalThis.location = { href: 'https://demo.test/fullstack/' };
  globalThis.addEventListener = () => {}; globalThis.confirm = () => true;
  const data = new TextEncoder().encode('{"name":"disk-project"}');
  const entries = [{ path: 'package.json', kind: 'file', data }];
  const W = require('./working-folder.js');
  globalThis.SnowglobeWorkingFolder = { ...W, DiskFolder: class { async scan() { return entries; } } };
  const ui = new globalThis.SnowglobeProjectUI({ captureBusy: false, input() {} });
  ui.handle = { name: 'project' }; ui.base = '/__preview/test';
  const calls = []; ui.bridge = { request: async request => calls.push(request) };
  return { ui, calls, data };
}
check('preview opens and reloads inside the owner page and close unloads its application', async t => {
  const { ui } = await uiFixture(t);
  ui.preview.hidden = false; ui.previewURL = ui.base + '/';
  assert.equal(typeof ui.preview.onclick, 'function', 'Open preview must keep the VM owner page foreground');
  ui.preview.onclick();
  assert.equal(ui.previewPane.hidden, false);
  assert.equal(ui.previewFrame.src, ui.previewURL);
  ui.previewFrame.src = ui.previewURL + 'deep-route';
  ui.reloadPreviewButton.onclick();
  assert.equal(ui.previewFrame.src, ui.previewURL);
  ui.closePreviewButton.onclick();
  assert.equal(ui.previewPane.hidden, true);
  assert.equal(ui.previewFrame.src, undefined, 'Closing must unload the app, not merely hide a running iframe');
  assert.equal(ui.preview.hidden, false, 'A completed build remains available to reopen');
});
check('sync unloads the previous embedded preview even when the build fails', async t => {
  const { ui } = await uiFixture(t);
  ui.previewURL = ui.base + '/'; ui.preview.hidden = false;
  assert.equal(typeof ui.preview.onclick, 'function'); ui.preview.onclick();
  ui.rpc = { request: async request => {
    if (request.op === 'manifests') return { busy: false, files: [] };
    throw new Error('build failed');
  } };
  await assert.rejects(ui.sync(), /build failed/);
  assert.equal(ui.preview.hidden, true); assert.equal(ui.previewPane.hidden, true);
  assert.equal(ui.previewFrame.src, undefined);
});
check('sync refuses unsaved VM manifest changes before resetting any sources', async t => {
  const { ui, calls, data } = await uiFixture(t);
  ui.originals = new Map([['package.json', data]]);
  ui.rpc = { request: async () => ({ busy: false, files: [{ path: 'package.json', data: btoa('{"name":"npm-changed"}') }] }) };
  await assert.rejects(ui.sync(), /Save package manifests/);
  assert.deepEqual(calls, []);
  ui.rpc.request = async () => ({ busy: true, files: [] });
  await assert.rejects(ui.sync(), /running/); assert.deepEqual(calls, []);
});
check('failed source imports can be retried without pretending that a partial import is the manifest baseline', async t => {
  const { ui, calls } = await uiFixture(t);
  ui.rpc = { request: async request => request.op === 'manifests' ? { busy: false, files: [] } : true };
  const original = ui.bridge.request; let fail = true;
  ui.bridge.request = async request => { if (request.op === 'write' && fail) throw new Error('import interrupted'); return original(request); };
  await assert.rejects(ui.sync(), /import interrupted/); assert.equal(ui.originals, null);
  fail = false; await ui.sync();
  assert.equal(ui.originals.size, 1); assert.equal(ui.preview.hidden, false);
  assert.equal(calls.filter(call => call.op === 'reset').length, 2);
});
check('a partial manifest save reports committed files and advances only their conflict baseline', async () => {
  const originals = new Map([['package.json', new Uint8Array([1])], ['package-lock.json', new Uint8Array([2])]]);
  const files = [{ path: 'package.json', data: btoa('{"name":"new"}') }, { path: 'package-lock.json', data: btoa('{"lockfileVersion":3}') }];
  const disk = { checked: async () => {}, write: async path => { if (path === 'package-lock.json') throw new Error('commit failed'); } };
  await assert.rejects(P.commitManifests(disk, files, originals), /Saved package.json; remaining manifests were not saved/);
  assert.equal(new TextDecoder().decode(originals.get('package.json')), '{"name":"new"}');
  assert.deepEqual(originals.get('package-lock.json'), new Uint8Array([2]));
});
