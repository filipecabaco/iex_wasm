defmodule Playground.MixProject do
  use Mix.Project

  def project do
    [
      app: :playground,
      version: "0.1.0",
      elixir: "~> 1.15",
      deps: deps(),
      releases: [
        # Keep docs so h/1 works in the browser; releases strip them by default
        playground: [strip_beams: [keep: ["Docs"]]]
      ],
      beam_box: [title: "IEx in the browser"]
    ]
  end

  def application do
    [extra_applications: [:logger, :crypto]]
  end

  defp deps do
    [{:beam_box, path: "../../packages/beam_box", only: :dev, runtime: false}]
  end
end
