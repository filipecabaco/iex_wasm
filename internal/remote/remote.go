// Package remote fetches a snowglobe site from a URL into a local cache, so `snowglobe run` can
// take a deployed site (any static host or CDN) or a tarball made by `snowglobe pack` as easily
// as a directory. Everything is fetched before the run starts: the sandbox itself stays offline.
package remote

import (
	"archive/tar"
	"compress/gzip"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"sync/atomic"

	"github.com/klauspost/compress/zstd"
)

// IsURL reports whether a run source is remote.
func IsURL(source string) bool {
	return strings.HasPrefix(source, "https://") || strings.HasPrefix(source, "http://")
}

// IsTarball reports whether a source (a URL or a path) names a packed site.
func IsTarball(source string) bool {
	p := source
	if u, err := url.Parse(source); err == nil && IsURL(source) {
		p = u.Path
	}
	for _, ext := range []string{".tar.gz", ".tgz", ".tar.zst", ".tar"} {
		if strings.HasSuffix(p, ext) {
			return true
		}
	}
	return false
}

// Fetch makes the site at source available locally and returns its directory: a tarball URL is
// downloaded and unpacked, a site URL is mirrored file by file. Both are cached and revalidated.
func Fetch(source string) (string, error) {
	base, err := os.UserCacheDir()
	if err != nil {
		return "", err
	}
	sum := sha256.Sum256([]byte(source))
	dir := filepath.Join(base, "snowglobe", "sites", hex.EncodeToString(sum[:8]))
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return "", err
	}
	if IsTarball(source) {
		return dir, fetchTarball(source, dir)
	}
	return dir, mirror(source, dir)
}

// Unpack extracts a local tarball into the cache and returns its directory.
func Unpack(file string) (string, error) {
	abs, err := filepath.Abs(file)
	if err != nil {
		return "", err
	}
	info, err := os.Stat(abs)
	if err != nil {
		return "", err
	}
	base, err := os.UserCacheDir()
	if err != nil {
		return "", err
	}
	sum := sha256.Sum256([]byte(fmt.Sprintf("%s|%d|%d", abs, info.Size(), info.ModTime().UnixNano())))
	dir := filepath.Join(base, "snowglobe", "sites", hex.EncodeToString(sum[:8]))
	if _, err := os.Stat(filepath.Join(dir, "run.json")); err == nil {
		return dir, nil
	}
	f, err := os.Open(abs)
	if err != nil {
		return "", err
	}
	defer f.Close()
	return dir, extract(f, abs, dir)
}

// ---- a tarball ----

func fetchTarball(source, dir string) error {
	// Revalidate with whichever validator the server gave: CDNs send an ETag, plain file servers
	// often only Last-Modified
	etagFile, modifiedFile := filepath.Join(dir, ".etag"), filepath.Join(dir, ".last-modified")
	req, err := http.NewRequest("GET", source, nil)
	if err != nil {
		return err
	}
	if _, err := os.Stat(filepath.Join(dir, "run.json")); err == nil {
		if etag, err := os.ReadFile(etagFile); err == nil {
			req.Header.Set("If-None-Match", string(etag))
		}
		if modified, err := os.ReadFile(modifiedFile); err == nil {
			req.Header.Set("If-Modified-Since", string(modified))
		}
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	if resp.StatusCode == http.StatusNotModified {
		fmt.Fprintf(os.Stderr, "using the cached copy of %s\n", source)
		return nil
	}
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("%s: %s", source, resp.Status)
	}
	fmt.Fprintf(os.Stderr, "downloading %s (%s)\n", source, size(resp.ContentLength))
	if err := os.RemoveAll(dir); err != nil {
		return err
	}
	if err := extract(resp.Body, source, dir); err != nil {
		return err
	}
	if etag := resp.Header.Get("ETag"); etag != "" {
		os.WriteFile(etagFile, []byte(etag), 0o644)
	}
	if modified := resp.Header.Get("Last-Modified"); modified != "" {
		os.WriteFile(modifiedFile, []byte(modified), 0o644)
	}
	return nil
}

func extract(r io.Reader, name, dir string) error {
	switch {
	case strings.HasSuffix(name, ".gz") || strings.HasSuffix(name, ".tgz"):
		gz, err := gzip.NewReader(r)
		if err != nil {
			return err
		}
		defer gz.Close()
		r = gz
	case strings.HasSuffix(name, ".zst"):
		zr, err := zstd.NewReader(r)
		if err != nil {
			return err
		}
		defer zr.Close()
		r = zr
	}

	tr := tar.NewReader(r)
	for {
		h, err := tr.Next()
		if errors.Is(err, io.EOF) {
			break
		}
		if err != nil {
			return fmt.Errorf("reading %s: %w", name, err)
		}
		target := filepath.Join(dir, filepath.FromSlash(path.Clean("/"+h.Name)))
		if !strings.HasPrefix(target, filepath.Clean(dir)+string(os.PathSeparator)) {
			continue // never write outside the cache directory
		}
		switch h.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(target, 0o755); err != nil {
				return err
			}
		case tar.TypeReg:
			if err := writeFile(target, tr); err != nil {
				return err
			}
		}
	}
	if _, err := os.Stat(filepath.Join(dir, "run.json")); err != nil {
		return fmt.Errorf("%s isn't a packed snowglobe site (no run.json)", name)
	}
	return nil
}

// ---- a deployed site ----

var baseurlPattern = regexp.MustCompile(`baseurl:\s*"([^"]+)"`)

// The files a run needs besides the guest's blobs; the optional ones exist only for some sites
var siteFiles = []struct {
	path     string
	optional bool
}{
	{"run.json", false}, {"index.html", false}, {"bios/seabios.bin", false}, {"bios/vgabios.bin", false},
	{"system/filesystem.json", false}, {"system/state.bin.zst", false}, {"system/console.bin", true},
	{"system/tls.json", true}, {"https-bridge.js", true},
}

func mirror(source, dir string) error {
	if !strings.HasSuffix(source, "/") {
		source += "/"
	}
	site, err := url.Parse(source)
	if err != nil {
		return err
	}

	// run.json says which build this is: when it matches the cache, nothing else is fetched
	fresh, err := get(site.ResolveReference(&url.URL{Path: "run.json"}).String())
	if err != nil {
		return fmt.Errorf("%s doesn't look like a snowglobe site: %w", source, err)
	}
	if cached, err := os.ReadFile(filepath.Join(dir, "run.json")); err == nil && string(cached) == string(fresh) {
		if _, err := os.Stat(filepath.Join(dir, ".complete")); err == nil {
			fmt.Fprintf(os.Stderr, "using the cached copy of %s\n", source)
			return nil
		}
	}
	os.Remove(filepath.Join(dir, ".complete"))
	fmt.Fprintf(os.Stderr, "fetching %s\n", source)

	for _, f := range siteFiles {
		data, err := get(site.ResolveReference(&url.URL{Path: f.path}).String())
		if err != nil {
			if f.optional {
				continue
			}
			return err
		}
		if err := writeBytes(filepath.Join(dir, filepath.FromSlash(f.path)), data); err != nil {
			return err
		}
	}

	// Blobs live where the page says: the site's own system/filesystem/, or a pooled store
	page, _ := os.ReadFile(filepath.Join(dir, "index.html"))
	blobBase := "system/filesystem/"
	if m := baseurlPattern.FindSubmatch(page); m != nil {
		blobBase = string(m[1])
	}
	blobURL := site.ResolveReference(&url.URL{Path: blobBase})
	blobDir := filepath.Join(dir, "system", "filesystem")

	names, err := BlobNames(filepath.Join(dir, "system", "filesystem.json"))
	if err != nil {
		return err
	}
	var missing []string
	for _, name := range names {
		if _, err := os.Stat(filepath.Join(blobDir, name)); err != nil {
			missing = append(missing, name)
		}
	}

	// The warm pack carries the files a run reads first in one request
	if len(missing) > 0 {
		if pack, err := get(site.ResolveReference(&url.URL{Path: "system/warm.pack"}).String()); err == nil {
			unpacked, err := unpackWarm(pack, blobDir)
			if err == nil {
				fmt.Fprintf(os.Stderr, "  %d files from warm.pack\n", unpacked)
				missing = missing[:0]
				for _, name := range names {
					if _, err := os.Stat(filepath.Join(blobDir, name)); err != nil {
						missing = append(missing, name)
					}
				}
			}
		}
	}

	if err := fetchAll(blobURL, blobDir, missing); err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(dir, ".complete"), nil, 0o644)
}

func fetchAll(base *url.URL, dir string, names []string) error {
	if len(names) == 0 {
		return nil
	}
	var (
		wg      sync.WaitGroup
		done    atomic.Int64
		errOnce sync.Once
		failure error
	)
	jobs := make(chan string)
	for range 16 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for name := range jobs {
				data, err := get(base.ResolveReference(&url.URL{Path: name}).String())
				if err == nil {
					err = writeBytes(filepath.Join(dir, name), data)
				}
				if err != nil {
					errOnce.Do(func() { failure = err })
				}
				if n := done.Add(1); n%100 == 0 || int(n) == len(names) {
					fmt.Fprintf(os.Stderr, "\r  %d/%d files", n, len(names))
				}
			}
		}()
	}
	for _, name := range names {
		jobs <- name
	}
	close(jobs)
	wg.Wait()
	fmt.Fprintln(os.Stderr)
	return failure
}

// BlobNames lists every blob the filesystem refers to: file nodes are
// [name, size, mtime, mode, uid, gid, blob], directories carry a list of children instead
func BlobNames(file string) ([]string, error) {
	data, err := os.ReadFile(file)
	if err != nil {
		return nil, err
	}
	var doc struct {
		Root []json.RawMessage `json:"fsroot"`
	}
	if err := json.Unmarshal(data, &doc); err != nil {
		return nil, err
	}
	seen := map[string]bool{}
	var names []string
	var walk func(nodes []json.RawMessage)
	walk = func(nodes []json.RawMessage) {
		for _, raw := range nodes {
			var node []json.RawMessage
			if json.Unmarshal(raw, &node) != nil || len(node) < 7 {
				continue
			}
			var children []json.RawMessage
			if json.Unmarshal(node[6], &children) == nil {
				walk(children)
				continue
			}
			var blob string
			if json.Unmarshal(node[6], &blob) == nil && strings.HasSuffix(blob, ".bin.zst") && !seen[blob] {
				seen[blob] = true
				names = append(names, blob)
			}
		}
	}
	walk(doc.Root)
	return names, nil
}

// unpackWarm writes the blobs in a warm pack: <<index_size::32-little, index_json, blobs...>>
func unpackWarm(pack []byte, dir string) (int, error) {
	if len(pack) < 4 {
		return 0, errors.New("short warm pack")
	}
	n := int(binary.LittleEndian.Uint32(pack))
	if 4+n > len(pack) {
		return 0, errors.New("bad warm pack index")
	}
	var index [][]any
	if err := json.Unmarshal(pack[4:4+n], &index); err != nil {
		return 0, err
	}
	offset := 4 + n
	for _, entry := range index {
		name, _ := entry[0].(string)
		length, _ := entry[2].(float64)
		end := offset + int(length)
		if name == "" || end > len(pack) {
			return 0, errors.New("bad warm pack entry")
		}
		if err := writeBytes(filepath.Join(dir, name), pack[offset:end]); err != nil {
			return 0, err
		}
		offset = end
	}
	return len(index), nil
}

func get(u string) ([]byte, error) {
	resp, err := http.Get(u)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("%s: %s", u, resp.Status)
	}
	return io.ReadAll(resp.Body)
}

func writeBytes(target string, data []byte) error {
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}
	tmp := target + ".part"
	if err := os.WriteFile(tmp, data, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, target)
}

func writeFile(target string, r io.Reader) error {
	if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
		return err
	}
	f, err := os.OpenFile(target, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	if _, err := io.Copy(f, r); err != nil {
		f.Close()
		return err
	}
	return f.Close()
}

func size(n int64) string {
	if n < 0 {
		return "size unknown"
	}
	return fmt.Sprintf("%.1f MB", float64(n)/(1<<20))
}
