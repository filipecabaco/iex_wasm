defmodule BeamBox.Config do
  @moduledoc false

  # Resolves build settings: CLI flags override `beam_box:` in the project's mix.exs, which
  # overrides the defaults below.

  @alpine "i386/alpine:3.24.2"

  defstruct [
    :project_dir,
    :release,
    :out,
    :title,
    :memory,
    :cmd,
    :ready,
    :warm,
    :alpine,
    apk: [],
    build_apk: [],
    env: []
  ]

  @type t :: %__MODULE__{}

  @spec load(keyword(), keyword(), Path.t()) :: t()
  def load(project, flags, project_dir) do
    settings = Keyword.merge(project[:beam_box] || [], flags)
    release = to_string(settings[:release] || default_release(project))
    start_iex = "/app/bin/#{release} start_iex"
    cmd = settings[:cmd] || start_iex

    %__MODULE__{
      project_dir: project_dir,
      release: release,
      out: Path.expand(settings[:out] || "dist", project_dir),
      title: settings[:title] || to_string(project[:app] || release),
      memory: settings[:memory] || 512,
      cmd: cmd,
      # With the default command we know what "ready" looks like; for anything else, wait for
      # the terminal to go quiet unless told otherwise
      ready: Keyword.get(settings, :ready, if(cmd == start_iex, do: "iex(1)> ")),
      warm: settings[:warm] || default_warm(),
      alpine: settings[:alpine] || @alpine,
      apk: List.wrap(settings[:apk]),
      build_apk: List.wrap(settings[:build_apk]),
      env:
        [
          {"LANG", "C.UTF-8"},
          {"HOME", "/root"},
          # A browser tab is a single node; with distribution off the prompt is a plain iex(1)>
          {"RELEASE_DISTRIBUTION", "none"}
        ] ++ Enum.map(settings[:env] || [], fn {k, v} -> {to_string(k), to_string(v)} end)
    }
  end

  defp default_release(project) do
    case project[:releases] do
      [{name, _} | _] -> name
      _ -> project[:app] || Mix.raise("Umbrella projects need a :releases entry in mix.exs")
    end
  end

  # Files nearly every session reads: the release's code and NIFs, the VM binary (paged in
  # lazily), and the system libraries and OpenSSL files they load
  defp default_warm do
    Enum.join(
      [
        "^/app/lib/[^/]+/(ebin|priv)/",
        "^/app/erts-[^/]+/bin/",
        "^/lib/ld-musl[^/]*$",
        "^/usr/lib/lib(crypto|ssl|z|ncursesw|stdc\\+\\+|gcc_s)\\.so[^/]*$",
        "^/etc/ssl/openssl\\.cnf$",
        "^/usr/lib/ossl-modules/"
      ],
      "|"
    )
  end
end
