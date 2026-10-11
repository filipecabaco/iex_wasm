// Ordinary disk files, independent of whole-machine checkpoints. The disk is authoritative.
(function (root) {
  "use strict";
  const MAX_FILE_BYTES = 1 << 20;
  const MAX_TOTAL_BYTES = 16 << 20;
  const MAX_ENTRIES = 1000;
  function parts(path) {
    if (typeof path !== "string" || !path || path.length > 1024 || /[\\\x00-\x1f\x7f]/.test(path) ||
        path.split("/").some(p => !p || p === "." || p === "..")) throw new Error("Use a relative file path without empty parts, . or ..");
    return path.split("/");
  }
  const equal = (a, b) => a.length === b.length && a.every((byte, i) => byte === b[i]);
  function base64(bytes) {
    let binary = "";
    for (let i = 0; i < bytes.length; i += 4096) binary += String.fromCharCode(...bytes.subarray(i, i + 4096));
    return btoa(binary);
  }
  async function fileBytes(handle) {
    const file = await handle.getFile();
    if (file.size > MAX_FILE_BYTES) throw new Error(`File too large: ${handle.name} (limit 1 MiB)`);
    return new Uint8Array(await file.arrayBuffer());
  }
  class DiskFolder {
    constructor(directory) { this.directory = directory; }
    async parent(path, create = false) {
      const names = parts(path), name = names.pop();
      let directory = this.directory;
      for (const part of names) directory = await directory.getDirectoryHandle(part, { create });
      return { directory, name };
    }
    async read(path) {
      const { directory, name } = await this.parent(path);
      return fileBytes(await directory.getFileHandle(name));
    }
    async checked(path, expected) {
      if (expected !== null && !(expected instanceof Uint8Array)) throw new Error("An original file version is required");
      let current = null;
      try { current = await this.read(path); }
      catch (e) { if (e.name !== "NotFoundError") throw e; }
      if (expected === null && current !== null) throw new Error("File already exists; open it instead");
      if (expected !== null && (current === null || !equal(current, expected))) throw new Error("File changed on disk; reopen it before saving or deleting");
    }
    async write(path, data, expected) {
      parts(path);
      if (!(data instanceof Uint8Array) || data.length > MAX_FILE_BYTES) throw new Error("File too large or invalid (limit 1 MiB)");
      await this.checked(path, expected);
      const { directory, name } = await this.parent(path, true);
      const handle = await directory.getFileHandle(name, { create: expected === null });
      let writable;
      try {
        writable = await handle.createWritable();
        await writable.write(data);
        await writable.close(); // Only close commits; never report success on write().
      } catch (e) {
        try { await writable?.abort(); } catch {}
        // create:true can leave an empty file on the first failed write. Don't delete old content.
        if (expected === null) {
          try { if ((await handle.getFile()).size === 0) await directory.removeEntry(name); } catch {}
        }
        throw e;
      }
    }
    async remove(path, expected) {
      if (expected === null) throw new Error("Open the file before deleting it");
      await this.checked(path, expected);
      const { directory, name } = await this.parent(path);
      await directory.removeEntry(name); // Never recursive: only the explicitly selected file.
    }
    async removeDirectory(path) {
      const { directory, name } = await this.parent(path);
      const handle = await directory.getDirectoryHandle(name); // Never delete a regular file as a folder.
      const notEmpty = () => new Error("Folder is not empty; delete its contents first");
      for await (const entry of handle.entries()) throw notEmpty();
      try { await directory.removeEntry(name, { recursive: false }); }
      catch (e) {
        // The nonrecursive API also refuses files added after the emptiness check.
        if (e.name === "InvalidModificationError") throw notEmpty();
        throw e;
      }
    }
    async scan({ exclude = [] } = {}) {
      const entries = [];
      let total = 0;
      async function walk(directory, prefix = "") {
        for await (const [name, handle] of directory.entries()) {
          const path = prefix + name;
          if (exclude.includes(name)) continue;
          parts(path);
          if (entries.length >= MAX_ENTRIES) throw new Error("Folder too large (limit 1,000 files and directories)");
          const entry = { path, kind: handle.kind };
          entries.push(entry);
          if (handle.kind === "directory") await walk(handle, path + "/");
          else if (handle.kind === "file") {
            entry.data = await fileBytes(handle);
            total += entry.data.length;
            if (total > MAX_TOTAL_BYTES) throw new Error("Folder too large (limit 16 MiB total)");
          } else throw new Error(`Unsupported file type: ${path}`);
        }
      }
      await walk(this.directory);
      return entries.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
    }
  }
  class GuestBridge {
    constructor(vm, timeout = 30000, { port = 8090, maxReply = 65536 } = {}) {
      this.vm = vm; this.timeout = timeout; this.port = port; this.maxReply = maxReply;
    }
    request(request) {
      return new Promise((resolve, reject) => {
        let connection, settled = false, reply = "";
        const decoder = new TextDecoder("utf-8", { fatal: true });
        const finish = (error, value) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          try { connection?.abort(); } catch {}
          if (error) reject(error); else resolve(value);
        };
        const timer = setTimeout(() => finish(new Error("VPS file bridge timed out; reload the folder to retry")), this.timeout);
        try {
          connection = this.vm.connect(this.port);
          connection.on("connect", () => {
            try { connection.write(JSON.stringify(request) + "\n"); }
            catch (e) { finish(e); }
          });
          connection.on("close", () => finish(new Error("VPS file bridge connection closed before completion")));
          connection.on("data", chunk => {
            try {
              reply += decoder.decode(chunk, { stream: true });
              if (reply.length > this.maxReply) throw new Error("Invalid VPS file bridge response");
              const newline = reply.indexOf("\n");
              if (newline < 0) return;
              const response = JSON.parse(reply.slice(0, newline));
              if (typeof response.error === "string") throw new Error(response.error);
              if (!("result" in response)) throw new Error("Invalid VPS file bridge response");
              finish(null, response.result);
            } catch (e) { finish(e); }
          });
        } catch (e) { finish(e); }
      });
    }
  }
  class WorkingFolder {
    constructor(disk, bridge) { this.disk = disk; this.bridge = bridge; }
    async load() {
      // Fully validate/bound the disk import before changing any restored guest data.
      const entries = await this.disk.scan();
      await this.bridge.request({ op: "reset" });
      for (const entry of entries) {
        await this.bridge.request(entry.kind === "directory" ? { op: "mkdir", path: entry.path }
          : { op: "write", path: entry.path, data: base64(entry.data) });
      }
      return entries;
    }
    async mirror(request, action) {
      try { await this.bridge.request(request); }
      catch (cause) {
        const error = new Error(`${action} on disk, but the VPS could not be updated. Reload the folder to retry. ${cause.message}`);
        error.name = "DiskCommittedError";
        throw error;
      }
    }
    async save(path, data, expected) {
      await this.disk.write(path, data, expected);
      await this.mirror({ op: "write", path, data: base64(data) }, "Saved");
    }
    async remove(path, expected) {
      await this.disk.remove(path, expected);
      await this.mirror({ op: "remove", path }, "Deleted");
    }
    async removeDirectory(path) {
      await this.disk.removeDirectory(path);
      await this.mirror({ op: "rmdir", path }, "Deleted");
    }
  }
  const api = { DiskFolder, WorkingFolder, GuestBridge, base64, MAX_FILE_BYTES };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SnowglobeWorkingFolder = api;
})(globalThis);
