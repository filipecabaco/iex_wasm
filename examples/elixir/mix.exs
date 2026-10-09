defmodule SqliteTab.MixProject do
  use Mix.Project

  def project do
    [
      app: :sqlite_tab,
      version: "0.1.0",
      elixir: "~> 1.15",
      deps: [
        {:ecto_sqlite3, "~> 0.25.0"},
        # 0.42 is days old; stay on the release before it
        {:exqlite, "~> 0.41.0"}
      ],
      # Keep docs in the release so h/1 works in the browser
      releases: [sqlite_tab: [strip_beams: [keep: ["Docs"]]]]
    ]
  end

  def application do
    [mod: {SqliteTab.Application, []}, extra_applications: [:logger]]
  end
end
