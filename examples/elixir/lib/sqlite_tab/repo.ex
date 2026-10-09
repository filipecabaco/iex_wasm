defmodule SqliteTab.Repo do
  use Ecto.Repo, otp_app: :sqlite_tab, adapter: Ecto.Adapters.SQLite3
end
