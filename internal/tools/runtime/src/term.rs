//! The local terminal: raw mode and its size.

use std::sync::Mutex;

static SAVED: Mutex<Option<libc::termios>> = Mutex::new(None);

pub fn is_tty(fd: i32) -> bool {
    unsafe { libc::isatty(fd) == 1 }
}

/// Put stdin in raw mode (restored by `restore`).
pub fn raw() {
    unsafe {
        let mut t: libc::termios = std::mem::zeroed();
        if libc::tcgetattr(0, &mut t) != 0 {
            return;
        }
        SAVED.lock().unwrap().get_or_insert(t);
        libc::cfmakeraw(&mut t);
        libc::tcsetattr(0, libc::TCSANOW, &t);
    }
}

pub fn restore() {
    if let Some(t) = SAVED.lock().unwrap().take() {
        unsafe {
            libc::tcsetattr(0, libc::TCSANOW, &t);
        }
    }
}

/// (columns, rows) of the terminal on stdout, if it is one.
pub fn size() -> Option<(u16, u16)> {
    unsafe {
        let mut ws: libc::winsize = std::mem::zeroed();
        if libc::ioctl(1, libc::TIOCGWINSZ, &mut ws) == 0 && ws.ws_col > 0 && ws.ws_row > 0 {
            Some((ws.ws_col, ws.ws_row))
        } else {
            None
        }
    }
}
