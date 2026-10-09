defmodule Playground do
  @moduledoc """
  This IEx session is a real Elixir release running on 32-bit Linux, emulated in your browser.

  Try `Playground.whereami()`, `h Enum.map/2`, or `Process.list() |> length()`. Everything runs
  locally in this tab: no server is involved.
  """

  @doc "Where am I running?"
  def whereami do
    {:ok, kernel} = File.read("/proc/version")
    %{otp: System.otp_release(), elixir: System.version(), kernel: String.trim(kernel)}
  end
end
