# BeamBox

**Run your Elixir release in the browser.** `mix beam_box.build` turns your project into a
static site: the real release, with an IEx shell attached, running on Linux inside a
WebAssembly x86 emulator ([v86](https://github.com/copy/v86)). No server, no transpiling. Deploy
the output to GitHub Pages or any static host.

```sh
mix beam_box.build     # → dist/
mix beam_box.serve     # http://localhost:8000
```

## Install

Add it as a dev-only dependency:

```elixir
def deps do
  [{:beam_box, "~> 0.1", only: :dev, runtime: false}]
end
```

The only thing the host needs is **Docker**. Node, OTP 28 and the browser runtime run in a
build container, so your own Elixir/OTP versions don't matter.

## What happens

1. **Release.** `MIX_ENV=prod mix release` runs inside a 32-bit Alpine container. NIFs compile
   natively there, and the release bundles its own ERTS onto a bare Alpine runtime image.
2. **Boot layer.** A kernel, an initramfs that mounts the root filesystem over 9p, and the
   terminal setup are added on top of the release image.
3. **Filesystem.** The image is converted into v86's format: a JSON tree plus one zstd-compressed
   blob per unique file, fetched on demand by the browser. The files nearly every session reads
   are also bundled into a `warm.pack` the page downloads in the background.
4. **Snapshot.** The guest boots headless until `iex(1)>` appears, and the whole machine state
   is saved. Visitors restore that snapshot instead of booting Linux.

## Options

| Flag | `mix.exs` key | Default |
|------|---------------|---------|
| `--out DIR` | `:out` | `dist` |
| `--release NAME` | `:release` | first entry in `:releases`, else the app |
| `--cmd CMD` | `:cmd` | `/app/bin/<release> start_iex` |
| `--ready TEXT` | `:ready` | `iex(1)> ` with the default command, else 5 s of quiet |
| `--title TEXT` | `:title` | the app name |
| `--memory MB` | `:memory` | `512` |
| `--warm REGEX` | `:warm` | the release's code, the VM, and the libraries it links |
| | `:apk` | extra Alpine packages for the runtime image |
| | `:build_apk` | extra Alpine packages for building (NIF toolchains) |
| | `:env` | extra environment variables for the release |
| | `:alpine` | `i386/alpine:3.24.2` |

```elixir
def project do
  [
    app: :my_app,
    # ...
    releases: [my_app: [strip_beams: [keep: ["Docs"]]]],
    beam_box: [title: "My app", apk: ["imagemagick"], env: [MODE: "demo"]]
  ]
end
```

Use `--cmd` to start something other than IEx, for example `--cmd "/app/bin/my_app eval
'MyApp.CLI.main()'"` for a terminal UI.

## Good to know

- **Elixir/OTP versions come from Alpine** for 32-bit x86 (Elixir 1.19 on OTP 28 with Alpine
  3.24). The official Elixir images don't support 32-bit x86. Projects requiring other versions
  need a different `:alpine` base.
- **It's a terminal.** Whatever runs is shown in xterm.js. There's no bridge for HTTP into the
  guest yet, so Phoenix endpoints aren't reachable from the page.
- **It's emulated.** Expect it to be much slower than native: 32-bit x86 has no BEAM JIT, and
  every instruction runs on an emulated CPU. A typical site is 50–100 MB and opens in a few
  seconds on a cold load, then in under a second.
- **Docs are stripped from releases by default.** Keep them with
  `strip_beams: [keep: ["Docs"]]` if you want `h/1` to work.
