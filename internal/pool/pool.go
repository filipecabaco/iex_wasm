// Package pool lets several snowglobe sites share one blob directory. Blobs are named by content
// hash, so sites built from related images (same kernel, same base distro) share many of them:
// pooling stores each once, and a visitor's second site reuses what their browser cached.
package pool

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
)

const (
	// what snowglobe's page uses for its own blobs, and what it becomes once pooled
	ownBlobs = `baseurl: "system/filesystem/"`
	marker   = ".snowglobe"
)

// Stats summarises a pooling run.
type Stats struct {
	Sites, Files, Unique int
	Saved                int64
}

// Run pools every site directly under root (each <root>/<site>/ built by snowglobe) into
// <root>/blobs/ and points each site's page there.
func Run(root string) (Stats, error) {
	var stats Stats
	blobs := filepath.Join(root, "blobs")
	if err := os.MkdirAll(blobs, 0o755); err != nil {
		return stats, err
	}

	entries, err := os.ReadDir(root)
	if err != nil {
		return stats, err
	}
	for _, e := range entries {
		site := filepath.Join(root, e.Name())
		if !e.IsDir() || !exists(filepath.Join(site, marker)) {
			continue
		}
		files, err := filepath.Glob(filepath.Join(site, "system", "filesystem", "*"))
		if err != nil {
			return stats, err
		}
		if len(files) == 0 {
			continue // already pooled
		}

		for _, file := range files {
			target := filepath.Join(blobs, filepath.Base(file))
			if exists(target) {
				info, _ := os.Stat(file)
				stats.Saved += info.Size()
				if err := os.Remove(file); err != nil {
					return stats, err
				}
			} else {
				if err := os.Rename(file, target); err != nil {
					return stats, err
				}
				stats.Unique++
			}
			stats.Files++
		}
		if err := os.Remove(filepath.Join(site, "system", "filesystem")); err != nil {
			return stats, err
		}
		if err := repoint(filepath.Join(site, "index.html")); err != nil {
			return stats, err
		}
		stats.Sites++
	}
	if stats.Sites == 0 {
		return stats, fmt.Errorf("no unpooled snowglobe sites found under %s", root)
	}
	return stats, nil
}

func repoint(index string) error {
	html, err := os.ReadFile(index)
	if err != nil {
		return err
	}
	pooled := bytes.Replace(html, []byte(ownBlobs), []byte(`baseurl: "../blobs/"`), 1)
	if bytes.Equal(pooled, html) {
		return fmt.Errorf("%s: couldn't find the blob location to repoint", index)
	}
	return os.WriteFile(index, pooled, 0o644)
}

func exists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
