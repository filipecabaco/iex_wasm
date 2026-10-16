package rootfs

import (
	"os"
	"path/filepath"
	"testing"
)

func TestExtendWarmPack(t *testing.T) {
	system := t.TempDir()
	blobs := filepath.Join(system, "filesystem")
	os.MkdirAll(blobs, 0o755)
	// /bin/a (3 bytes), /bin/b (5) and /etc/c (7), as fs2json nodes
	fs := `{"version":3,"size":15,"fsroot":[
		["bin",0,0,16877,0,0,[["a",3,0,33188,0,0,"aaaaaaaaaa.bin.zst"],["b",5,0,33188,0,0,"bbbbbbbbbb.bin.zst"]]],
		["etc",0,0,16877,0,0,[["c",7,0,33188,0,0,"cccccccccc.bin.zst"],["link",4,0,41471,0,0,"/bin/a"]]]]}`
	os.WriteFile(filepath.Join(system, "filesystem.json"), []byte(fs), 0o644)
	for _, b := range []string{"aaaaaaaaaa", "bbbbbbbbbb", "cccccccccc"} {
		os.WriteFile(filepath.Join(blobs, b+".bin.zst"), []byte("zstd:"+b), 0o644)
	}

	// No pack yet: one is made
	added, files, _, err := ExtendWarmPack(system, blobs, []string{"aaaaaaaaaa.bin.zst", "unknown.bin.zst"})
	if err != nil || added != 1 || files != 1 {
		t.Fatalf("first: added %d of %d, %v", added, files, err)
	}
	// Known blobs are kept, new ones appended in the order given, unknown ones ignored
	added, files, bytes, err := ExtendWarmPack(system, blobs,
		[]string{"cccccccccc.bin.zst", "aaaaaaaaaa.bin.zst", "bbbbbbbbbb.bin.zst"})
	if err != nil || added != 2 || files != 3 || bytes != 3*15 {
		t.Fatalf("second: added %d, %d files, %d bytes, %v", added, files, bytes, err)
	}
	entries, data, err := ReadWarmPack(filepath.Join(system, "warm.pack"))
	if err != nil {
		t.Fatal(err)
	}
	want := []PackEntry{{"aaaaaaaaaa.bin.zst", 3, 15}, {"cccccccccc.bin.zst", 7, 15}, {"bbbbbbbbbb.bin.zst", 5, 15}}
	for i, e := range entries {
		if e != want[i] || string(data[i]) != "zstd:"+e.Blob[:10] {
			t.Errorf("entry %d: %+v %q, want %+v", i, e, data[i], want[i])
		}
	}
	// Nothing new: the pack is left alone
	if added, files, _, err := ExtendWarmPack(system, blobs, []string{"aaaaaaaaaa.bin.zst"}); err != nil || added != 0 || files != 3 {
		t.Errorf("nothing new: added %d, %d files, %v", added, files, err)
	}
}
