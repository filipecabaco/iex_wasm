package rootfs

import (
	"os"
	"path/filepath"
	"slices"
	"testing"
)

// /bin/big in two chunks (one shared with /bin/copy), /bin/sh in one blob, a symlink and an empty dir
const chunkedFS = `{"version":3,"size":21,"fsroot":[
	["bin",0,0,16877,0,0,[
		["big",8,0,33188,0,0,[["aaaaaaaaaa.bin.zst",5],["bbbbbbbbbb.bin.zst",3]]],
		["copy",8,0,33188,0,0,[["aaaaaaaaaa.bin.zst",5],["cccccccccc.bin.zst",3]]],
		["sh",5,0,33261,0,0,"dddddddddd.bin.zst"],
		["link",3,0,41471,0,0,"sh"],
		["empty",0,0,16877,0,0,[]]]]]}`

func TestListBlobs(t *testing.T) {
	refs, err := ListBlobs([]byte(chunkedFS))
	if err != nil {
		t.Fatal(err)
	}
	want := []BlobRef{{"aaaaaaaaaa.bin.zst", 5}, {"bbbbbbbbbb.bin.zst", 3}, {"cccccccccc.bin.zst", 3}, {"dddddddddd.bin.zst", 5}}
	if !slices.Equal(refs, want) {
		t.Errorf("got %v, want %v", refs, want)
	}
}

func TestBlobSizesChunked(t *testing.T) {
	file := filepath.Join(t.TempDir(), "filesystem.json")
	os.WriteFile(file, []byte(chunkedFS), 0o644)
	sizes, err := BlobSizes(file)
	if err != nil {
		t.Fatal(err)
	}
	if len(sizes) != 4 || sizes["aaaaaaaaaa.bin.zst"] != 5 || sizes["cccccccccc.bin.zst"] != 3 || sizes["dddddddddd.bin.zst"] != 5 {
		t.Errorf("sizes = %v", sizes)
	}
}
