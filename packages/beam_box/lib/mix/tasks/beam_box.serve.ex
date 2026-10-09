defmodule Mix.Tasks.BeamBox.Serve do
  @shortdoc "Serves a built beam_box site locally"

  @moduledoc """
  Serves a site built by `mix beam_box.build`, the same way a static host would.

      $ mix beam_box.serve [--out DIR] [--port 8000]
  """

  use Mix.Task

  @impl Mix.Task
  def run(argv) do
    {opts, _} = OptionParser.parse!(argv, strict: [out: :string, port: :integer])
    root = Path.expand(opts[:out] || "dist")
    port = opts[:port] || 8000

    unless File.exists?(Path.join(root, "index.html")) do
      Mix.raise("#{root}/index.html not found; run mix beam_box.build first")
    end

    {:ok, _} = Application.ensure_all_started(:inets)

    {:ok, _} =
      :inets.start(:httpd,
        port: port,
        bind_address: ~c"localhost",
        server_name: ~c"beam_box",
        server_root: String.to_charlist(root),
        document_root: String.to_charlist(root),
        directory_index: [~c"index.html"],
        modules: [:mod_alias, :mod_get, :mod_head],
        mime_types: [
          {~c"html", ~c"text/html"},
          {~c"js", ~c"text/javascript"},
          {~c"css", ~c"text/css"},
          {~c"json", ~c"application/json"},
          {~c"wasm", ~c"application/wasm"}
        ],
        mime_type: ~c"application/octet-stream"
      )

    Mix.shell().info("Serving #{root} at http://localhost:#{port}")
    Process.sleep(:infinity)
  end
end
