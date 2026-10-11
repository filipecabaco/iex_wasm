package tools

import (
	"strings"
	"testing"
)

func TestSnapshotMemoryHeadroom(t *testing.T) {
	source := []byte("const pages = Math.min(65536, Math.ceil((o.memory_mb + 1024) * 16));")
	patched, err := snapshotMemoryHeadroom(source)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(patched), "o.memory_mb * 3 + 1024") || !strings.Contains(string(patched), "Math.min(65536") {
		t.Fatal("SMP snapshots need guest RAM plus serialization/cache headroom, bounded by wasm32's 4 GiB ceiling")
	}
	if _, err := snapshotMemoryHeadroom([]byte("an unexpected runtime")); err == nil {
		t.Fatal("a changed upstream runtime must not silently skip the required adaptation")
	}
	if _, err := snapshotMemoryHeadroom(append(source, source...)); err == nil {
		t.Fatal("ambiguous upstream runtime must fail closed")
	}
}
