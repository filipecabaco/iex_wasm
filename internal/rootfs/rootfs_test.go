package rootfs

import (
	"archive/tar"
	"bytes"
	"crypto/sha256"
	"encoding/binary"
	"encoding/hex"
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"testing"
	"time"

	"github.com/klauspost/compress/zstd"
)

// A tar shaped like `docker export`: dirs, files, an empty file, a symlink, a hard link, and a
// path long enough to need a PAX header.
func sampleTar(t *testing.T) []byte {
	t.Helper()
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	mtime := time.Unix(1700000000, 0)
	long := "usr/lib/" + strings.Repeat("deep/", 30) + "file.txt"

	add := func(h *tar.Header, body string) {
		h.ModTime, h.Size = mtime, int64(len(body))
		if err := tw.WriteHeader(h); err != nil {
			t.Fatal(err)
		}
		tw.Write([]byte(body))
	}
	add(&tar.Header{Name: "etc/", Typeflag: tar.TypeDir, Mode: 0o755}, "")
	add(&tar.Header{Name: "etc/hostname", Typeflag: tar.TypeReg, Mode: 0o644}, "")
	add(&tar.Header{Name: "etc/motd", Typeflag: tar.TypeReg, Mode: 0o644, Uid: 1, Gid: 2}, "hello\n")
	add(&tar.Header{Name: "etc/greeting", Typeflag: tar.TypeLink, Linkname: "etc/motd", Mode: 0o644}, "")
	add(&tar.Header{Name: "etc/link", Typeflag: tar.TypeSymlink, Linkname: "motd", Mode: 0o777}, "")
	add(&tar.Header{Name: "boot/", Typeflag: tar.TypeDir, Mode: 0o755}, "")
	add(&tar.Header{Name: "boot/vmlinuz", Typeflag: tar.TypeReg, Mode: 0o644}, "kernel")
	add(&tar.Header{Name: long, Typeflag: tar.TypeReg, Mode: 0o644}, "deep")
	tw.Close()
	return buf.Bytes()
}

func blobName(content string) string {
	sum := sha256.Sum256([]byte(content))
	return hex.EncodeToString(sum[:])[:hashLength] + ".bin.zst"
}

func TestConvert(t *testing.T) {
	out := t.TempDir()
	res, err := Convert(bytes.NewReader(sampleTar(t)), out, Options{})
	if err != nil {
		t.Fatal(err)
	}

	var doc struct {
		FSRoot  []any `json:"fsroot"`
		Version int   `json:"version"`
		Size    int64 `json:"size"`
	}
	data, _ := os.ReadFile(filepath.Join(out, "filesystem.json"))
	if err := json.Unmarshal(data, &doc); err != nil {
		t.Fatal(err)
	}
	if doc.Version != 3 {
		t.Errorf("version = %d", doc.Version)
	}
	// motd and its hard link both count; the empty file, dirs and symlink add nothing
	if want := int64(6 + 6 + 6 + 4); doc.Size != want {
		t.Errorf("size = %d, want %d", doc.Size, want)
	}

	etc := doc.FSRoot[0].([]any)
	if etc[0] != "etc" || int(etc[3].(float64))&0o170000 != sIFDIR {
		t.Fatalf("etc = %v", etc)
	}
	children := map[string][]any{}
	for _, c := range etc[6].([]any) {
		node := c.([]any)
		children[node[0].(string)] = node
	}

	motd := children["motd"]
	if motd[6] != blobName("hello\n") || int(motd[3].(float64))&0o170000 != sIFREG || motd[4] != 1.0 || motd[5] != 2.0 {
		t.Errorf("motd = %v", motd)
	}
	if g := children["greeting"]; g[6] != motd[6] || g[1] != 6.0 {
		t.Errorf("hard link should share motd's blob and size: %v", g)
	}
	if l := children["link"]; l[6] != "motd" || int(l[3].(float64))&0o170000 != sIFLNK {
		t.Errorf("symlink = %v", l)
	}

	// Every blob decompresses to content matching its name, the empty one included
	dec, _ := zstd.NewReader(nil)
	for name, file := range res.Blobs {
		compressed, _ := os.ReadFile(file)
		plain, err := dec.DecodeAll(compressed, nil)
		if err != nil {
			t.Fatalf("%s: %v", name, err)
		}
		if blobName(string(plain)) != name {
			t.Errorf("%s holds content hashing to %s", name, blobName(string(plain)))
		}
	}
	if !strings.Contains(string(data), "file.txt") {
		t.Error("PAX long name missing")
	}
}

func TestWarmPack(t *testing.T) {
	out := t.TempDir()
	res, err := Convert(bytes.NewReader(sampleTar(t)), out, Options{})
	if err != nil {
		t.Fatal(err)
	}

	// /boot is never packed even when read; the pattern adds files that weren't read
	sel := WarmSelection{
		Reads: map[string]bool{blobName("kernel"): true, blobName("hello\n"): true},
		Match: regexp.MustCompile(`file\.txt$`),
	}
	files, _, err := WriteWarmPack(res, sel, out)
	if err != nil {
		t.Fatal(err)
	}
	if files != 2 {
		t.Fatalf("packed %d files, want 2 (motd once despite its hard link, and the deep file)", files)
	}

	pack, _ := os.ReadFile(filepath.Join(out, "warm.pack"))
	size := binary.LittleEndian.Uint32(pack)
	var index [][]any
	if err := json.Unmarshal(pack[4:4+size], &index); err != nil {
		t.Fatal(err)
	}
	total := 4 + int(size)
	for _, item := range index {
		total += int(item[2].(float64))
	}
	if index[0][0] != blobName("hello\n") || total != len(pack) {
		t.Errorf("index %v doesn't describe a %d-byte pack", index, len(pack))
	}
}

func TestReport(t *testing.T) {
	out := t.TempDir()
	res, err := Convert(bytes.NewReader(sampleTar(t)), out, Options{})
	if err != nil {
		t.Fatal(err)
	}

	reads := &Reads{
		Boot:     []string{blobName("kernel"), blobName("hello\n")},
		Exercise: map[string][]string{"cat": {blobName("hello\n"), blobName("")}},
	}
	size := func(string) int64 { return 10 }
	r := BuildReport(res, reads, []string{"cat"}, regexp.MustCompile(`file\.txt$`), size)

	// /boot is excluded; a file counts in the first phase that read it
	if r.Boot.Files != 1 || r.Boot.Groups[0].Dir != "/etc" {
		t.Errorf("boot = %+v", r.Boot)
	}
	if e := r.Exercise["cat"]; e.Files != 1 || e.Bytes != 10 {
		t.Errorf("exercise should only count the empty file it was first to read: %+v", e)
	}
	if r.Pattern.Files != 1 || r.Cold.Files != 0 {
		t.Errorf("pattern = %+v, cold = %+v", r.Pattern, r.Cold)
	}
}

// A tar with one large file and a hard link to it
func bigTar(t *testing.T, big []byte) []byte {
	t.Helper()
	var buf bytes.Buffer
	tw := tar.NewWriter(&buf)
	for _, h := range []*tar.Header{
		{Name: "data/", Typeflag: tar.TypeDir, Mode: 0o755},
		{Name: "data/big.bin", Typeflag: tar.TypeReg, Mode: 0o644, Size: int64(len(big))},
		{Name: "data/same.bin", Typeflag: tar.TypeLink, Linkname: "data/big.bin", Mode: 0o644},
	} {
		h.ModTime = time.Unix(1700000000, 0)
		if err := tw.WriteHeader(h); err != nil {
			t.Fatal(err)
		}
		if h.Typeflag == tar.TypeReg {
			tw.Write(big)
		}
	}
	tw.Close()
	return buf.Bytes()
}

func TestConvertChunks(t *testing.T) {
	big := counterData(5 << 20)
	out := t.TempDir()
	res, err := Convert(bytes.NewReader(bigTar(t, big)), out, Options{})
	if err != nil {
		t.Fatal(err)
	}
	data, _ := os.ReadFile(filepath.Join(out, "filesystem.json"))
	refs, err := ListBlobs(data)
	if err != nil {
		t.Fatal(err)
	}
	parts := chunks(big)
	if len(parts) < 2 || len(refs) != len(parts) {
		t.Fatalf("%d blobs listed for %d chunks", len(refs), len(parts))
	}

	var doc struct {
		FSRoot []any `json:"fsroot"`
	}
	json.Unmarshal(data, &doc)
	dir := doc.FSRoot[0].([]any)[6].([]any)
	bigNode, linkNode := dir[0].([]any), dir[1].([]any)
	target, ok := bigNode[6].([]any)
	if !ok || len(target) != len(parts) || bigNode[1] != float64(len(big)) {
		t.Fatalf("big.bin = %v", bigNode[:6])
	}
	if !slices.Equal(ends(parts), func() (e []int) {
		total := 0
		for _, c := range target {
			total += int(c.([]any)[1].(float64))
			e = append(e, total)
		}
		return
	}()) {
		t.Error("chunk lengths don't follow the cut points")
	}
	link, _ := json.Marshal(linkNode[6])
	own, _ := json.Marshal(bigNode[6])
	if string(link) != string(own) {
		t.Error("the hard link should share big.bin's chunks")
	}

	// The chunks decompress, in order, to the file; one File per chunk and per path
	dec, _ := zstd.NewReader(nil)
	var whole []byte
	for i, c := range target {
		name := c.([]any)[0].(string)
		compressed, err := os.ReadFile(res.Blobs[name])
		if err != nil {
			t.Fatal(err)
		}
		plain, err := dec.DecodeAll(compressed, nil)
		if err != nil || blobName(string(plain)) != name || !bytes.Equal(plain, parts[i]) {
			t.Fatalf("chunk %d (%s) is wrong: %v", i, name, err)
		}
		whole = append(whole, plain...)
	}
	if !bytes.Equal(whole, big) {
		t.Error("chunks don't add up to the file")
	}
	if len(res.Files) != 2*len(parts) || res.TotalSize != 2*int64(len(big)) {
		t.Errorf("%d files, %d bytes", len(res.Files), res.TotalSize)
	}

	// --no-chunks: one blob, the old format
	out = t.TempDir()
	if _, err := Convert(bytes.NewReader(bigTar(t, big)), out, Options{NoChunks: true}); err != nil {
		t.Fatal(err)
	}
	data, _ = os.ReadFile(filepath.Join(out, "filesystem.json"))
	json.Unmarshal(data, &doc)
	if got := doc.FSRoot[0].([]any)[6].([]any)[0].([]any)[6]; got != blobName(string(big)) {
		t.Errorf("with NoChunks, big.bin = %v", got)
	}
}

// A file just under the threshold stays one blob
func TestConvertSmallFileUnchunked(t *testing.T) {
	small := counterData(ChunkThreshold - 1)
	out := t.TempDir()
	if _, err := Convert(bytes.NewReader(bigTar(t, small)), out, Options{}); err != nil {
		t.Fatal(err)
	}
	data, _ := os.ReadFile(filepath.Join(out, "filesystem.json"))
	if refs, _ := ListBlobs(data); len(refs) != 1 || refs[0].Name != blobName(string(small)) {
		t.Errorf("blobs = %v", refs)
	}
}
