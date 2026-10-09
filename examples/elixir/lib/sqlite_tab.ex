defmodule SqliteTab do
  @moduledoc """
  A SQLite database inside this browser tab, through Ecto and the exqlite NIF: C code compiled
  for 32-bit Linux, running on an emulated x86 CPU.

  The `modules` table holds every module loaded in this BEAM, with its application, function
  count, exports and size.
  """

  alias SqliteTab.Repo

  @doc "Runs any SQL statement and prints the result as a table."
  def sql(statement, params \\ []) do
    %{columns: columns, rows: rows, num_rows: count} = Repo.query!(statement, params)
    # Statements like INSERT or CREATE return no columns and no rows, only a count
    if columns not in [nil, []] and is_list(rows), do: IO.puts(table(columns, rows))
    IO.puts(IO.ANSI.faint() <> "#{count} row(s)" <> IO.ANSI.reset())
  end

  defp table(columns, rows) do
    cells = Enum.map(rows, fn row -> Enum.map(row, &cell/1) end)

    widths =
      Enum.zip_with([columns | cells], fn col ->
        col |> Enum.map(&String.length/1) |> Enum.max()
      end)

    line = fn row ->
      row |> Enum.zip(widths) |> Enum.map_join(" │ ", fn {v, w} -> String.pad_trailing(v, w) end)
    end

    rule = Enum.map_join(widths, "─┼─", &String.duplicate("─", &1))

    Enum.join(
      [IO.ANSI.bright() <> line.(columns) <> IO.ANSI.reset(), rule | Enum.map(cells, line)],
      "\n"
    )
  end

  defp cell(nil), do: "NULL"
  defp cell(value) when is_binary(value), do: value
  defp cell(value), do: inspect(value)
end
