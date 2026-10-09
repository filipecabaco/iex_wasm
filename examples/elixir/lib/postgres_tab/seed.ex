defmodule PostgresTab.Seed do
  @moduledoc false

  # Fills the database with the runtime itself: every module loaded in this BEAM, the application
  # it belongs to, and how big it is. Real data, collected inside the browser tab.

  alias PostgresTab.Repo

  def run do
    Repo.query!("""
    CREATE TABLE IF NOT EXISTS modules (
      name text PRIMARY KEY, app text, functions integer, exports integer, bytes bigint
    )
    """)

    apps =
      for {app, _, _} <- Application.loaded_applications(),
          {:ok, mods} = :application.get_key(app, :modules),
          mod <- mods,
          into: %{},
          do: {mod, app}

    for {mod, _} <- :code.all_loaded() do
      %{
        name: inspect(mod),
        app: to_string(Map.get(apps, mod, :unknown)),
        functions: length(mod.module_info(:functions)),
        exports: length(mod.module_info(:exports)),
        bytes: :erlang.external_size(mod.module_info())
      }
    end
    |> Enum.chunk_every(200)
    |> Enum.each(
      &Repo.insert_all(PostgresTab.ModuleRow, &1, on_conflict: :replace_all, conflict_target: :name)
    )
  end
end
