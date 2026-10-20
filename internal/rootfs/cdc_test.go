package rootfs

import (
	"crypto/sha256"
	"encoding/binary"
	"slices"
	"testing"
)

// Incompressible, reproducible bytes: sha256 of each little-endian counter
func counterData(n int) []byte {
	data := make([]byte, 0, n)
	var i [8]byte
	for c := uint64(0); len(data) < n; c++ {
		binary.LittleEndian.PutUint64(i[:], c)
		sum := sha256.Sum256(i[:])
		data = append(data, sum[:]...)
	}
	return data[:n]
}

func ends(parts [][]byte) []int {
	var out []int
	total := 0
	for _, p := range parts {
		total += len(p)
		out = append(out, total)
	}
	return out
}

// The cut points armless's tests/fs/cdc.py picks for the same inputs (python3 -I, cdc.chunks),
// so both tools store identical contents as identical chunks.
func TestChunksMatchArmlessCDC(t *testing.T) {
	data := counterData(32 << 20)
	cases := []struct {
		name string
		data []byte
		want []int
	}{
		// 10 of its 29 chunks end before chunkAvg (the stricter mask), the rest after it
		{"random", data, []int{1096528, 2544094, 4084399, 5231853, 6423695, 7619978, 8948085, 9828341,
			11071473, 11958272, 13094468, 14920459, 16009798, 17014525, 19117516, 20559685, 21718539,
			22445594, 22989229, 24257755, 24785021, 26425551, 26737641, 27879006, 28324880, 28748533,
			31596091, 33363525, 33554432}},
		// An insertion shifts every cut point by its length: the chunks after the first all dedupe
		{"prepend 10 bytes", append([]byte("0123456789"), data[:9<<20]...),
			[]int{1096538, 2544104, 4084409, 5231863, 6423705, 7619988, 8948095, 9437194}},
		{"zeros", make([]byte, 9<<20), []int{4194304, 8388608, 9437184}},
	}
	for _, c := range cases {
		if got := ends(chunks(c.data)); !slices.Equal(got, c.want) {
			t.Errorf("%s: cut at %v, want %v", c.name, got, c.want)
		}
	}
	if gear[0] != 0x987ab3ff9c0b346e || gear[255] != 0xd04019aae60a10a8 {
		t.Errorf("gear table differs from cdc.py's: %#x %#x", gear[0], gear[255])
	}
}

func TestChunksBounds(t *testing.T) {
	data := counterData(20 << 20)
	parts := chunks(data)
	if !slices.Equal(ends(parts), ends(chunks(data))) {
		t.Fatal("chunking isn't deterministic")
	}
	total := 0
	for i, p := range parts {
		if len(p) > chunkMax || (len(p) < chunkMin && i != len(parts)-1) {
			t.Errorf("chunk %d is %d bytes", i, len(p))
		}
		total += len(p)
	}
	if total != len(data) {
		t.Errorf("chunks cover %d of %d bytes", total, len(data))
	}
	// Small inputs are one chunk
	if got := chunks(data[:chunkMin]); len(got) != 1 {
		t.Errorf("%d chunks for %d bytes", len(got), chunkMin)
	}
}
