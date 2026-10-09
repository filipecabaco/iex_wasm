#!/usr/bin/env elixir

# Turns an i386 Alpine Docker image into a static site that runs it in the browser with v86.
#
#   elixir packages/toolkit/build.exs <dockerfile dir | image ref> [options]
#
#   --out DIR        output directory (default: dist)
#   --title TEXT     page title (default: the source name)
#   --cmd CMD        shell command to run on the terminal (default: the image's ENTRYPOINT + CMD)
#   --ready TEXT     terminal output meaning the app is ready to snapshot
#                    (default: wait until the terminal has been quiet for 5 seconds)
#   --memory MB      guest RAM (default: 512)
#   --warm REGEX     files the page preloads in the background (default: core Elixir/OTP)
#
# The image's ENV and WORKDIR apply to the command. Needs Docker, Node and OTP 28+.

defmodule Toolkit do
  @dir __DIR__
  @boot_image "wasm-app"
  @base_tag "wasm-app-base"

  # Code most Elixir sessions touch: core Elixir and OTP apps (bytecode + NIFs), the VM binary
  # (paged in lazily), and the system libraries and OpenSSL files they load
  @default_warm Enum.join(
                  [
                    "^/usr/lib/(elixir/lib/(elixir|iex|logger|eex|mix|ex_unit)|erlang/lib/(kernel|stdlib|compiler|erts|crypto|syntax_tools)-[^/]+)/(ebin|priv/lib)/",
                    "^/usr/lib/erlang/erts-[^/]+/bin/",
                    "^/lib/ld-musl[^/]*$",
                    "^/usr/lib/lib(crypto|ssl|z|ncursesw)\\.so[^/]*$",
                    "^/etc/ssl/openssl\\.cnf$",
                    "^/usr/lib/ossl-modules/"
                  ],
                  "|"
                )

  def run(argv) do
    {opts, args} =
      OptionParser.parse!(argv,
        strict: [
          out: :string,
          title: :string,
          cmd: :string,
          ready: :string,
          memory: :integer,
          warm: :string
        ]
      )

    source =
      case args do
        [source] -> source
        _ -> usage()
      end

    out = Path.expand(opts[:out] || "dist")
    memory_mb = opts[:memory] || 512
    web = Path.join(@dir, "web")

    image = step("Resolve source image", fn -> resolve_image(source) end)
    config = image_config(image)
    command = opts[:cmd] || shell_join(config.command)
    if command == "", do: fail("#{source} has no ENTRYPOINT/CMD; pass --cmd")

    File.rm_rf!(out)
    File.mkdir_p!(out)

    step("Add boot layer", fn -> build_boot_image(config, command) end)
    step("Convert to v86 filesystem", fn -> export_rootfs(out, opts[:warm] || @default_warm) end)

    step("Assemble page", fn ->
      assemble_site(web, out, opts[:title] || title(source), memory_mb)
    end)

    step("Boot and snapshot", fn ->
      options = JSON.encode!(%{memoryMb: memory_mb, ready: opts[:ready]})
      v86 = Path.join(web, "node_modules/v86/build")

      cmd!("node", [
        Path.join(@dir, "build-state.mjs"),
        v86,
        Path.join(out, "bios"),
        Path.join(out, "system"),
        options
      ])
    end)

    IO.puts("\n#{out} is ready to deploy. Preview: elixir #{Path.join(@dir, "serve.exs")} #{out}")
  end

  defp usage do
    IO.puts(
      :stderr,
      "usage: elixir build.exs <dockerfile dir | image ref> [--out DIR] [--title TEXT]"
    )

    IO.puts(:stderr, "       [--cmd CMD] [--ready TEXT] [--memory MB] [--warm REGEX]")
    System.halt(1)
  end

  ## Source image

  defp resolve_image(source) do
    if File.exists?(Path.join(source, "Dockerfile")) do
      cmd!("docker", ["build", "--platform", "linux/386", "--tag", @base_tag, source])
    else
      cmd!("docker", ["pull", "--platform", "linux/386", source])
      cmd!("docker", ["tag", source, @base_tag])
    end

    @base_tag
  end

  defp image_config(image) do
    [info] = cmd!("docker", ["image", "inspect", image], quiet: true) |> JSON.decode!()

    if info["Architecture"] != "386" do
      fail(
        "#{image} is #{info["Architecture"]}; v86 emulates 32-bit x86, so build it FROM an i386 Alpine image"
      )
    end

    config = info["Config"] || %{}

    %{
      env: config["Env"] || [],
      workdir: config["WorkingDir"] || "",
      command: (config["Entrypoint"] || []) ++ (config["Cmd"] || [])
    }
  end

  ## Boot layer

  defp build_boot_image(config, command) do
    context = Path.join(System.tmp_dir!(), "wasm-boot-#{System.unique_integer([:positive])}")
    File.mkdir_p!(context)

    try do
      File.cp!(Path.join(@dir, "boot.Dockerfile"), Path.join(context, "Dockerfile"))
      File.write!(Path.join(context, "wasm-console"), console_script(config, command))
      File.chmod!(Path.join(context, "wasm-console"), 0o755)

      cmd!("docker", [
        "build",
        "--platform",
        "linux/386",
        "--build-arg",
        "BASE=#{@base_tag}",
        "--tag",
        @boot_image,
        context
      ])
    after
      File.rm_rf!(context)
    end
  end

  # Runs on the browser terminal: the image's environment, working directory and command
  defp console_script(config, command) do
    exports =
      for entry <- config.env, [key, value] <- [String.split(entry, "=", parts: 2)] do
        "export #{key}=#{shell_quote(value)}\n"
      end

    cd = if config.workdir != "", do: "cd #{shell_quote(config.workdir)}\n", else: ""

    ["#!/bin/sh\n", exports, cd, "clear\n", "exec #{command}\n"]
  end

  ## Filesystem

  defp export_rootfs(out, warm) do
    tar = Path.join(System.tmp_dir!(), "wasm-rootfs-#{System.unique_integer([:positive])}.tar")

    container =
      cmd!("docker", ["create", "--platform", "linux/386", @boot_image], quiet: true)
      |> String.trim()

    try do
      cmd!("docker", ["export", container, "-o", tar])
      tar2v86 = Path.join(@dir, "tar2v86.exs")
      cmd!("elixir", [tar2v86, tar, Path.join(out, "system"), "--warm", warm])
    after
      cmd!("docker", ["rm", container], quiet: true)
      File.rm(tar)
    end
  end

  ## Page and browser runtime

  defp assemble_site(web, out, title, memory_mb) do
    cmd!("npm", ["ci", "--prefix", web, "--no-audit", "--no-fund"])
    modules = Path.join(web, "node_modules")

    copy(modules, "v86/build", ~w(libv86.js v86.wasm v86-fallback.wasm), Path.join(out, "v86"))
    copy(modules, "@xterm/xterm/lib", ~w(xterm.js), Path.join(out, "xterm"))
    copy(modules, "@xterm/xterm/css", ~w(xterm.css), Path.join(out, "xterm"))
    copy(modules, "@xterm/addon-fit/lib", ~w(addon-fit.js), Path.join(out, "xterm"))

    fetch_bios(modules, Path.join(out, "bios"))

    html =
      EEx.eval_file(Path.join(web, "index.html.eex"),
        assigns: [title: html_escape(title), memory_mb: memory_mb]
      )

    File.write!(Path.join(out, "index.html"), html)
    File.touch!(Path.join(out, ".nojekyll"))
  end

  defp copy(modules, from, files, to) do
    File.mkdir_p!(to)
    for file <- files, do: File.cp!(Path.join([modules, from, file]), Path.join(to, file))
  end

  # The BIOS isn't on npm; fetch it from the exact upstream commit the npm build was made from
  defp fetch_bios(modules, to) do
    File.mkdir_p!(to)

    %{"version" => version} =
      modules |> Path.join("v86/package.json") |> File.read!() |> JSON.decode!()

    [_, commit] = String.split(version, "+g")

    {:ok, _} = Application.ensure_all_started([:inets, :ssl])

    ssl = [
      verify: :verify_peer,
      cacerts: :public_key.cacerts_get(),
      customize_hostname_check: [match_fun: :public_key.pkix_verify_hostname_match_fun(:https)]
    ]

    for bios <- ~w(seabios vgabios) do
      url = ~c"https://raw.githubusercontent.com/copy/v86/#{commit}/bios/#{bios}.bin"

      case :httpc.request(:get, {url, []}, [ssl: ssl], body_format: :binary) do
        {:ok, {{_, 200, _}, _, body}} -> File.write!(Path.join(to, "#{bios}.bin"), body)
        other -> fail("downloading #{url} failed: #{inspect(other)}")
      end
    end
  end

  ## Helpers

  defp title(source) do
    if File.dir?(source), do: source |> Path.expand() |> Path.basename(), else: source
  end

  defp step(name, fun) do
    IO.puts(IO.ANSI.format([:bright, "\n==> #{name}"]))
    {micros, result} = :timer.tc(fun)
    IO.puts(IO.ANSI.format([:faint, "    #{Float.round(micros / 1_000_000, 1)}s"]))
    result
  end

  defp cmd!(bin, args, opts \\ []) do
    into = if opts[:quiet], do: "", else: IO.stream()

    case System.cmd(bin, args, into: into, stderr_to_stdout: !opts[:quiet]) do
      {output, 0} -> if opts[:quiet], do: output, else: :ok
      {_, status} -> fail("#{bin} #{Enum.join(args, " ")} exited with #{status}")
    end
  end

  defp fail(message) do
    IO.puts(:stderr, IO.ANSI.format([:red, "error: ", :reset, message]))
    System.halt(1)
  end

  defp shell_join(argv), do: Enum.map_join(argv, " ", &shell_quote/1)
  defp shell_quote(value), do: "'" <> String.replace(value, "'", ~S('\'')) <> "'"

  defp html_escape(text) do
    text
    |> String.replace("&", "&amp;")
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
    |> String.replace("\"", "&quot;")
  end
end

Toolkit.run(System.argv())
