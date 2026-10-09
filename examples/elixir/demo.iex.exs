import PostgresTab, only: [sql: 1, sql: 2]
import Ecto.Query
alias PostgresTab.{Repo, ModuleRow}
IEx.configure(width: 1000)

IO.puts("""

  #{IO.ANSI.bright()}Elixir + Ecto + PostgreSQL#{IO.ANSI.reset()}: a Postgres server running in this tab, next to this BEAM.
  The modules table describes this very BEAM. Try:

    sql "SHOW server_version"
    sql "SELECT app, count(*) AS modules, pg_size_pretty(sum(bytes)) AS size FROM modules GROUP BY app ORDER BY sum(bytes) DESC LIMIT 8"
    Repo.all(from m in ModuleRow, where: m.app == "postgrex", order_by: [desc: m.functions], limit: 5, select: {m.name, m.functions})
    sql "SELECT app, name, functions, rank() OVER (PARTITION BY app ORDER BY functions DESC) FROM modules WHERE app IN ('ecto', 'postgrex') ORDER BY 4, 1 LIMIT 6"
    sql "CREATE TABLE notes (body text)"; sql "INSERT INTO notes VALUES ('written in a browser tab')"
""")
