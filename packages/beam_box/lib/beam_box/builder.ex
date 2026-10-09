defmodule BeamBox.Builder do
  @moduledoc false

  # release image -> boot layer -> rootfs tar -> 9p filesystem -> page -> snapshot, all through
  # Docker so the host only needs Docker and the project's own Elixir.

  alias BeamBox.Config

  @marker ".beam_box"

  @spec run(Config.t()) :: :ok
  def run(%Config{} = config) do
    work = Path.join([config.project_dir, "_build", "beam_box"])
    File.mkdir_p!(work)
    prepare_out!(config.out)

    tools = step("Build tools image", fn -> build_tools_image() end)
    app = step("Build release #{config.release}", fn -> build_release_image(config, work) end)
    boot = step("Add boot layer", fn -> build_boot_image(config, app, work) end)
    tar = step("Export root filesystem", fn -> export_rootfs(boot, work) end)

    step("Convert to v86 filesystem", fn ->
      tools_run(tools, config, work, [
        [
          "elixir",
          "/tools/tar2v86.exs",
          "/work/rootfs.tar",
          "/out/system",
          "--warm",
          config.warm
        ],
        ["cp", "-R", "/tools/site/.", "/out/"]
      ])

      File.rm!(tar)
    end)

    step("Render page", fn -> render_page(config) end)

    step("Boot and snapshot", fn ->
      ready = if config.ready, do: ["--ready", config.ready], else: []

      tools_run(tools, config, work, [
        ["node", "/tools/build-state.mjs", "/tools/node_modules/v86/build", "/out/bios"] ++
          ["/out/system", "--memory", to_string(config.memory)] ++ ready
      ])
    end)

    :ok
  end

  ## Output directory

  # Only ever delete a directory this task created, never an arbitrary one passed via --out
  defp prepare_out!(out) do
    if File.exists?(out) and File.ls!(out) != [] and not File.exists?(Path.join(out, @marker)) do
      Mix.raise("#{out} exists and wasn't created by beam_box; pick another --out or empty it")
    end

    File.rm_rf!(out)
    File.mkdir_p!(out)
    File.write!(Path.join(out, @marker), "")
  end

  ## Images

  defp build_tools_image do
    tag = "beam-box-tools:#{Application.spec(:beam_box, :vsn)}"
    docker!(["build", "--tag", tag, priv("tools")])
    tag
  end

  defp build_release_image(config, work) do
    dockerfile = Path.join(work, "release.Dockerfile")
    File.write!(dockerfile, release_dockerfile(config))
    # BuildKit picks up <Dockerfile>.dockerignore next to the Dockerfile
    File.write!(dockerfile <> ".dockerignore", dockerignore(config))

    tag = "beam-box-app:#{config.release}"

    docker!([
      "build",
      "--platform",
      "linux/386",
      "-f",
      dockerfile,
      "--tag",
      tag,
      config.project_dir
    ])

    tag
  end

  @doc false
  def release_dockerfile(config) do
    present = &File.exists?(Path.join(config.project_dir, &1))

    EEx.eval_file(priv("release.Dockerfile.eex"),
      assigns: [
        alpine: config.alpine,
        release: config.release,
        apk: config.apk,
        build_apk: config.build_apk,
        manifest: Enum.filter(~w(mix.exs mix.lock), present),
        # needed before fetching deps: compile-time config, and umbrella children's mix.exs
        config_dirs: Enum.filter(~w(config apps), present),
        source_dirs: Enum.filter(~w(lib priv rel), present)
      ]
    )
  end

  defp dockerignore(config) do
    out = Path.relative_to(config.out, config.project_dir)
    Enum.join(["_build", "deps", ".git", "**/node_modules", out], "\n") <> "\n"
  end

  defp build_boot_image(config, app, work) do
    context = Path.join(work, "boot")
    File.rm_rf!(context)
    File.mkdir_p!(context)
    File.cp!(priv("boot.Dockerfile"), Path.join(context, "Dockerfile"))
    File.write!(Path.join(context, "wasm-console"), console_script(config))
    File.chmod!(Path.join(context, "wasm-console"), 0o755)

    tag = "beam-box-boot:#{config.release}"

    docker!([
      "build",
      "--platform",
      "linux/386",
      "--build-arg",
      "BASE=#{app}",
      "--tag",
      tag,
      context
    ])

    tag
  end

  @doc false
  # What the browser terminal runs: the release's environment and start command
  def console_script(config) do
    exports = for {key, value} <- config.env, do: "export #{key}=#{shell_quote(value)}\n"
    IO.iodata_to_binary(["#!/bin/sh\n", exports, "cd /app\n", "clear\n", "exec #{config.cmd}\n"])
  end

  defp export_rootfs(image, work) do
    tar = Path.join(work, "rootfs.tar")

    container =
      docker!(["create", "--platform", "linux/386", image], quiet: true) |> String.trim()

    try do
      docker!(["export", container, "-o", tar])
    after
      docker!(["rm", container], quiet: true)
    end

    tar
  end

  ## Tools container

  # Runs as the current user so files in --out aren't owned by root on Linux
  defp tools_run(tools, config, work, commands) do
    {uid, 0} = System.cmd("id", ["-u"])
    {gid, 0} = System.cmd("id", ["-g"])
    user = "#{String.trim(uid)}:#{String.trim(gid)}"

    for command <- commands do
      docker!(
        ["run", "--rm", "--user", user, "-v", "#{work}:/work", "-v", "#{config.out}:/out", tools] ++
          command
      )
    end
  end

  ## Page

  defp render_page(config) do
    html =
      EEx.eval_file(priv("web/index.html.eex"),
        assigns: [title: html_escape(config.title), memory_mb: config.memory]
      )

    File.write!(Path.join(config.out, "index.html"), html)
    File.touch!(Path.join(config.out, ".nojekyll"))
  end

  ## Helpers

  defp priv(path), do: Path.join(:code.priv_dir(:beam_box), path)

  defp step(name, fun) do
    Mix.shell().info([:bright, "\n==> #{name}", :reset])
    {micros, result} = :timer.tc(fun)
    Mix.shell().info([:faint, "    #{Float.round(micros / 1_000_000, 1)}s", :reset])
    result
  end

  defp docker!(args, opts \\ []) do
    into = if opts[:quiet], do: "", else: IO.stream()

    case System.cmd("docker", args, into: into, stderr_to_stdout: !opts[:quiet]) do
      {output, 0} -> if opts[:quiet], do: output, else: :ok
      {_, status} -> Mix.raise("docker #{Enum.join(args, " ")} exited with #{status}")
    end
  rescue
    e in ErlangError ->
      if e.original == :enoent,
        do: Mix.raise("beam_box needs Docker on the PATH"),
        else: reraise(e, __STACKTRACE__)
  end

  defp shell_quote(value), do: "'" <> String.replace(value, "'", ~S('\'')) <> "'"

  defp html_escape(text) do
    text
    |> String.replace("&", "&amp;")
    |> String.replace("<", "&lt;")
    |> String.replace(">", "&gt;")
    |> String.replace("\"", "&quot;")
  end
end
