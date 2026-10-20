package rootfs

import (
	"encoding/json"
	"strings"
)

// BlobRef is a blob a filesystem.json refers to, with its uncompressed size.
type BlobRef struct {
	Name string
	Size int64
}

// ListBlobs lists every blob a filesystem.json refers to, once each, in tree order. File nodes
// are [name, size, mtime, mode, uid, gid, blob] or, for a chunked file, end in a list of
// [blob, length] pairs; directories carry a list of children instead.
func ListBlobs(data []byte) ([]BlobRef, error) {
	var doc struct {
		Root []json.RawMessage `json:"fsroot"`
	}
	if err := json.Unmarshal(data, &doc); err != nil {
		return nil, err
	}
	seen := map[string]bool{}
	var refs []BlobRef
	add := func(name string, size int64) {
		if strings.HasSuffix(name, ".bin.zst") && !seen[name] {
			seen[name] = true
			refs = append(refs, BlobRef{name, size})
		}
	}
	var walk func([]json.RawMessage)
	walk = func(nodes []json.RawMessage) {
		for _, raw := range nodes {
			var node []json.RawMessage
			var mode int64
			if json.Unmarshal(raw, &node) != nil || len(node) < 7 || json.Unmarshal(node[3], &mode) != nil {
				continue
			}
			switch mode & 0o170000 {
			case sIFDIR:
				var children []json.RawMessage
				if json.Unmarshal(node[6], &children) == nil {
					walk(children)
				}
			case sIFREG:
				var name string
				var size int64
				if json.Unmarshal(node[6], &name) == nil {
					if json.Unmarshal(node[1], &size) == nil {
						add(name, size)
					}
					continue
				}
				var chunks [][]json.RawMessage
				if json.Unmarshal(node[6], &chunks) != nil {
					continue
				}
				for _, c := range chunks {
					if len(c) == 2 && json.Unmarshal(c[0], &name) == nil && json.Unmarshal(c[1], &size) == nil {
						add(name, size)
					}
				}
			}
		}
	}
	walk(doc.Root)
	return refs, nil
}
