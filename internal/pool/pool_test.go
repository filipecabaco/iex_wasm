package pool

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func site(t *testing.T, root, name string, blobs ...string) {
	t.Helper()
	dir := filepath.Join(root, name)
	os.MkdirAll(filepath.Join(dir, "system", "filesystem"), 0o755)
	os.WriteFile(filepath.Join(dir, marker), nil, 0o644)
	os.WriteFile(filepath.Join(dir, "index.html"), []byte(`baseurl: "system/filesystem/",`), 0o644)
	for _, b := range blobs {
		os.WriteFile(filepath.Join(dir, "system", "filesystem", b), []byte(b), 0o644)
	}
}

func TestRun(t *testing.T) {
	root := t.TempDir()
	site(t, root, "a", "kernel", "python")
	site(t, root, "b", "kernel", "elixir")
	os.MkdirAll(filepath.Join(root, "not-a-site"), 0o755)

	stats, err := Run(root)
	if err != nil {
		t.Fatal(err)
	}
	if stats.Sites != 2 || stats.Files != 4 || stats.Unique != 3 || stats.Saved != int64(len("kernel")) {
		t.Errorf("%+v", stats)
	}
	for _, b := range []string{"kernel", "python", "elixir"} {
		if !exists(filepath.Join(root, "blobs", b)) {
			t.Errorf("blob %s not pooled", b)
		}
	}
	html, _ := os.ReadFile(filepath.Join(root, "a", "index.html"))
	if !strings.Contains(string(html), `baseurl: "../blobs/"`) || exists(filepath.Join(root, "a", "system", "filesystem")) {
		t.Errorf("site a not repointed: %s", html)
	}

	if _, err := Run(root); err == nil {
		t.Error("pooling twice should report nothing left to pool")
	}
}
