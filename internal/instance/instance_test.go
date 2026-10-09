package instance

import "testing"

func TestParsePort(t *testing.T) {
	for spec, want := range map[string]Port{
		"8000":              {"127.0.0.1", 8000, 8000},
		"8080:4000":         {"127.0.0.1", 8080, 4000},
		"0.0.0.0:8080:4000": {"0.0.0.0", 8080, 4000},
	} {
		got, err := ParsePort(spec)
		if err != nil || got != want {
			t.Errorf("%s: got %+v, %v", spec, got, err)
		}
	}
	for _, bad := range []string{"", "x", "70000", "1:2:3:4", "8000:"} {
		if _, err := ParsePort(bad); err == nil {
			t.Errorf("%q should be rejected", bad)
		}
	}
}
