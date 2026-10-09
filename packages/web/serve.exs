#!/usr/bin/env elixir

# Serves the built static site locally, the same way GitHub Pages will.
#
#   elixir serve.exs <dir> [--port 8000]

Mix.install([
  {:bandit, "~> 1.12"},
  {:plug, "~> 1.20"}
])

defmodule Serve do
  use Plug.Builder

  plug :index
  plug Plug.Static, at: "/", from: {__MODULE__, :root, []}
  plug :not_found

  def root, do: :persistent_term.get({__MODULE__, :root})

  # Plug.Static doesn't map "/" to index.html; Pages does
  defp index(%Plug.Conn{path_info: []} = conn, _opts), do: %{conn | path_info: ["index.html"]}
  defp index(conn, _opts), do: conn

  defp not_found(conn, _opts), do: conn |> send_resp(404, "not found") |> halt()

  def run(argv) do
    {opts, [dir]} = OptionParser.parse!(argv, strict: [port: :integer])
    port = Keyword.get(opts, :port, 8000)
    dir = Path.expand(dir)

    unless File.exists?(Path.join(dir, "index.html")) do
      IO.puts(:stderr, "#{dir}/index.html not found; run `mise run build` first")
      System.halt(1)
    end

    :persistent_term.put({__MODULE__, :root}, dir)
    {:ok, _} = Bandit.start_link(plug: __MODULE__, port: port)
    IO.puts("Serving #{dir} at http://localhost:#{port}")
    Process.sleep(:infinity)
  end
end

Serve.run(System.argv())
