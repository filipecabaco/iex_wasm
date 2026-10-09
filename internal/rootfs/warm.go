package rootfs

import (
	"bufio"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

// WarmSelection decides which files go in the warm pack.
type WarmSelection struct {
	// Blob names to include: what the guest read while booting and while being exercised
	Reads map[string]bool
	// Extra files to include by guest path
	Match *regexp.Regexp
}

// Reads is what build-state.mjs recorded: blob names read while booting, and while running each
// exercise command after the snapshot was saved.
type Reads struct {
	Boot     []string            `json:"boot"`
	Exercise map[string][]string `json:"exercise"`
}

// ReadReads loads reads.json written by build-state.mjs.
func ReadReads(file string) (*Reads, error) {
	data, err := os.ReadFile(file)
	if err != nil {
		return nil, err
	}
	var r Reads
	if err := json.Unmarshal(data, &r); err != nil {
		return nil, fmt.Errorf("%s: %w", file, err)
	}
	return &r, nil
}

// All returns every blob read in any phase.
func (r *Reads) All() map[string]bool {
	all := map[string]bool{}
	for _, name := range r.Boot {
		all[name] = true
	}
	for _, names := range r.Exercise {
		for _, name := range names {
			all[name] = true
		}
	}
	return all
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
		if sel.Reads[f.Blob] || (sel.Match != nil && sel.Match.MatchString(f.Path)) {
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
