import Config

config :postgres_tab, ecto_repos: [PostgresTab.Repo]

# Postgres listens on a Unix socket only: a guest without networking has no loopback interface.
# It runs from the guest's memory, so the database is part of the snapshot every visitor restores
config :postgres_tab, PostgresTab.Repo,
  socket_dir: "/run/postgresql",
  username: "postgres",
  database: "postgres",
  pool_size: 2

config :logger, level: :warning
