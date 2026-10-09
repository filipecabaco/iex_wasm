#!/usr/bin/env elixir

# Converts a rootfs tarball (e.g. from `docker export`) into v86's 9p filesystem format:
#
#   <out>/filesystem.json                      tree metadata (fs2json format v3)
#   <out>/filesystem/<sha256[0..10]>.bin.zst   zstd-compressed file contents, deduplicated
#   <out>/warm.pack                            (with --warm) blobs the page preloads in one request
#
# Equivalent to v86's tools/fs2json.py + tools/copy-to-sha256.py --zstd, in one pass over the tar.
# Needs OTP 28+ for the built-in :zstd module.
#
#   elixir tar2v86.exs rootfs.tar out_dir [--warm REGEX]
#
# warm.pack layout: <<index_size::32-little, index_json::binary, blobs::binary>>, where the index
# is a JSON list of [blob_name, uncompressed_size, compressed_size] in blob order.

defmodule Tar2V86 do
  import Bitwise

  @version 3
  # keep in sync with HASH_LENGTH in v86's fs2json.py
  @hash_length 10
  @s_ifreg 0o100000
  @s_ifdir 0o040000
  @s_iflnk 0o120000
  @zstd_level 19

  def run(argv) do
    case OptionParser.parse(argv, strict: [warm: :string]) do
      {opts, [tar_path, out_dir], []} -> convert(tar_path, out_dir, opts[:warm])
      _ -> usage()
    end
  end

  defp convert(tar_path, out_dir, warm) do
    blobs_dir = Path.join(out_dir, "filesystem")
    File.mkdir_p!(blobs_dir)

    {nodes, _seen} =
      tar_path
      |> entries()
      |> Stream.reject(&(&1.path == ""))
      |> Task.async_stream(&store_blob(&1, blobs_dir),
        max_concurrency: System.schedulers_online(),
        timeout: :infinity
      )
      |> Enum.reduce({[], %{}}, fn {:ok, entry}, acc -> to_node(entry, acc) end)

    nodes = Enum.reverse(nodes)
    total_size = Enum.reduce(nodes, 0, fn {_path, node}, acc -> acc + Enum.at(node, 1) end)

    json =
      JSON.encode!(%{
        "fsroot" => build_tree(nodes),
        "version" => @version,
        "size" => total_size
      })

    File.write!(Path.join(out_dir, "filesystem.json"), json)

    IO.puts(
      "#{length(nodes)} entries, #{div(total_size, 1 <<< 20)} MB uncompressed -> #{out_dir}"
    )

    if warm, do: write_warm_pack(nodes, Regex.compile!(warm), out_dir)
  end

  # Bundle the blobs of matching files so the page can fetch them in one request instead of one
  # blocking round trip per file the first time the guest opens it
  defp write_warm_pack(nodes, regex, out_dir) do
    blobs_dir = Path.join(out_dir, "filesystem")

    entries =
      for {path, [_, size, _, mode, _, _, filename]} <- nodes,
          is_binary(filename) and (mode &&& 0o170000) == @s_ifreg,
          Regex.match?(regex, "/" <> path),
          uniq: true do
        {filename, size, File.read!(Path.join(blobs_dir, filename))}
      end

    index = JSON.encode!(for {name, size, blob} <- entries, do: [name, size, byte_size(blob)])
    blobs = for {_, _, blob} <- entries, do: blob

    File.write!(Path.join(out_dir, "warm.pack"), [<<byte_size(index)::32-little>>, index | blobs])

    compressed = blobs |> Enum.map(&byte_size/1) |> Enum.sum()
    IO.puts("warm.pack: #{length(entries)} files, #{div(compressed, 1 <<< 20)} MB")
  end

  defp usage do
    IO.puts(:stderr, "usage: elixir tar2v86.exs <rootfs.tar> <out_dir> [--warm REGEX]")
    System.halt(1)
  end

  # Hash and compress regular file contents in parallel; everything else passes straight through
  defp store_blob(%{type: :file, data: data} = entry, blobs_dir) do
    hash = :crypto.hash(:sha256, data) |> Base.encode16(case: :lower)
    filename = binary_part(hash, 0, @hash_length) <> ".bin.zst"
    path = Path.join(blobs_dir, filename)

    unless File.exists?(path) do
      # write-then-rename so identical files compressed concurrently never interleave
      tmp = path <> ".#{System.unique_integer([:positive])}.tmp"
      File.write!(tmp, :zstd.compress(data, %{compressionLevel: @zstd_level}))
      File.rename!(tmp, path)
    end

    entry
    |> Map.delete(:data)
    |> Map.merge(%{hash: hash, filename: filename, size: byte_size(data)})
  end

  defp store_blob(entry, _blobs_dir), do: entry

  # Node layout: [name, size, mtime, mode, uid, gid, filename | symlink target | children]
  # `seen` maps short blob names to full hashes (collision check) and file paths to nodes (hard links)
  defp to_node(entry, {nodes, seen}) do
    base = [Path.basename(entry.path), entry.size, entry.mtime, entry.mode, entry.uid, entry.gid]

    case entry.type do
      :file ->
        if (existing = seen[{:blob, entry.filename}]) && existing != entry.hash do
          raise "collision in short hash (#{existing} and #{entry.hash})"
        end

        node = List.update_at(base ++ [entry.filename], 3, &(&1 ||| @s_ifreg))

        seen =
          seen
          |> Map.put({:blob, entry.filename}, entry.hash)
          |> Map.put({:file, entry.path}, node)

        {[{entry.path, node} | nodes], seen}

      :hardlink ->
        # Hard links become independent files sharing the target's blob
        target = Map.fetch!(seen, {:file, entry.linkname})
        node = base |> List.replace_at(1, Enum.at(target, 1)) |> Kernel.++([List.last(target)])
        node = List.update_at(node, 3, &(&1 ||| @s_ifreg))
        {[{entry.path, node} | nodes], Map.put(seen, {:file, entry.path}, node)}

      :dir ->
        {[{entry.path, List.update_at(base ++ [:dir], 3, &(&1 ||| @s_ifdir))} | nodes], seen}

      :symlink ->
        node = List.update_at(base ++ [entry.linkname], 3, &(&1 ||| @s_iflnk))
        {[{entry.path, node} | nodes], seen}

      other ->
        IO.puts(:stderr, "Unsupported type: #{inspect(other)} (#{entry.path})")
        {[{entry.path, base} | nodes], seen}
    end
  end

  defp build_tree(nodes) do
    by_parent = Enum.group_by(nodes, fn {path, _} -> parent(path) end)
    children(by_parent, "")
  end

  defp children(by_parent, dir) do
    for {path, node} <- Map.get(by_parent, dir, []) do
      if List.last(node) == :dir,
        do: List.replace_at(node, 6, children(by_parent, path)),
        else: node
    end
  end

  defp parent(path) do
    case Path.dirname(path) do
      "." -> ""
      dir -> dir
    end
  end

  ## Streaming tar reader (ustar + PAX + GNU long names)

  defp entries(tar_path) do
    Stream.resource(
      fn -> File.open!(tar_path, [:read, :binary, :raw, read_ahead: 1 <<< 20]) end,
      fn dev ->
        case next_entry(dev, %{}) do
          :eof -> {:halt, dev}
          entry -> {[entry], dev}
        end
      end,
      &File.close/1
    )
  end

  defp next_entry(dev, overrides) do
    case read(dev, 512) do
      <<0::size(512 * 8)>> -> :eof
      "" -> :eof
      <<header::binary-size(512)>> -> parse_header(dev, header, overrides)
    end
  end

  defp parse_header(dev, h, overrides) do
    size = num(binary_part(h, 124, 12))
    typeflag = binary_part(h, 156, 1)
    size = if typeflag in ["x", "g", "L", "K"], do: size, else: Map.get(overrides, :size, size)
    data = read_padded(dev, size)

    case typeflag do
      "x" -> next_entry(dev, Map.merge(overrides, pax(data)))
      "g" -> next_entry(dev, overrides)
      "L" -> next_entry(dev, Map.put(overrides, :path, cstr(data)))
      "K" -> next_entry(dev, Map.put(overrides, :linkpath, cstr(data)))
      _ -> build_entry(h, typeflag, size, data, overrides)
    end
  end

  defp build_entry(h, typeflag, size, data, overrides) do
    name =
      case {binary_part(h, 257, 5), cstr(binary_part(h, 345, 155))} do
        {"ustar", prefix} when prefix != "" -> prefix <> "/" <> cstr(binary_part(h, 0, 100))
        _ -> cstr(binary_part(h, 0, 100))
      end

    type =
      case typeflag do
        t when t in ["0", <<0>>, "7"] -> :file
        "1" -> :hardlink
        "2" -> :symlink
        "5" -> :dir
        other -> {:typeflag, other}
      end

    entry = %{
      path: normalize(Map.get(overrides, :path, name)),
      type: type,
      mode: num(binary_part(h, 100, 8)),
      uid: Map.get(overrides, :uid, num(binary_part(h, 108, 8))),
      gid: Map.get(overrides, :gid, num(binary_part(h, 116, 8))),
      size: size,
      mtime: Map.get(overrides, :mtime, num(binary_part(h, 136, 12))),
      linkname: Map.get(overrides, :linkpath, cstr(binary_part(h, 157, 100)))
    }

    entry =
      case type do
        :file -> Map.put(entry, :data, data)
        :hardlink -> Map.update!(entry, :linkname, &normalize/1)
        _ -> entry
      end

    entry
  end

  defp normalize(path) do
    path |> String.trim_leading("./") |> String.trim_leading("/") |> String.trim_trailing("/")
  end

  defp pax(data, acc \\ %{})
  defp pax("", acc), do: acc

  defp pax(data, acc) do
    [len, _] = String.split(data, " ", parts: 2)
    len = String.to_integer(len)
    <<record::binary-size(^len), rest::binary>> = data
    [_, kv] = String.split(record, " ", parts: 2)
    [key, value] = String.split(String.trim_trailing(kv, "\n"), "=", parts: 2)

    acc =
      case key do
        "path" -> Map.put(acc, :path, value)
        "linkpath" -> Map.put(acc, :linkpath, value)
        "size" -> Map.put(acc, :size, String.to_integer(value))
        "uid" -> Map.put(acc, :uid, String.to_integer(value))
        "gid" -> Map.put(acc, :gid, String.to_integer(value))
        "mtime" -> Map.put(acc, :mtime, value |> String.split(".") |> hd() |> String.to_integer())
        _ -> acc
      end

    pax(rest, acc)
  end

  # Octal, or base-256 when the high bit is set (GNU extension for large values)
  defp num(<<1::1, high::7, rest::binary>>) do
    high <<< (8 * byte_size(rest)) ||| :binary.decode_unsigned(rest)
  end

  defp num(field) do
    case field |> cstr() |> String.trim() do
      "" -> 0
      octal -> String.to_integer(octal, 8)
    end
  end

  defp cstr(bin), do: bin |> :binary.split(<<0>>) |> hd()

  defp read_padded(_dev, 0), do: ""

  defp read_padded(dev, size) do
    data = read(dev, size)
    pad = rem(512 - rem(size, 512), 512)
    if pad > 0, do: read(dev, pad)
    data
  end

  defp read(dev, n) do
    case :file.read(dev, n) do
      {:ok, data} -> data
      :eof -> ""
    end
  end
end

Tar2V86.run(System.argv())
