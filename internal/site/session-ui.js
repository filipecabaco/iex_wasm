// Workspace controls shared by every generated page. Storage is local; no server receives checkpoints.
(function (root) {
  "use strict";
  const S = root.SnowglobeSessions;
  const newID = () => crypto.randomUUID?.() ?? Array.from(crypto.getRandomValues(new Uint8Array(16)),
    b => b.toString(16).padStart(2, "0")).join("");
  class SnowglobeSessionUI {
    constructor(config) {
      this.config = config;
      this.scope = new URL("./", location.href).pathname;
      this.records = [];
      this.revision = 0;
      this.settings = {};
      this.busy = false;
      this.captureBusy = false;
      this.blocked = false;
      this.timer = null;
      this.panel = document.getElementById("sessions");
      this.status = document.getElementById("session-status");
      this.help = document.getElementById("session-help");
      this.detail = document.getElementById("session-detail");
      this.select = document.getElementById("session-list");
      this.buttons = Array.from(this.panel.querySelectorAll("button, select, input"));
      document.getElementById("session-folder").hidden = typeof showDirectoryPicker !== "function";
      document.getElementById("session-save").onclick = () => this.operation(() => this.save());
      document.getElementById("session-fresh").onclick = () => this.operation(() => this.startFresh(), "Workspace not changed");
      document.getElementById("session-new").onclick = () => this.operation(() => this.newSession(), "Workspace not changed");
      document.getElementById("session-delete").onclick = () => this.operation(() => this.deleteSession(), "Workspace not deleted");
      document.getElementById("session-export").onclick = () => this.operation(() => this.exportSession(), "Backup not created");
      document.getElementById("session-import").onchange = e => {
        const file = e.target.files[0];
        e.target.value = "";
        if (file) this.operation(() => this.importSession(file), "Backup not restored");
      };
      document.getElementById("session-folder").onclick = () => {
        // Call the picker directly in the click handler, before any awaits lose user activation.
        const picked = showDirectoryPicker({ mode: "readwrite" });
        this.operation(async () => this.useFolder(await picked), "Folder not changed");
      };
      document.getElementById("session-reconnect").onclick = () => {
        const permission = this.settings.folderHandle.requestPermission({ mode: "readwrite" });
        this.operation(async () => {
          if (await permission !== "granted") throw new Error("Folder permission was not granted");
          this.reload();
        }, "Folder needs access");
      };
      document.getElementById("session-browser").onclick = () => this.operation(() => this.useBrowser(), "Storage not changed");
      this.select.onchange = () => this.operation(async () => {
        if (!confirm("Open this workspace? Changes since the last save will be lost.")) {
          this.select.value = this.active.id; return;
        }
        await this.setActive(this.select.value);
        this.reload();
      }, "Workspace not opened");
      // A popover must not take terminal space or remain over it while the user works.
      document.addEventListener("pointerdown", e => {
        if (!this.panel.contains(e.target)) this.panel.open = false;
      });
      document.addEventListener("keydown", e => {
        // Disabling a busy action can move focus to the body. Handle Escape there too,
        // before xterm consumes it, but leave terminal keys alone when the menu is closed.
        if (!this.closed && e.key === "Escape" && this.panel.open) {
          this.panel.open = false;
          this.panel.querySelector("summary")?.focus();
          e.preventDefault();
          e.stopPropagation();
        }
      }, true);
      addEventListener("pagehide", () => {
        this.closed = true;
        clearTimeout(this.timer);
        if (this.initialState) URL.revokeObjectURL(this.initialState);
        // No unload-time save. Keep the lock until document destruction: releasing it here
        // could let another tab write while a bfcache-suspended checkpoint is still in flight.
        this.vm?.stop().catch(() => {});
      });
      addEventListener("pageshow", e => { if (e.persisted) this.reload(); });
      this.controls();
    }
    reload() { location.reload(); }
    message(text, error = false, help = "", detail = "") {
      this.status.textContent = text;
      this.status.dataset.error = String(error);
      this.status.title = this.lastSaveInfo ?? help;
      this.help.textContent = help;
      this.help.hidden = !help;
      this.detail.textContent = detail || this.lastSaveInfo || "No saved version yet.";
      if (error) this.panel.open = true;
    }
    controls() {
      for (const el of this.buttons) el.disabled = this.busy || this.closed;
      const unavailable = !this.store || this.blocked;
      document.getElementById("session-save").disabled ||= unavailable || !this.vm;
      for (const id of ["session-fresh", "session-new", "session-delete", "session-import", "session-list", "session-folder", "session-browser"]) {
        document.getElementById(id).disabled ||= !this.browser;
      }
      document.getElementById("session-export").disabled ||= !crypto.subtle || !this.active || (!this.vm && !this.active.savedAt);
      document.getElementById("session-delete").disabled ||= !this.store || !this.active?.savedAt;
      document.getElementById("session-reconnect").hidden = !this.needsPermission;
      document.getElementById("session-browser").hidden = !this.settings.folderHandle;
      document.getElementById("session-browser").textContent = !this.blocked && (this.vm || this.active?.savedAt)
        ? "Save in this browser instead…" : "Start in this browser instead…";
      document.getElementById("session-folder").textContent = this.settings.folderHandle ? "Change folder…" : "Save to a folder…";
      document.getElementById("session-location").textContent = !this.browser && this.active
        ? "This workspace only lives in this tab. Download a backup before leaving."
        : this.settings.folderHandle ? "Automatic saves go to your chosen folder." : "Automatic saves stay in this browser.";
    }
    async operation(fn, failure = "Not saved") {
      if (this.busy || this.closed) return;
      this.busy = true;
      this.controls();
      try { await fn(); }
      catch (e) {
        if (e instanceof WebAssembly.RuntimeError) {
          this.blocked = true; // a trapped serializer may have leaked allocations; do not retry automatically
          this.message("Saving paused", true,
            "The workspace could not be captured, possibly because memory is low. Reload to try again. Your previous save is kept.", e.message);
        } else if (e.name !== "AbortError") {
          this.message(failure, true, e.name === "QuotaExceededError"
            ? "Storage is full. Download a backup or choose a folder. Your previous save is kept."
            : `${e.message}. Your previous saves are kept.`);
        }
      }
      finally { this.busy = false; this.controls(); }
    }
    async prepare() {
      try {
        this.release = await S.acquireLock(this.scope);
        this.browser = await S.BrowserStore.open(this.scope);
        this.settings = await this.browser.settings();
      } catch (e) {
        this.release?.();
        this.browser = null;
        this.active = { version: 1, id: newID(), name: "Temporary", config: this.config };
        this.message("Not saving in this tab", true, crypto.subtle
          ? "Your work stays in this tab only. Download a backup before leaving, or close other tabs and reload to try saving again."
          : "Open this demo on HTTPS or localhost to save your work.", e.message);
        this.controls();
        return true;
      }
      // Migrate the old opt-out: the simplified workspace always saves automatically.
      this.settings.autosave = true;
      this.store = this.browser;
      try {
        if (this.settings.folderHandle) {
          this.store = null; // folder failures must never redirect writes into browser storage
          this.needsPermission = await this.settings.folderHandle.queryPermission({ mode: "readwrite" }) !== "granted";
          if (this.needsPermission) {
            this.blocked = true;
            this.message("Folder needs access", true,
              "Reconnect your folder to reopen saved work, or use this browser instead. Your folder files are kept.");
            this.controls();
            return false;
          }
          const directory = await this.folderDirectory(this.settings.folderHandle);
          this.store = new S.FolderStore(directory);
        }
        const saved = this.settings.active ? await this.store.get(this.settings.active) : null;
        this.active = saved ?? { version: 1, id: this.settings.active ?? newID(), name: this.settings.pendingName ?? "Workspace", config: this.config };
        await this.setActive(this.active.id);
        await this.refreshList();
        if (saved && !S.compatible(saved, this.config)) {
          this.blocked = true;
          this.message("Saved work needs its original demo", true,
            "This demo has changed. Download your previous backup or start fresh. Your saved work is kept.");
          this.controls();
          return false;
        }
        if (saved) {
          this.initialState = URL.createObjectURL(await S.stateBlob(saved));
          this.revision = saved.revision ?? 0;
          this.records = [saved.console];
          this.replay = S.consoleEvents(await saved.console.arrayBuffer());
          this.message("Restoring your workspace…");
        } else this.message("Waiting for first save", false, "Your work saves automatically after about a minute. Use Save now before leaving sooner.");
        this.controls();
        return true;
      } catch (e) {
        if (this.initialState) URL.revokeObjectURL(this.initialState);
        this.blocked = true;
        this.message("Workspace needs attention", true,
          "Your saved work could not be opened. Try reconnecting your folder, use this browser instead, or start fresh. Existing saves are kept.", e.message);
        this.controls();
        return false;
      }
    }
    async setActive(id) {
      this.settings.active = id;
      await this.browser.settings(this.settings);
    }
    async refreshList() {
      const entries = await this.store.list();
      if (this.active && !entries.some(e => e.id === this.active.id)) entries.push(this.active);
      this.select.replaceChildren(...entries.map(c => {
        const option = document.createElement("option");
        option.value = c.id;
        option.textContent = c.name + (c.unreadable ? " (unreadable; kept)" : S.compatible(c, this.config) ? "" : " (needs original demo)");
        return option;
      }));
      this.select.value = this.active?.id;
    }
    attach(vm, term, applyResize) {
      this.vm = vm;
      this.applyResize = applyResize;
      if (this.initialState) URL.revokeObjectURL(this.initialState);
      this.initialState = null;
      this.replay = null;
      this.term = term;
      this.controls();
      if (this.active.savedAt) this.savedMessage();
      this.schedule();
    }
    record(bytes) { this.records.push(S.consoleRecord(bytes)); this.revision++; }
    resize(cols, rows) { this.records.push(S.resizeRecord(cols, rows)); }
    input() {
      if (!this.captureBusy) this.revision++;
      if (!this.captureBusy && this.store && !this.busy && !this.blocked) this.message("Changes waiting to save");
      return !this.captureBusy && !this.closed;
    }
    savedMessage() {
      this.lastSaveInfo = `Last saved ${new Date(this.active.savedAt).toLocaleString()} · ${(this.active.state.size / (1 << 20)).toFixed(1)} MB`;
      this.message(this.revision > (this.active.revision ?? 0) ? "Changes waiting to save"
        : this.settings.folderHandle ? "Saved to your folder" : "Saved on this device");
    }
    schedule(delay = 60000) {
      if (this.closed || !this.store || this.blocked) return;
      clearTimeout(this.timer);
      this.timer = setTimeout(async () => {
        const started = performance.now();
        if (!this.blocked && !this.busy && this.vm.running && !document.hidden) {
          await this.operation(() => this.save());
        }
        // Never spend most of the session serializing a large machine.
        this.schedule(Math.max(60000, (performance.now() - started) * 10));
      }, delay);
    }
    async checkpoint(label = "Saving…") {
      this.message(label);
      let console, revision;
      let bytes;
      this.captureBusy = true;
      try {
        bytes = await S.capture(this.vm, () => {
          console = new Blob(this.records); revision = this.revision;
          this.records = [console]; // compact the tape's record list without dropping bytes
        });
      }
      finally { this.captureBusy = false; this.applyResize?.(); }
      if (this.closed) await this.vm.stop();
      const packed = await S.packState(bytes);
      return { version: 1, id: this.active.id, name: this.active.name, config: this.config,
        savedAt: Math.max(Date.now(), (this.active.savedAt ?? 0) + 1), console, revision, ...packed };
    }
    async save() {
      if (!this.store || this.blocked || !this.vm) throw new Error("Workspace storage is unavailable");
      const c = await this.checkpoint();
      await this.store.put(c);
      this.active = c;
      delete this.settings.pendingName;
      this.savedMessage();
      // The checkpoint is already committed. Failure of ancillary settings/list updates
      // must not claim the user's machine state was lost.
      try { await this.browser.settings(this.settings); }
      catch (e) { this.message("Saved with a warning", true, "Your work is saved, but workspace settings could not be updated.", e.message); }
      try { await this.refreshList(); }
      catch (e) { this.message("Saved with a warning", true, "Your work is saved, but other saved workspaces could not be listed.", e.message); }
    }
    startFresh() { return this.newSession(`Workspace ${new Date().toLocaleString()}`); }
    async newSession(name) {
      const named = name === undefined;
      if (named) name = prompt("Workspace name (up to 100 characters):", "My workspace");
      if (name === null) return;
      if (!name.trim() || name.trim().length > 100) throw new Error("Choose a name between 1 and 100 characters");
      if ((this.vm || this.active?.savedAt || !named) && !confirm("Start a fresh workspace? Unsaved changes will be lost. Your saved work is kept under More options.")) return;
      // Save the name independently until its first checkpoint exists.
      this.settings.active = newID();
      this.settings.pendingName = name.trim();
      await this.browser.settings(this.settings);
      this.reload();
    }
    async deleteSession() {
      if (!confirm(`Delete the saved workspace “${this.active.name}”? This cannot be undone. Other workspaces are kept.`)) return;
      await this.store.remove(this.active.id);
      delete this.settings.active;
      delete this.settings.pendingName;
      await this.browser.settings(this.settings);
      this.reload();
    }
    async exportSession() {
      const c = this.vm && !this.blocked ? await this.checkpoint("Preparing backup…") : await this.store.get(this.active.id);
      if (!c) throw new Error("No saved version to download");
      const url = URL.createObjectURL(await S.encodeBackup(c));
      const link = document.createElement("a");
      link.href = url;
      link.download = `${c.id}.snowglobe`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      this.message("Backup ready", false, "Backups include private data. Keep this file safe. Automatic saves continue separately.");
    }
    async importSession(file) {
      const c = await S.decodeBackup(file);
      if (!S.compatible(c, this.config)) throw new Error("This backup needs the original compatible demo to restore it");
      if (!this.store) throw new Error("Reconnect your folder or use this browser first");
      if (!confirm("Restore this backup? Unsaved changes will be lost. Existing saved workspaces are kept.")) return;
      const imported = { ...c, id: newID(), name: c.name };
      await this.store.put(imported);
      await this.setActive(imported.id);
      this.reload();
    }
    async folderDirectory(handle) {
      const hash = await S.digest(new Blob([location.origin, this.scope]));
      return handle.getDirectoryHandle(`snowglobe-${hash.slice(0, 24)}`, { create: true });
    }
    async useBrowser() {
      const canKeep = !this.blocked && (this.vm || this.active?.savedAt);
      if (!confirm(canKeep ? "Save in this browser instead? Your folder saves are kept."
        : "Start in this browser instead? Changes since the last save will be lost. Your folder saves are kept.")) return;
      const settings = { autosave: true };
      if (canKeep) {
        const current = this.vm ? await this.checkpoint() : await this.store.get(this.active.id);
        const c = { ...current, id: newID() };
        await this.browser.put(c);
        settings.active = c.id;
      }
      await this.browser.settings(settings);
      this.reload();
    }
    async useFolder(handle) {
      const store = new S.FolderStore(await this.folderDirectory(handle));
      // Import the current session into its own UUID; never overwrite an existing folder session.
      const current = this.blocked ? null : this.vm ? await this.checkpoint("Saving to your folder…")
        : this.active?.savedAt ? await this.store.get(this.active.id) : null;
      if (current) {
        const c = { ...current, id: newID() };
        await store.put(c);
        this.settings.active = c.id;
      } else delete this.settings.active;
      delete this.settings.pendingName;
      this.settings.folderHandle = handle;
      await this.browser.settings(this.settings);
      this.reload();
    }
  }
  root.SnowglobeSessionUI = SnowglobeSessionUI;
})(globalThis);
