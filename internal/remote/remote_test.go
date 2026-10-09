package remote

import (
	"archive/tar"
	"bytes"
	"encoding/binary"
	"os"
	"path/filepath"
	"testing"
)

func TestUnpackWarm(t *testing.T) {
	index := []byte(`[["a.bin.zst",10,3],["b.bin.zst",4,2]]`)
	var pack bytes.Buffer
	binary.Write(&pack, binary.LittleEndian, uint32(len(index)))
	pack.Write(index)
	pack.WriteString("AAABB")

	dir := t.TempDir()
	n, err := unpackWarm(pack.Bytes(), dir)
	if err != nil || n != 2 {
		t.Fatal(n, err)
	}
	a, _ := os.ReadFile(filepath.Join(dir, "a.bin.zst"))
	b, _ := os.ReadFile(filepath.Join(dir, "b.bin.zst"))
	if string(a) != "AAA" || string(b) != "BB" {
		t.Errorf("got %q %q", a, b)
	}
}

func TestExtractStaysInside(t *testing.T) {
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	for name, data := range map[string]string{"run.json": "{}", "../../escape": "no"} {
		tw.WriteHeader(&tar.Header{Name: name, Mode: 0o644, Size: int64(len(data)), Typeflag: tar.TypeReg})
		tw.Write([]byte(data))
	}
	tw.Close()

	root := t.TempDir()
	dir := filepath.Join(root, "site")
	if err := extract(&buf, "x.tar", dir); err != nil {
		t.Fatal(err)
	}
	if _, err := os.Stat(filepath.Join(root, "escape")); err == nil {
		t.Error("an entry escaped the cache directory")
	}
}

func TestIsTarball(t *testing.T) {
	for source, want := range map[string]bool{
		"https://cdn.example.com/elixir.tar.gz?v=2": true,
		"site.tar.zst": true,
		"https://filipecabaco.github.io/snowglobe/elixir/": false,
		"dist/elixir": false,
	} {
		if IsTarball(source) != want {
			t.Errorf("%s: want %v", source, want)
		}
	}
}
