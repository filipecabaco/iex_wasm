// Opt-in example UI. Files on disk are never restored from, or replaced by, a machine checkpoint.
(function (root) {
  "use strict";
  const S = root.SnowglobeSessions, W = root.SnowglobeWorkingFolder;
  const utf8 = new TextEncoder();
  class SnowglobeFolderUI {
    constructor(sessions) {
      this.sessions = sessions;
      this.scope = "working-folder:" + new URL("./", location.href).pathname;
      this.panel = document.getElementById("editor");
      this.status = document.getElementById("working-folder-status");
      this.select = document.getElementById("editor-files");
      this.content = document.getElementById("editor-content");
      this.name = document.getElementById("editor-name");
      this.entries = [];
      this.dirty = false;
      this.busy = false;
      this.synced = false;
      document.getElementById("working-folder-choose").onclick = () => {
        if (!this.discard("Change working folder? VPS /workspace will be replaced by the selected disk folder.", !!this.handle)) return;
        // Permission/picker calls must start directly in the gesture, before any awaits.
        const picked = showDirectoryPicker({ id: "snowglobe-working-folder", mode: "readwrite" });
        return this.operation(async () => this.choose(await picked));
      };
      document.getElementById("working-folder-reconnect").onclick = () => {
        if (!this.discard("Reconnect working folder? Disk files will replace VPS /workspace.")) return;
        const permission = this.handle.requestPermission({ mode: "readwrite" });
        return this.operation(async () => {
          if (await permission !== "granted") throw new Error("Working folder permission was not granted");
          this.needsPermission = false;
          await this.mount();
        });
      };
      document.getElementById("working-folder-reload").onclick = () => {
        if (!this.discard("Reload the disk folder? This replaces VPS /workspace, including terminal edits. Disk files are not changed.", true)) return;
        return this.operation(() => this.mount());
      };
      this.select.onchange = () => {
        const path = this.select.value;
        if (!this.discard("Open another file?")) { this.select.value = this.path ?? ""; return; }
        return this.operation(() => this.open(path));
      };
      document.getElementById("editor-new").onclick = () => {
        const path = this.name.value;
        if (!this.discard("Create and open a new file?")) return;
        return this.operation(async () => {
          await this.workspace.save(path, new Uint8Array(), null);
          this.entries.push({ path, kind: "file" });
          const parts = path.split("/");
          for (let i = 1; i < parts.length; i++) {
            const parent = parts.slice(0, i).join("/");
            if (!this.entries.some(e => e.path === parent)) this.entries.push({ path: parent, kind: "directory" });
          }
          this.name.value = "";
          this.renderEntries();
          await this.open(path);
          this.message("Created on disk and in VPS /workspace.");
        });
      };
      document.getElementById("editor-save").onclick = () => this.operation(async () => {
        const data = utf8.encode(this.content.value);
        try { await this.workspace.save(this.path, data, this.original); }
        catch (e) {
          if (e.name === "DiskCommittedError") { this.original = data; this.originalText = this.content.value; this.dirty = false; }
          throw e;
        }
        this.original = data;
        this.originalText = this.content.value;
        this.dirty = false;
        this.message("Saved on disk and in VPS /workspace.");
      });
      document.getElementById("editor-delete").onclick = () => {
        const path = this.path, directory = this.isDirectory;
        if (!confirm(`Delete ${directory ? "empty folder " : ""}“${path}” from disk and VPS /workspace? This cannot be undone.${directory ? " Only an empty folder can be deleted; contents are never deleted recursively." : this.dirty ? " Unsaved editor changes will also be discarded." : ""}`)) return;
        return this.operation(async () => {
          try {
            if (directory) await this.workspace.removeDirectory(path);
            else await this.workspace.remove(path, this.original);
          }
          catch (e) {
            if (e.name === "DiskCommittedError") this.clearFile();
            throw e;
          }
          this.entries = this.entries.filter(e => e.path !== path && !(directory && e.path.startsWith(path + "/")));
          if (directory && this.name.value === path + "/") this.name.value = "";
          this.clearFile(); this.renderEntries();
          this.message("Deleted from disk and VPS /workspace.");
        });
      };
      this.content.oninput = () => {
        this.dirty = this.isText && this.content.value !== this.originalText;
        this.controls();
      };
      addEventListener("beforeunload", event => {
        if (!this.closed && (this.dirty || this.busy)) { event.preventDefault(); event.returnValue = ""; }
      });
      addEventListener("pagehide", () => {
        this.closed = true;
        // Keep the writer lock until destruction, including bfcache suspension/in-flight writes.
      });
      this.controls();
    }
    message(text, error = false) { this.status.textContent = text; this.status.dataset.error = String(error); }
    controls() {
      const disabled = this.busy || this.closed;
      const ready = !disabled && this.workspace && this.synced;
      for (const id of ["editor-new", "editor-name", "editor-files"]) document.getElementById(id).disabled = !ready;
      this.content.disabled = !ready || !this.path || !this.isText;
      document.getElementById("editor-save").disabled = !ready || !this.path || !this.isText || !this.dirty;
      const remove = document.getElementById("editor-delete");
      remove.disabled = !ready || !this.path;
      remove.textContent = this.isDirectory ? "Delete empty folder…" : "Delete file…";
      document.getElementById("working-folder-choose").disabled = disabled || !this.browser || typeof showDirectoryPicker !== "function";
      document.getElementById("working-folder-reconnect").hidden = !this.needsPermission;
      document.getElementById("working-folder-reconnect").disabled = disabled;
      document.getElementById("working-folder-reload").disabled = disabled || !this.handle || this.needsPermission;
      document.getElementById("working-folder-location").textContent = this.handle
        ? `Working folder: ${this.handle.name || "Chosen folder"} → VPS /workspace${this.needsPermission ? " (needs access)" : ""}`
        : "No working folder selected.";
      document.getElementById("editor-path").textContent = this.path
        ? this.path + (this.isDirectory ? "/" : "") : "Select a file or folder";
      document.getElementById("editor-dirty").hidden = !this.dirty;
    }
    discard(message, requiresConfirmation = false) {
      if (this.closed || this.busy) return false;
      return (!this.dirty && !requiresConfirmation) ||
        confirm(`${message}${this.dirty ? " Unsaved editor changes will be discarded." : ""}`);
    }
    async operation(fn) {
      if (this.busy || this.closed || this.sessions?.captureBusy) return;
      this.busy = true; this.controls();
      this.message("Working… Keep this tab open until finished.");
      try { await fn(); }
      catch (e) {
        if (e.name === "DiskCommittedError") this.synced = false;
        if (this.handle && e.name === "NotAllowedError") {
          this.needsPermission = true; this.synced = false;
          this.message("Working folder access was lost. Reconnect the working folder to continue. Unsaved editor changes are kept.", true);
        } else if (e.name !== "AbortError") this.message(e.message, true);
        else this.message(this.workspace && this.synced ? "Folder ready. No changes made." : "Folder selection cancelled. No disk files changed.");
      } finally { this.busy = false; this.controls(); }
    }
    async attach(vm) {
      this.vm = vm;
      this.bridge ??= new W.GuestBridge(vm);
      if (typeof showDirectoryPicker !== "function") {
        this.message("Working folders need desktop Chrome or Edge on HTTPS or localhost. No disk folder is connected.", true);
        this.controls(); return;
      }
      await this.operation(async () => {
        this.release = await S.acquireLock(this.scope);
        this.browser = await S.BrowserStore.open(this.scope);
        const settings = await this.browser.settings();
        this.handle = settings.handle;
        if (!this.handle) { this.message("Choose a working folder to begin. Existing disk files are kept."); return; }
        this.needsPermission = await this.handle.queryPermission({ mode: "readwrite" }) !== "granted";
        if (this.needsPermission) { this.message("Reconnect the working folder to load disk files. No disk files have been changed.", true); return; }
        await this.mount();
      });
    }
    async choose(handle) {
      // Validate before changing the remembered handle or the existing guest workspace.
      await new W.DiskFolder(handle).scan();
      await this.browser.settings({ handle });
      this.handle = handle;
      this.needsPermission = false;
      await this.mount();
    }
    clearFile() {
      this.path = null; this.original = null; this.originalText = ""; this.isText = false; this.isDirectory = false;
      this.content.value = ""; this.dirty = false;
    }
    renderEntries() {
      const entries = this.entries.slice().sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
      this.select.replaceChildren(...entries.map(entry => {
        const option = document.createElement("option");
        option.value = entry.path;
        option.textContent = entry.path + (entry.kind === "directory" ? "/" : "");
        return option;
      }));
      if (!entries.length) {
        const option = document.createElement("option"); option.textContent = "No files or folders — create a file above"; option.disabled = true;
        this.select.append(option);
      }
      this.select.value = this.path ?? "";
    }
    async mount() {
      this.message("Loading disk files into VPS /workspace… Keep this tab open.");
      const workspace = new W.WorkingFolder(new W.DiskFolder(this.handle), this.bridge);
      this.synced = false; this.workspace = null; this.clearFile(); this.controls();
      // The guest must keep running to answer the bridge; only terminal interaction is gated.
      const terminal = document.getElementById("terminal"), keys = document.getElementById("keys");
      const inert = terminal.inert, keysInert = keys.inert;
      terminal.inert = keys.inert = true;
      try {
        this.entries = await workspace.load();
        this.workspace = workspace; this.synced = true; this.renderEntries();
        const first = this.entries.find(e => e.kind === "file");
        if (first) await this.open(first.path);
        else this.message("Folder ready. Create a file to begin.");
      } finally { terminal.inert = inert; keys.inert = keysInert; }
    }
    async open(path) {
      if (this.entries.some(e => e.path === path && e.kind === "directory")) {
        this.clearFile(); this.path = path; this.isDirectory = true; this.select.value = path;
        this.name.value = path + "/";
        this.message("Folder selected. Add a filename to the path above to create a file here, or use Delete empty folder. Nonempty folders cannot be deleted.");
        this.controls(); return;
      }
      const data = await this.workspace.disk.read(path);
      let text;
      try {
        // Preserve a UTF-8 BOM instead of silently removing it on save. Never lossy-decode binary.
        text = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(data);
        if (text.includes("\0")) text = undefined;
      } catch { text = undefined; }
      this.path = path; this.original = data; this.originalText = text ?? ""; this.isText = text !== undefined; this.isDirectory = false;
      this.content.value = text ?? ""; this.dirty = false; this.select.value = path;
      this.message(this.isText ? "Folder ready. Edits are saved only with Save file to disk."
        : "Binary/non-UTF-8 file: mirrored unchanged to the VPS, but not editable as text.");
      this.controls();
    }
  }
  root.SnowglobeFolderUI = SnowglobeFolderUI;
})(globalThis);
