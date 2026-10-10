//! `snowglobe-vm run`: restore a built site headlessly and connect its app console.
//!
//! - On a terminal: raw keys in, the screen out, ctrl-] quits.
//! - Piped: each line of stdin is typed into the app in turn, waiting for it to go quiet, and
//!   what it printed is written out; the run ends after the last one.
//! - Detached: nothing local; clients join over the control socket (`exec`, `attach`).
//!
//! The control socket takes one JSON line, then: {"mode":"exec","command":...} answers with
//! what the command printed; {"mode":"attach","rows":R,"cols":C} replays the screen and
//! streams the session both ways.

use std::io::{BufRead, BufReader, Read, Write};
use std::net::TcpListener;
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use armless::runner::Runner;
use armless::Board;
use serde_json::json;

use crate::machine::{self, Activity, Spec};
use crate::{term, text, Args, SOCKET};

const DETACH_KEY: u8 = 0x1d; // ctrl-]
/// A command is done once the app has neither printed, fetched a file nor had a connection
/// open for this long
const QUIET: Duration = Duration::from_millis(1200);
const COMMAND_CAP: Duration = Duration::from_secs(300);

struct Session {
    board: Arc<Board>,
    activity: Arc<Activity>,
    /// The console output saved with the snapshot
    persisted: Vec<u8>,
    exec_lock: Mutex<()>,
}

impl Session {
    /// What the screen shows now: everything after the last clear.
    fn screen(&self) -> Vec<u8> {
        let mut all = self.persisted.clone();
        all.extend_from_slice(&self.activity.screen.lock().unwrap().buf);
        text::since_last_clear(&all).to_vec()
    }

    fn quiet(&self) {
        let begun = Instant::now();
        while (self.activity.connected() || self.activity.idle_for() < QUIET) && begun.elapsed() < COMMAND_CAP {
            std::thread::sleep(Duration::from_millis(100));
        }
    }

    /// Type one command into the app and return what it printed: the echoed command line and
    /// the prompt left waiting after it are the terminal's, not the command's, so they're cut.
    fn exec(&self, command: &str) -> Vec<u8> {
        let _one_at_a_time = self.exec_lock.lock().unwrap();
        let from = self.activity.screen.lock().unwrap().total();
        self.board
            .console_input(format!("{}\r", command.trim_end_matches('\n')).as_bytes());
        self.activity.touch();
        self.quiet();
        let output = text::without_queries(self.activity.screen.lock().unwrap().since(from));
        let output = String::from_utf8_lossy(&output).into_owned();
        // Line editors echo the command (wrapped at the terminal's width when it is long) and
        // often redraw it with the prompt (IEx, Node): the leading lines that end with the
        // command are that echo
        let mut lines: Vec<&str> = output.split('\n').collect();
        let typed = command.trim();
        loop {
            let mut echoed = String::new();
            let mut cut = 0;
            for (k, line) in lines.iter().enumerate().take(lines.len().saturating_sub(1).min(16)) {
                echoed.push_str(&String::from_utf8_lossy(&text::plain(line.as_bytes())));
                if !typed.is_empty() && echoed.trim_end().ends_with(typed) {
                    cut = k + 1;
                    break;
                }
            }
            if cut == 0 {
                break;
            }
            lines.drain(..cut);
        }
        lines.pop(); // the prompt now waiting for the next command
        if lines.is_empty() {
            Vec::new()
        } else {
            (lines.join("\n") + "\n").into_bytes()
        }
    }
}

pub fn main(args: &Args) -> Result<u8, String> {
    let site = PathBuf::from(args.positional.first().ok_or("run needs a site directory")?);
    let info: serde_json::Value = serde_json::from_slice(
        &std::fs::read(site.join("run.json")).map_err(|_| format!("{} isn't a built snowglobe site", site.display()))?,
    )
    .map_err(|e| format!("run.json: {e}"))?;
    let spec = Spec {
        memory_mb: info["memory_mb"].as_u64().unwrap_or(512) as usize,
        cpus: info["cpus"].as_u64().unwrap_or(1) as usize,
        network: info["network"].as_str().unwrap_or("none").to_string(),
    };
    let title = info["title"].as_str().unwrap_or("snowglobe").to_string();
    let system = site.join("system");
    // A pooled site keeps its blobs in a store shared with its neighbours
    let blobs = if system.join("filesystem").is_dir() {
        system.join("filesystem")
    } else {
        PathBuf::from(args.get("blobs").ok_or("the site has no system/filesystem: pass --blobs")?)
    };

    let started = Instant::now();
    let (vm, clock) = machine::new_vm(&spec, &system)?;
    let board = vm.board.clone();
    let mut runner = Runner::new(vm, clock, false);
    let state = std::fs::File::open(system.join("state.bin.zst")).map_err(|e| format!("state.bin.zst: {e}"))?;
    let mut reader = armless::zstd::reader(std::io::BufReader::with_capacity(1 << 20, state)).map_err(|e| e.to_string())?;
    runner.load_state_from(&mut reader)?;
    drop(reader);

    let activity = Activity::new(false);
    let host = Arc::new(machine::host(&board, blobs, &spec.network, &activity));
    runner.start();

    let session = Arc::new(Session {
        board: board.clone(),
        activity: activity.clone(),
        persisted: std::fs::read(system.join("console.bin")).unwrap_or_default(),
        exec_lock: Mutex::new(()),
    });

    // The control socket: attach and exec from other sessions
    let socket = args.get("socket").unwrap_or(SOCKET).to_string();
    let _ = std::fs::remove_file(&socket);
    let listener = UnixListener::bind(&socket).map_err(|e| format!("{socket}: {e}"))?;
    {
        let session = session.clone();
        std::thread::spawn(move || {
            for stream in listener.incoming().flatten() {
                let session = session.clone();
                std::thread::spawn(move || serve(&session, stream));
            }
        });
    }

    // Port forwarding: host -> container -> guest. Each connection becomes a TCP connection from
    // the guest's router to the guest port, through the same network the guest's own requests use
    for spec in args.all("forward") {
        let (listen, guest) = spec
            .split_once(':')
            .and_then(|(l, g)| Some((l.parse::<u16>().ok()?, g.parse::<u16>().ok()?)))
            .ok_or_else(|| format!("--forward {spec}: use PORT:GUEST_PORT"))?;
        let l = TcpListener::bind(("0.0.0.0", listen)).map_err(|e| format!("port {listen}: {e}"))?;
        let host = host.clone();
        std::thread::spawn(move || {
            for stream in l.incoming().flatten() {
                host.forward(stream, guest);
            }
        });
    }

    let secs = started.elapsed().as_secs_f64();
    if args.has("detached") {
        println!("restored {title} in {secs:.1}s");
        let _ = std::io::stdout().flush();
        let stopped = runner.wait(None);
        eprintln!("snowglobe: the guest stopped ({stopped:?})");
        return Ok(0);
    }

    if term::is_tty(0) && term::is_tty(1) {
        eprint!("\x1b[2m{title}: restored in {secs:.1}s · ctrl-] quits\x1b[0m\r\n");
        term::raw();
        let mut out = std::io::stdout();
        let _ = out.write_all(&session.screen());
        let _ = out.flush();
        activity.watch(Box::new(|b| {
            let mut out = std::io::stdout();
            out.write_all(b).and_then(|_| out.flush()).is_ok()
        }));
        // Follow the terminal's size
        {
            let board = board.clone();
            std::thread::spawn(move || {
                let mut last = None;
                loop {
                    let size = term::size();
                    if size != last {
                        if let Some((cols, rows)) = size {
                            board.console_resize(cols, rows);
                        }
                        last = size;
                    }
                    std::thread::sleep(Duration::from_millis(250));
                }
            });
        }
        // The guest powering off ends the session
        {
            std::thread::spawn(move || {
                runner.wait(None);
                term::restore();
                std::process::exit(0);
            });
        }
        let mut stdin = std::io::stdin();
        let mut buf = [0u8; 4096];
        loop {
            let n = stdin.read(&mut buf).unwrap_or(0);
            if n == 0 || buf[..n].contains(&DETACH_KEY) {
                break;
            }
            board.console_input(&buf[..n]);
        }
        term::restore();
        return Ok(0);
    }

    // Piped: each line is a command; print what it printed, then end after the last one
    let mut out = std::io::stdout();
    for line in std::io::stdin().lock().lines() {
        let line = line.map_err(|e| e.to_string())?;
        let output = session.exec(&line);
        let _ = out.write_all(&text::plain(&output));
        let _ = out.flush();
    }
    Ok(0)
}

/// One control-socket client.
fn serve(session: &Session, stream: UnixStream) {
    let Ok(writer) = stream.try_clone() else { return };
    let mut reader = BufReader::new(stream);
    let mut header = Vec::new();
    if reader.read_until(b'\n', &mut header).is_err() {
        return;
    }
    let request: serde_json::Value = serde_json::from_slice(&header).unwrap_or(json!({}));
    let mut writer = writer;
    match request["mode"].as_str() {
        Some("exec") => {
            let output = session.exec(request["command"].as_str().unwrap_or(""));
            let _ = writer.write_all(&output);
        },
        Some("attach") => {
            if let (Some(rows), Some(cols)) = (request["rows"].as_u64(), request["cols"].as_u64()) {
                session.board.console_resize(cols as u16, rows as u16);
            }
            if writer.write_all(&session.screen()).is_err() {
                return;
            }
            let closed = Arc::new(AtomicBool::new(false));
            {
                let closed = closed.clone();
                let mut w = writer.try_clone().unwrap();
                session.activity.watch(Box::new(move |b| {
                    !closed.load(Ordering::SeqCst) && w.write_all(b).is_ok()
                }));
            }
            let mut buf = [0u8; 4096];
            loop {
                match reader.read(&mut buf) {
                    Ok(0) | Err(_) => break,
                    Ok(n) => session.board.console_input(&buf[..n]),
                }
            }
            closed.store(true, Ordering::SeqCst);
        },
        _ => {
            let _ = writer.write_all(b"snowglobe: unknown request\n");
        },
    }
    let _ = writer.shutdown(std::net::Shutdown::Both);
}

fn connect(socket: &str) -> Result<UnixStream, String> {
    UnixStream::connect(socket).map_err(|e| format!("can't reach the instance ({e}); is it still restoring?"))
}

/// `exec`: type one command into the app, print what it printed.
pub fn client_exec(socket: &str, command: &str) -> Result<u8, String> {
    let mut s = connect(socket)?;
    s.write_all(format!("{}\n", json!({ "mode": "exec", "command": command })).as_bytes())
        .map_err(|e| e.to_string())?;
    let mut output = Vec::new();
    s.read_to_end(&mut output).map_err(|e| e.to_string())?;
    // Colours for a terminal; plain text for a pipe or an agent reading the output
    let output = if term::is_tty(1) { output } else { text::plain(&output) };
    let mut out = std::io::stdout();
    let _ = out.write_all(&output);
    let _ = out.flush();
    Ok(0)
}

/// `attach`: join the session; ctrl-] detaches and leaves it running.
pub fn client_attach(socket: &str) -> Result<u8, String> {
    let mut s = connect(socket)?;
    let (cols, rows) = term::size().unwrap_or((0, 0));
    s.write_all(format!("{}\n", json!({ "mode": "attach", "rows": rows, "cols": cols })).as_bytes())
        .map_err(|e| e.to_string())?;
    let mut from = s.try_clone().map_err(|e| e.to_string())?;
    std::thread::spawn(move || {
        let mut out = std::io::stdout();
        let mut buf = [0u8; 4096];
        loop {
            match from.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => {
                    let _ = out.write_all(&buf[..n]);
                    let _ = out.flush();
                },
            }
        }
        term::restore();
        std::process::exit(0);
    });
    if term::is_tty(0) {
        term::raw();
    }
    let mut stdin = std::io::stdin();
    let mut buf = [0u8; 4096];
    loop {
        let n = stdin.read(&mut buf).unwrap_or(0);
        if n == 0 {
            break;
        }
        if buf[..n].contains(&DETACH_KEY) {
            term::restore();
            eprint!("\r\nsnowglobe: detached; the instance keeps running\r\n");
            return Ok(0);
        }
        if s.write_all(&buf[..n]).is_err() {
            break;
        }
    }
    term::restore();
    Ok(0)
}
