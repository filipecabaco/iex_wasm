//! Terminal output clean-ups (the same ones the page and the CLI rely on).

use std::sync::LazyLock;

use regex::bytes::Regex;

static CONTROL: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"\x1b\[[0-9;?]*[ -/]*[@-~]|\x1b[()][0-9A-Za-z]|\x1b[=>]|\r").unwrap());
static QUERIES: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"\x1b\[[0-9]*n|\x1b\[[>=]?[0-9]*c").unwrap());
static PROGRESS: LazyLock<Regex> = LazyLock::new(|| Regex::new(r"(?s)=PROGRESS REPORT====.*?\r?\n\r?\n").unwrap());

/// Text without terminal control sequences, for a pipe or a comparison.
pub fn plain(b: &[u8]) -> Vec<u8> {
    CONTROL.replace_all(b, &b""[..]).into_owned()
}

/// Terminal queries (cursor position, device attributes) were asked of a terminal that no longer
/// exists; replayed, xterm.js would answer them and the answer would reach the app as typed input.
pub fn without_queries(b: &[u8]) -> Vec<u8> {
    QUERIES.replace_all(b, &b""[..]).into_owned()
}

/// On the slow emulated boot, an OTP "application started" progress report can slip out before
/// Elixir's Logger installs the filter that normally hides it. It's noise on the replayed screen.
pub fn without_progress_reports(b: &[u8]) -> Vec<u8> {
    PROGRESS.replace_all(b, &b""[..]).into_owned()
}

fn rfind(hay: &[u8], needle: &[u8]) -> Option<usize> {
    hay.windows(needle.len()).rposition(|w| w == needle)
}

/// What the terminal shows now: everything after the last "clear screen" sequence.
pub fn since_last_clear(b: &[u8]) -> &[u8] {
    let mut start = 0;
    // ESC[2J is the usual clear; BusyBox's `clear` homes the cursor and erases down instead
    for seq in [&b"\x1b[2J"[..], b"\x1b[H\x1b[J", b"\x1bc"] {
        if let Some(at) = rfind(b, seq) {
            start = start.max(at + seq.len());
        }
    }
    &b[start..]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn cleans() {
        assert_eq!(plain(b"\x1b[1;34mhi\x1b[m\r\n"), b"hi\n");
        assert_eq!(without_queries(b"a\x1b[6nb\x1b[>0cc"), b"abc");
        assert_eq!(since_last_clear(b"old\x1b[2Jnew"), b"new");
        assert_eq!(since_last_clear(b"old\x1b[H\x1b[Jnew"), b"new");
        assert_eq!(
            without_progress_reports(b"a=PROGRESS REPORT==== x\r\n  y\r\n\r\nb"),
            b"ab"
        );
    }
}
