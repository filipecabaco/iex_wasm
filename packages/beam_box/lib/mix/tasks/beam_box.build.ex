defmodule Mix.Tasks.BeamBox.Build do
  @shortdoc "Builds the project's release into a static site that runs it in the browser"

  @moduledoc """
  Builds the project's release into a static site that runs it in the browser.

      $ mix beam_box.build
      $ mix beam_box.serve

  The release is built with `MIX_ENV=prod` on 32-bit Alpine Linux inside Docker, booted once in
  the [v86](https://github.com/copy/v86) emulator, and snapshotted once it's ready. The output
  directory is a plain static site: deploy it to GitHub Pages or any static host. Visitors get
  the running release with an IEx shell attached, ready in about a second once cached.

  Only Docker is needed on the host.

  ## Options

    * `--out DIR` - output directory (default: `dist`)
    * `--release NAME` - release to build (default: the first in `:releases`, else the app)
    * `--cmd CMD` - shell command to run on the terminal (default: `bin/<release> start_iex`)
    * `--ready TEXT` - terminal output that means the app is ready to snapshot. Defaults to
      `iex(1)> ` with the default command; otherwise the build waits for 5 seconds of quiet
    * `--title TEXT` - page title (default: the app name)
    * `--memory MB` - guest RAM (default: 512)
    * `--warm REGEX` - files the page preloads in the background (default: the release's code,
      the VM and the system libraries it links)

  ## Configuration

  The same settings can live in `mix.exs`, with flags taking precedence:

      def project do
        [
          app: :my_app,
          # ...
          beam_box: [
            title: "My app",
            memory: 512,
            # extra Alpine packages for the runtime image, and for building (NIF toolchains)
            apk: ["imagemagick"],
            build_apk: ["cmake"],
            # extra environment for the release
            env: [MY_APP_MODE: "demo"]
          ]
        ]
      end

  Releases strip docs from `.beam` files by default, so `h/1` shows nothing. To keep them, set
  `strip_beams: [keep: ["Docs"]]` on the release.
  """

  use Mix.Task

  @switches [
    out: :string,
    release: :string,
    cmd: :string,
    ready: :string,
    title: :string,
    memory: :integer,
    warm: :string
  ]

  @impl Mix.Task
  def run(argv) do
    {flags, _args} = OptionParser.parse!(argv, strict: @switches)
    # Later flags win, so wrappers like `mix beam_box.build --title A --title B` behave
    flags = Keyword.new(flags)

    config = BeamBox.Config.load(Mix.Project.config(), flags, File.cwd!())
    Mix.shell().info("Building #{config.release} into #{config.out}")
    Mix.shell().info("  command: #{config.cmd}")
    Mix.shell().info("  ready:   #{inspect(config.ready || "after 5s of quiet")}")

    BeamBox.Builder.run(config)

    Mix.shell().info([
      :green,
      "\n#{config.out} is ready to deploy. Preview it with mix beam_box.serve"
    ])
  end
end
