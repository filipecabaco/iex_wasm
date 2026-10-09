# IEx in Browser

Project to have an IEx in your browser

Heavily inspired (aka copied a lot of the ideas from):

- [https://github.com/snaplet/postgres-wasm](https://github.com/snaplet/postgres-wasm)
- [https://github.com/iximiuz/docker-to-linux](https://github.com/iximiuz/docker-to-linux)
- [https://github.com/copy/v86](https://github.com/copy/v86)

All credit to these projects.

**NOTE** This is extremely janky, not to be taken seriously

## How it works

An i386 Alpine Linux guest with Elixir runs inside [v86](https://github.com/copy/v86), an x86
emulator compiled to WebAssembly. The guest's root filesystem is served as static files over 9p,
and the page restores a snapshot taken after boot, so IEx is ready in under a second instead of
booting Linux in the browser. The whole thing is one static `dist/` folder, deployed to GitHub
Pages.

## Setup

Requires [mise](https://mise.jdx.dev) and Docker.

```sh
mise install       # Erlang, Elixir and Node, pinned in mise.toml
mise run build     # builds the guest, snapshots it, and assembles dist/
mise run serve     # http://localhost:8000
```

`mise run build` skips steps whose inputs haven't changed. The stages are:

| Task | What it does |
|------|--------------|
| `deps` | Installs v86 and xterm.js (pinned in `packages/web/package.json`) |
| `site` | Copies the page, v86, xterm.js and the matching v86 BIOS into `dist/` |
| `rootfs` | Builds `packages/image-builder/Dockerfile` and converts it with `tar2v86.exs` into `dist/system/` |
| `state` | Boots the guest headless with `build-state.mjs` and saves `dist/system/state.bin.zst` |

Pushing to `main` runs the same build in GitHub Actions and deploys `dist/` to GitHub Pages
(enable Pages with source "GitHub Actions" in the repository settings).

To change what's installed in the guest, edit `packages/image-builder/Dockerfile`. The browser's
`memory_size` and devices in `packages/web/index.html` must match `build-state.mjs`, since the
snapshot is only valid for the same machine.
