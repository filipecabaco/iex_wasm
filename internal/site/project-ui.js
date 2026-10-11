// Native editors own disk sources. Only starter initialization and explicit manifest commits write them.
(function (root) {
  'use strict';
  const exclude = ['node_modules', '.git', '.svelte-kit', 'build', 'dist', '.snowglobe'];
  const decode = data => Uint8Array.from(atob(data), c => c.charCodeAt(0));
  async function npmFetch(target, options = {}) {
    const url = new URL(target);
    if (url.hostname !== 'registry.npmjs.org' || !['GET', 'HEAD'].includes((options.method ?? 'GET').toUpperCase())) {
      return root.fetch(target, options);
    }
    const original = new Headers(options.headers);
    if (original.has('authorization') || url.username || url.password) throw new Error('Authenticated npm registry requests are not supported by this public-package adapter');
    // npm's telemetry and conditional headers trigger a preflight the public registry rejects.
    // npm still validates tarball integrity; only anonymous public reads are adapted.
    const headers = new Headers();
    if (original.has('accept')) headers.set('accept', original.get('accept'));
    return root.fetch(target, { ...options, headers, credentials: 'omit' });
  }
  function manifestFiles(files) {
    if (!Array.isArray(files) || files.length < 1 || files.length > 2) throw new Error('Invalid package manifest export');
    const result = new Map();
    for (const file of files) {
      if (!['package.json', 'package-lock.json'].includes(file.path) || result.has(file.path) || typeof file.data !== 'string') {
        throw new Error('Invalid package manifest path');
      }
      if (file.data.length > 1398104) throw new Error('Package manifest too large');
      const data = decode(file.data);
      if (data.length > 1 << 20) throw new Error('Package manifest too large');
      const json = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(data));
      if (!json || typeof json !== 'object' || Array.isArray(json)) throw new Error('Invalid package manifest JSON');
      result.set(file.path, data);
    }
    if (!result.has('package.json')) throw new Error('Missing package.json manifest');
    return result;
  }
  const equal = (a, b) => a?.length === b?.length && (a ?? []).every((byte, i) => byte === b[i]);
  function sameManifests(files, originals) {
    const current = manifestFiles(files);
    return ['package.json', 'package-lock.json'].every(path => equal(current.get(path) ?? null, originals.get(path) ?? null));
  }
  async function commitManifests(disk, files, originals) {
    const current = manifestFiles(files);
    if (!(originals instanceof Map)) throw new Error('Sync this project before saving package manifests');
    if (originals.has('package-lock.json') && !current.has('package-lock.json')) throw new Error('Missing VM lockfile; regenerate it with npm install before saving manifests');
    for (const path of current.keys()) await disk.checked(path, originals.get(path) ?? null);
    const saved = [];
    try {
      for (const [path, data] of current) {
        await disk.write(path, data, originals.get(path) ?? null);
        originals.set(path, data); saved.push(path);
      }
    } catch (error) {
      throw new Error((saved.length ? `Saved ${saved.join(', ')}; remaining manifests were not saved. ` : '') + error.message);
    }
  }
  async function initialize(disk, files) {
    for await (const entry of disk.directory.entries()) throw new Error('Choose a completely empty folder for the starter');
    if (!Array.isArray(files) || files.length > 1000) throw new Error('Invalid starter');
    const prepared = []; let total = 0;
    for (const file of files) {
      if (typeof file.path !== 'string' || !file.path || file.path.length > 1024 || /[\\\x00-\x1f\x7f]/.test(file.path) ||
          file.path.split('/').some(p => !p || p === '.' || p === '..')) throw new Error('Invalid starter path');
      if (typeof file.data !== 'string' || file.data.length > 1398104) throw new Error('Starter file too large');
      const data = decode(file.data); total += data.length;
      if (data.length > 1 << 20 || total > 16 << 20) throw new Error('Starter too large');
      prepared.push({ path: file.path, data });
    }
    for (const file of prepared) await disk.write(file.path, file.data, null);
  }
  class SnowglobeProjectUI {
    constructor(sessions) {
      this.sessions = sessions;
      this.scope = 'project-folder:' + new URL('./', location.href).pathname;
      this.status = document.getElementById('project-status');
      this.chooseButton = document.getElementById('project-choose');
      this.reconnectButton = document.getElementById('project-reconnect');
      this.syncButton = document.getElementById('project-sync');
      this.initButton = document.getElementById('project-init');
      this.manifestsButton = document.getElementById('project-manifests'); this.originals = null;
      this.preview = document.getElementById('project-preview');
      this.previewPane = document.getElementById('project-preview-pane');
      this.previewFrame = document.getElementById('project-preview-frame');
      this.reloadPreviewButton = document.getElementById('project-preview-reload');
      this.closePreviewButton = document.getElementById('project-preview-close');
      this.preview.onclick = () => {
        if (this.preview.hidden || !this.previewURL) return;
        this.previewFrame.src = this.previewURL; this.previewPane.hidden = false;
      };
      this.reloadPreviewButton.onclick = () => { if (this.previewURL) this.previewFrame.src = this.previewURL; };
      this.closePreviewButton.onclick = () => this.closePreview();
      this.chooseButton.onclick = () => {
        if (this.busy) return;
        if (!confirm('Choose a trusted project folder. Its code runs on this site’s origin and can access this site’s browser data. Only starter initialization and the explicit Save package manifests button write disk files; sync never writes them.')) return;
        const picked = showDirectoryPicker({ id: 'snowglobe-svelte-project', mode: 'readwrite' });
        void this.operation(async () => {
          const handle = await picked;
          await new root.SnowglobeWorkingFolder.DiskFolder(handle).scan({ exclude });
          await this.store.settings({ handle }); this.handle = handle; this.needsPermission = false;
          this.originals = null; this.preview.hidden = true; this.closePreview();
          this.message('Folder connected. Edit it in your local editor, then Sync & preview.');
        });
      };
      this.reconnectButton.onclick = () => {
        const permission = this.handle.requestPermission({ mode: 'readwrite' });
        void this.operation(async () => {
          if (await permission !== 'granted') throw new Error('Project folder access was not granted');
          this.needsPermission = false;
          this.message('Folder reconnected. Use Sync & preview to import current disk files.');
        });
      };
      this.syncButton.onclick = () => this.operation(() => this.sync());
      this.manifestsButton.onclick = () => this.operation(async () => {
        const guest = await this.rpc.request({ op: 'manifests' });
        if (guest.busy) throw new Error('A dependency operation is running; wait before saving manifests');
        await commitManifests(new root.SnowglobeWorkingFolder.DiskFolder(this.handle), guest.files, this.originals);
        this.sessions.input();
        this.message('Package manifests saved to disk. Sync & preview to use them; node_modules stays in the VM cache.');
      });
      this.initButton.onclick = () => {
        if (!confirm('Write the SvelteKit + shadcn notes starter into this empty disk folder? Existing files are never overwritten.')) return;
        void this.operation(async () => {
          this.message('Writing starter files to disk… Keep this tab open. A failed write can leave a partial starter.');
          const files = await this.rpc.request({ op: 'starter' });
          await initialize(new root.SnowglobeWorkingFolder.DiskFolder(this.handle), files);
          await this.sync();
        });
      };
      navigator.serviceWorker?.addEventListener('message', event => {
        if (event.source !== navigator.serviceWorker.controller || event.data?.type !== 'preview-fetch' || !event.ports[0]) return;
        const { method, path, headers, body } = event.data;
        void this.rpc.request({ op: 'http', method, path, headers, body: body ? root.SnowglobeWorkingFolder.base64(new Uint8Array(body)) : undefined })
          .then(reply => {
            const bytes = decode(reply.body);
            event.ports[0].postMessage({ status: reply.status, headers: reply.headers, body: bytes.buffer }, [bytes.buffer]);
          }, error => event.ports[0].postMessage({ error: error.message }));
      });
      addEventListener('beforeunload', event => { if (this.busy) { event.preventDefault(); event.returnValue = ''; } });
      this.controls();
    }
    message(text, error = false) { this.status.textContent = text; this.status.dataset.error = String(error); }
    controls() {
      this.chooseButton.disabled = this.busy || !this.store || typeof showDirectoryPicker !== 'function';
      this.reconnectButton.hidden = !this.needsPermission;
      this.reconnectButton.disabled = this.busy;
      this.syncButton.disabled = this.initButton.disabled = this.busy || !this.handle || this.needsPermission || !this.base;
      this.manifestsButton.disabled = this.syncButton.disabled || !this.originals;
      document.getElementById('project-location').textContent = this.handle
        ? `Working folder: ${this.handle.name} → VM /workspace${this.needsPermission ? ' (needs access)' : ''}` : 'No working folder selected.';
    }
    async operation(fn) {
      if (this.busy || this.sessions.captureBusy) return;
      this.busy = true; this.controls();
      try { await fn(); }
      catch (error) {
        if (error.name === 'NotAllowedError') this.needsPermission = true;
        if (error.name !== 'AbortError') this.message(error.message, true);
      } finally { this.busy = false; this.controls(); }
    }
    async attach(vm) {
      const W = root.SnowglobeWorkingFolder;
      this.bridge = new W.GuestBridge(vm);
      this.rpc = new W.GuestBridge(vm, 1230000, { port: 8091, maxReply: 24 << 20 });
      await this.operation(async () => {
        const registration = await navigator.serviceWorker.register('sw.js');
        await navigator.serviceWorker.ready;
        if (!navigator.serviceWorker.controller) throw new Error('Reload once to enable the private preview service worker.');
        const id = await new Promise((resolve, reject) => {
          const channel = new MessageChannel();
          const timer = setTimeout(() => { channel.port1.close(); reject(new Error('Preview worker did not respond. Reload the VM tab.')); }, 10000);
          channel.port1.onmessage = event => { clearTimeout(timer); channel.port1.close(); resolve(event.data.id); };
          navigator.serviceWorker.controller.postMessage({ type: 'preview-owner' }, [channel.port2]);
        });
        this.base = new URL('__preview/' + id, registration.scope).pathname;
        if (typeof showDirectoryPicker !== 'function') throw new Error('Working folders require desktop Chrome/Edge on HTTPS or localhost.');
        this.release = await root.SnowglobeSessions.acquireLock(this.scope);
        this.store = await root.SnowglobeSessions.BrowserStore.open(this.scope);
        const settings = await this.store.settings(); this.handle = settings.handle;
        this.needsPermission = this.handle && await this.handle.queryPermission({ mode: 'readwrite' }) !== 'granted';
        // Disk import is explicit; stale checkpoint files are never served until a current sync succeeds.
        this.message(this.needsPermission ? 'Reconnect your project folder, then Sync & preview.' : 'Choose your project folder. For an empty folder, use Create starter. Edit locally, then Sync & preview.');
      });
    }
    closePreview() {
      this.previewPane.hidden = true;
      this.previewFrame.removeAttribute('src');
    }
    async sync() {
      this.preview.hidden = true; this.closePreview();
      this.message('Importing disk sources into /workspace… Disk files are not changed.');
      const W = root.SnowglobeWorkingFolder, disk = new W.DiskFolder(this.handle);
      const entries = await disk.scan({ exclude });
      if (!entries.some(entry => entry.path === 'package.json')) throw new Error('No package.json found. Use Create starter for an empty folder.');
      const guest = await this.rpc.request({ op: 'manifests' });
      if (guest.busy) throw new Error('A dependency operation is running; wait before syncing');
      if (this.originals && !sameManifests(guest.files, this.originals)) {
        throw new Error('VM package manifests changed. Click Save package manifests to disk before syncing; this protects your npm changes.');
      }
      const originals = new Map(entries.filter(entry => entry.kind === 'file' && ['package.json', 'package-lock.json'].includes(entry.path)).map(entry => [entry.path, entry.data]));
      if (!this.originals && guest.files.length && !sameManifests(guest.files, originals) &&
          !confirm('This sync replaces VM sources and package manifests. Unsaved VM-only npm changes will be lost. Save those in their original project first, or continue to replace them?')) return;
      const terminal = document.getElementById('terminal'); const inert = terminal.inert; terminal.inert = true;
      try {
        this.originals = null;
        await this.bridge.request({ op: 'reset' });
        for (const entry of entries) await this.bridge.request(entry.kind === 'directory' ? { op: 'mkdir', path: entry.path }
          : { op: 'write', path: entry.path, data: W.base64(entry.data) });
        this.originals = originals;
        this.message('Preparing dependencies and building the SvelteKit SPA inside the VM… Keep this tab open.');
        await this.rpc.request({ op: 'build', base: this.base });
        this.sessions.input();
        this.previewURL = this.base + '/'; this.preview.hidden = false;
        this.message('Build ready. Open preview inside this page to keep the VM foreground. Edits stay on disk; Save now separately preserves the database.');
      } finally { terminal.inert = inert; }
    }
  }
  root.SnowglobeProjectUI = SnowglobeProjectUI;
  root.SnowglobeProjectFetch = npmFetch;
  if (typeof module !== 'undefined' && module.exports) module.exports = { initialize, npmFetch, commitManifests };
})(globalThis);
