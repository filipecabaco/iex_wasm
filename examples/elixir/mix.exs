defmodule PostgresTab.MixProject do
  use Mix.Project

  def project do
    [
      app: :postgres_tab,
      version: "0.1.0",
      elixir: "~> 1.15",
      deps: [
        {:ecto_sql, "~> 3.13"},
        {:postgrex, "~> 0.21"}
      ],
      # Keep docs in the release so h/1 works in the browser
      releases: [postgres_tab: [strip_beams: [keep: ["Docs"]]]]
    ]
  end

  def application do
    [mod: {PostgresTab.Application, []}, extra_applications: [:logger]]
  end
end
