package rootfs

import (
	"bufio"
	"encoding/binary"
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// WarmSelection decides which files go in the warm pack.
type WarmSelection struct {
	// Blob names the guest read while booting, as recorded by build-state.mjs
	BootReads map[string]bool
	// Extra files to include by guest path
	Match *regexp.Regexp
}

// ReadBootReads loads the list of blob names written by build-state.mjs.
func ReadBootReads(file string) (map[string]bool, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	reads := map[string]bool{}
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		if name := strings.TrimSpace(scanner.Text()); name != "" {
			reads[name] = true
		}
	}
	return reads, scanner.Err()
}

// WriteWarmPack bundles the selected blobs into <outDir>/warm.pack so the page can fetch them in
// one request instead of one blocking round trip per file the first time the guest opens it.
//
// Layout: <<index_size::32-little, index_json, blobs...>>, where the index is a JSON list of
// [blob_name, uncompressed_size, compressed_size] in blob order.
func WriteWarmPack(res *Result, sel WarmSelection, outDir string) (files int, bytes int64, err error) {
	type item struct {
		blob string
		size int64
	}
	var picked []item
	seen := map[string]bool{}

	for _, f := range res.Files {
		// The kernel and initramfs are read by v86 itself at boot, never again after a restore
		if strings.HasPrefix(f.Path, "/boot/") || seen[f.Blob] {
			continue
		}
		if sel.BootReads[f.Blob] || (sel.Match != nil && sel.Match.MatchString(f.Path)) {
			seen[f.Blob] = true
			picked = append(picked, item{f.Blob, f.Size})
		}
	}

	index := make([][]any, 0, len(picked))
	blobs := make([][]byte, 0, len(picked))
	for _, p := range picked {
		data, err := os.ReadFile(res.Blobs[p.blob])
		if err != nil {
			return 0, 0, err
		}
		index = append(index, []any{p.blob, p.size, len(data)})
		blobs = append(blobs, data)
		bytes += int64(len(data))
	}

	indexJSON, err := json.Marshal(index)
	if err != nil {
		return 0, 0, err
	}

	out, err := os.Create(filepath.Join(outDir, "warm.pack"))
	if err != nil {
		return 0, 0, err
	}
	defer out.Close()

	w := bufio.NewWriter(out)
	if err := binary.Write(w, binary.LittleEndian, uint32(len(indexJSON))); err != nil {
		return 0, 0, err
	}
	w.Write(indexJSON)
	for _, b := range blobs {
		w.Write(b)
	}
	if err := w.Flush(); err != nil {
		return 0, 0, err
	}
	return len(picked), bytes, out.Close()
}
