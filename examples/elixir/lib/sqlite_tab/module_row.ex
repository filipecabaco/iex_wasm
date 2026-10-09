defmodule SqliteTab.ModuleRow do
  @moduledoc "One row per module loaded in this BEAM, filled in at startup."
  use Ecto.Schema

  @primary_key {:name, :string, autogenerate: false}
  schema "modules" do
    field(:app, :string)
    field(:functions, :integer)
    field(:exports, :integer)
    field(:bytes, :integer)
  end
end
