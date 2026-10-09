import SqliteTab, only: [sql: 1, sql: 2]
import Ecto.Query
alias SqliteTab.{Repo, ModuleRow}
IEx.configure(width: 1000)

IO.puts("""

  #{IO.ANSI.bright()}Elixir + Ecto + SQLite#{IO.ANSI.reset()}: a database in this tab, through the exqlite NIF (C, compiled for 32-bit x86).
  The modules table describes this very BEAM. Try:

    sql "SELECT app, count(*) AS modules, sum(bytes) AS bytes FROM modules GROUP BY app ORDER BY bytes DESC"
    Repo.all(from m in ModuleRow, order_by: [desc: m.functions], limit: 5, select: {m.name, m.functions})
    sql "CREATE TABLE notes (body TEXT)"; sql "INSERT INTO notes VALUES ('written in a browser tab')"
""")
