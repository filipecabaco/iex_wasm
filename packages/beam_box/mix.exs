defmodule BeamBox.MixProject do
  use Mix.Project

  @version "0.1.0"
  @source_url "https://github.com/filipecabaco/iex_wasm"

  def project do
    [
      app: :beam_box,
      version: @version,
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: [],
      description:
        "Run your Elixir release in the browser: builds it into a static site powered by v86",
      package: package(),
      docs: [main: "readme", extras: ["README.md"], source_url: @source_url]
    ]
  end

  def application do
    [extra_applications: [:logger, :eex, :inets]]
  end

  defp package do
    [
      licenses: ["MIT"],
      links: %{"GitHub" => @source_url},
      files: ~w(lib priv/boot.Dockerfile priv/release.Dockerfile.eex priv/tools/Dockerfile
                priv/tools/package.json priv/tools/package-lock.json priv/tools/build-state.mjs
                priv/tools/tar2v86.exs priv/web mix.exs README.md)
    ]
  end
end
