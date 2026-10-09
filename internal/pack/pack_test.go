package pack

import (
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/filipecabaco/snowglobe/internal/remote"
)

const filesystem = `{"fsroot":[["bin",0,0,16877,0,0,[["sh",3,0,33261,0,0,"aaaaaaaaaa.bin.zst"]]],["etc",0,0,16877,0,0,[["hosts",2,0,33188,0,0,"bbbbbbbbbb.bin.zst"]]]],"version":3,"size":5}`

func write(t *testing.T, p, data string) {
	t.Helper()
	os.MkdirAll(filepath.Dir(p), 0o755)
	if err := os.WriteFile(p, []byte(data), 0o644); err != nil {
		t.Fatal(err)
	}
}

func TestPooledSiteRoundTrip(t *testing.T) {
	root := t.TempDir()
	site := filepath.Join(root, "demo")
	write(t, filepath.Join(site, "run.json"), `{"title":"demo"}`)
	write(t, filepath.Join(site, "index.html"), `baseurl: "../blobs/",`)
	write(t, filepath.Join(site, "system", "filesystem.json"), filesystem)
	write(t, filepath.Join(root, "blobs", "aaaaaaaaaa.bin.zst"), "sh!")
	write(t, filepath.Join(root, "blobs", "bbbbbbbbbb.bin.zst"), "hs")
	write(t, filepath.Join(root, "blobs", "unrelated0.bin.zst"), "not this site's")

	for _, ext := range []string{".tar.gz", ".tar.zst"} {
		archive := filepath.Join(root, "demo"+ext)
		if _, err := Run(site, archive); err != nil {
			t.Fatal(err)
		}
		dir, err := remote.Unpack(archive)
		if err != nil {
			t.Fatal(err)
		}
		t.Cleanup(func() { os.RemoveAll(dir) })

		got, _ := os.ReadFile(filepath.Join(dir, "system", "filesystem", "aaaaaaaaaa.bin.zst"))
		if string(got) != "sh!" {
			t.Errorf("%s: the pooled blob should be back in the site, got %q", ext, got)
		}
		if _, err := os.Stat(filepath.Join(dir, "system", "filesystem", "unrelated0.bin.zst")); err == nil {
			t.Errorf("%s: another site's blob came along", ext)
		}
		page, _ := os.ReadFile(filepath.Join(dir, "index.html"))
		if !strings.Contains(string(page), `"system/filesystem/"`) {
			t.Errorf("%s: the page should read its own blobs again: %s", ext, page)
		}
	}
}

func TestBlobNames(t *testing.T) {
	file := filepath.Join(t.TempDir(), "filesystem.json")
	write(t, file, filesystem)
	names, err := remote.BlobNames(file)
	if err != nil || strings.Join(names, ",") != "aaaaaaaaaa.bin.zst,bbbbbbbbbb.bin.zst" {
		t.Errorf("got %v, %v", names, err)
	}
}
