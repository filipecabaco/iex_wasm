defmodule SqliteTab.Application do
  @moduledoc false
  use Application

  @impl true
  def start(_type, _args) do
    {:ok, pid} =
      Supervisor.start_link([SqliteTab.Repo], strategy: :one_for_one, name: SqliteTab.Supervisor)

    # Seed before IEx starts, so the snapshot visitors restore already holds the data
    SqliteTab.Seed.run()
    {:ok, pid}
  end
end
