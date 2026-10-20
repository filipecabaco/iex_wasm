package rootfs

import (
	"crypto/sha256"
	"encoding/binary"
)

// Content-defined chunking for large files, the same as armless's tests/fs/cdc.py so both tools
// cut identical contents at identical points (and name the chunks alike). A gear hash
// (FastCDC-style, with normalized chunking) picks cut points from the contents, so an insertion
// early in a file only changes the chunks around it and the rest still dedupe.
const (
	chunkMin = 256 << 10
	chunkAvg = 1 << 20
	chunkMax = 4 << 20
	// ChunkThreshold is the size from which a file is split into chunks
	ChunkThreshold = 2 * chunkAvg

	// Stricter before chunkAvg, looser after: sizes cluster around it
	maskSmall = 1<<21 - 1
	maskLarge = 1<<19 - 1
)

var gear = func() (g [256]uint64) {
	for i := range g {
		sum := sha256.Sum256([]byte{byte(i)})
		g[i] = binary.LittleEndian.Uint64(sum[:8])
	}
	return
}()

// cut returns the end of the chunk of data that starts at start.
func cut(data []byte, start int) int {
	n := len(data) - start
	if n <= chunkMin {
		return len(data)
	}
	end := start + min(n, chunkMax)
	mid := start + min(n, chunkAvg)
	var h uint64
	i := start + chunkMin
	for ; i < mid; i++ {
		h = h<<1 + gear[data[i]]
		if h&maskSmall == 0 {
			return i + 1
		}
	}
	for ; i < end; i++ {
		h = h<<1 + gear[data[i]]
		if h&maskLarge == 0 {
			return i + 1
		}
	}
	return end
}

// chunks splits data into its content-defined chunks.
func chunks(data []byte) [][]byte {
	var out [][]byte
	for start := 0; start < len(data); {
		end := cut(data, start)
		out = append(out, data[start:end])
		start = end
	}
	return out
}
