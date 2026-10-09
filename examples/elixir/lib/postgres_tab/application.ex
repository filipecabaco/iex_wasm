defmodule PostgresTab.Application do
  @moduledoc false
  use Application

  @impl true
  def start(_type, _args) do
    {:ok, pid} =
      Supervisor.start_link([PostgresTab.Repo], strategy: :one_for_one, name: PostgresTab.Supervisor)

    # Seed before IEx starts, so the snapshot visitors restore already holds the data
    PostgresTab.Seed.run()
    {:ok, pid}
  end
end
