# TypeScript working-folder editor

A minimal disk-backed text editor beside the TypeScript + Zod/Linux terminal. It uses the same
pinned `tsx` and Zod dependencies as `examples/typescript`; it does not add React yet.

```sh
go build -o snowglobe ./cmd/snowglobe
./snowglobe build examples/editor --out dist/editor
./snowglobe serve dist/editor
```

Open `http://localhost:8000` in desktop Chrome or Edge:

1. Click **Choose working folder…** and grant read/write access to a small project folder.
   Choose a folder you trust this site to access, not your home directory.
2. Enter `hello.ts` in **New file path**, then click **New file**. This creates an ordinary,
   initially empty file in that folder.
3. Enter `console.log("hello from disk");` and click **Save file to disk**. Wait for
   **Saved on disk and in VPS /workspace.**
4. In the terminal, try:

   ```ts
   await fs.readdir("/workspace")
   await fs.readFile("/workspace/hello.ts", "utf8")
   await import("./hello.ts")
   ```

5. Refresh, or close and reopen the page at the same origin and URL. The folder choice is
   remembered in IndexedDB; when permission is still granted, its files load automatically.
   If Chrome/Edge requires access again, click **Reconnect working folder**. Browsers do not
   expose the full OS path, so the editor shows the folder name and the guest path.
6. The list shows files **and folders**, including empty folders; folders end with `/`.
   Selecting a folder prepares the new-file path inside it, but does not enable text editing.
   Deleting the last file leaves its empty folder visible. To remove the folder too, select it,
   click **Delete empty folder…**, and confirm. Non-empty folders cannot be deleted; neither
   the disk operation nor the guest operation deletes contents recursively.
7. Open a file and click **Delete file…**, then confirm. This deletes that one file from disk
   and the VPS mirror. Deletion is permanent; use version control or backups for important work.

## What is persisted

**Working folder** contains ordinary files, not `.snowglobe` session bundles. Editor saves
commit to disk immediately through `FileSystemWritableFileStream.close()`, then update the
VPS. Saving the whole machine with **Save now** is separate and is not required for file
persistence. Starting a fresh machine session does not clear the working folder.

**Disk is authoritative.** Every page start and **Reload folder into VPS** reads the selected
folder and replaces the guest's `/workspace` contents. This also applies after restoring an
older machine checkpoint: disk edits/deletions win, so deleted files do not reappear. A failed
or oversized disk scan does not clear the guest; a failed guest import may leave a partial
mirror and reports an error. The disk itself is never changed by an import.

This is an explicit editor-to-disk/VPS mirror, **not a live, bidirectional filesystem mount**:

- Terminal-created files and terminal edits are **not** written to the selected disk folder.
  They can be part of a machine checkpoint, but are replaced by disk contents on folder reload.
- External disk edits are imported on page refresh or **Reload folder into VPS**, not watched
  continuously. Saving/deleting checks the last opened file contents and refuses an observed
  external change; reopen the file before retrying. The browser API cannot provide atomic
  compare-and-swap with another OS process. Do not write the same files concurrently from
  another tab, browser, guest command, or native editor.
- Unsaved textarea edits are not durable. The UI warns before discarding them and requests a
  browser leave-page warning, but only a completed **Save file to disk** guarantees persistence.
- If disk commit succeeds but the VPS update fails, the UI says so explicitly; **Reload folder
  into VPS** repairs the mirror. It never reports a failed disk write as saved.

Nested paths and empty directories are imported. UTF-8 text (including a UTF-8 BOM) can be
edited; binary files are mirrored byte-for-byte but not editable as text. This first example
is intentionally bounded to **1 MiB per file**, **16 MiB per folder**, and **1,000 files and
directories**; use a small source folder, not a dependency cache such as `node_modules`.

Filesystem access requires HTTPS or localhost and `showDirectoryPicker()` (principally
desktop Chrome/Edge). Firefox/Safari can run the terminal but cannot use this disk-folder UI;
there is no silent fallback to browser-private storage. Clearing site data forgets the handle,
not the ordinary disk files; choose the same folder again. Writer locking is local to this
origin/browser profile and demo path, not an OS-wide lock on that physical folder.

## Implementation

The image opts in with `LABEL snowglobe.editor="true"` and needs `snowglobe.network="fetch"`.
`preload.mjs` starts `bridge.mjs` in tsx's parent process, before the ready marker. The bridge
accepts one bounded JSON request per virtual TCP connection on guest port 8090; it supports
only resetting `/workspace`, creating directories, writing binary files, removing files, and
removing empty directories. Directory deletion refuses non-empty guest folders, including
terminal-created contents; a disk-success/guest-failure is reported separately.
It rejects traversal and symlink paths and has no access to the host's filesystem.

The browser accesses only the user-selected directory handle. `internal/site/working-folder.js`
handles disk commits and mirroring over Armless's existing `connect()` transport; `folder-ui.js`
manages permission, the remembered handle, and the editor. No server or new browser dependencies
are required.

## Regression checks

```sh
go test ./...
node --test internal/site/*.test.cjs examples/editor/bridge.test.mjs
```

Serve the repository and open `internal/site/working-folder.browser.html` in a visible Chromium
tab to exercise real IndexedDB handle storage, filesystem streams, and UI behavior. That page
uses a disposable origin-private test directory and substitutes only the guest transport. Also
exercise the built example with a user-selected **ordinary disk folder** for the full
picker → disk → emulated guest → refresh path.
