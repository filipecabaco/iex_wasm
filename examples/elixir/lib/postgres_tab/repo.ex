defmodule PostgresTab.Repo do
  use Ecto.Repo, otp_app: :postgres_tab, adapter: Ecto.Adapters.Postgres
end
