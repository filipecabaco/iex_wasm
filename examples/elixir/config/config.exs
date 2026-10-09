import Config

config :sqlite_tab, ecto_repos: [SqliteTab.Repo]

# /tmp is RAM inside the guest, so the database is part of the snapshot every visitor restores
config :sqlite_tab, SqliteTab.Repo, database: "/tmp/beam.db", pool_size: 1

config :logger, level: :warning
