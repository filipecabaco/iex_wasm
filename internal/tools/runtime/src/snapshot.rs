//! `snowglobe-vm snapshot`: boot the site's filesystem until the app is up on the virtio
//! console, then save the snapshot the browser restores straight into the running app.
//!
//! Reads <system>/filesystem.json + filesystem/; writes into <system>:
//! - state.bin.zst  the snapshot (zstd)
//! - console.bin    the app's console output so far, which the page replays into the terminal
//! - run-meta.json  boot time and sizes
//! - reads.json     every file the guest fetched while booting, and while running each
//!   --exercise command typed in after the snapshot (with the file cache emptied, as a
//!   visitor's tab starts): what a visitor would otherwise wait on the network for
//! - transcript.json  what each exercise command printed
//!
//! The serial port (ttyS0) carries boot logs and a root shell used for housekeeping; the app
//! runs on the virtio console (hvc0), which the page shows.

use std::collections::{BTreeMap, BTreeSet};
use std::io::Write;
use std::path::PathBuf;
use std::time::{Duration, Instant};

use armless::runner::Runner;
use armless::vm::BootError;
use serde_json::json;

use crate::machine::{self, Activity, Spec};
use crate::text;
use crate::Args;

const TIMEOUT: Duration = Duration::from_secs(20 * 60);
/// Without --ready, the app counts as ready once its console has been quiet this long.
const QUIET: Duration = Duration::from_secs(5);
/// An exercise command is done once the guest has neither printed nor fetched a file for this
/// long (or after the cap): a runtime can go quiet while it loads modules.
const EXERCISE_QUIET: Duration = Duration::from_millis(2500);
const EXERCISE_CAP: Duration = Duration::from_secs(180);
/// The console size the app starts with: fits an embedded panel or a small window, so
/// screens drawn at startup (and replayed from the snapshot) don't wrap apart.
const COLS: u16 = 90;
const ROWS: u16 = 30;

pub fn main(args: &Args) -> Result<u8, String> {
    let system = PathBuf::from(args.positional.first().ok_or("snapshot needs the system directory")?);
    let spec = Spec {
        memory_mb: args.get("memory").unwrap_or("512").parse().map_err(|_| "--memory: not a number")?,
        cpus: args.get("cpus").unwrap_or("1").parse().map_err(|_| "--cpus: not a number")?,
        network: args.get("network").unwrap_or("none").to_string(),
    };
    let ready = args.get("ready").map(str::to_string);
    let exercises = args.all("exercise");
    let blobs = system.join("filesystem");

    let (mut vm, clock) = machine::new_vm(&spec, &system)?;
    vm.board.console_resize(COLS, ROWS);

    eprintln!("Booting, please stand by ...");
    let started = Instant::now();
    // The kernel and initramfs: read from the filesystem to boot, but never by the guest after
    // a restore, so they are not "boot reads"
    loop {
        match vm.boot_from_fs(machine::CMDLINE) {
            Ok(_) => break,
            Err(BootError::Need(names)) => {
                for n in names {
                    let data = std::fs::read(blobs.join(&n)).map_err(|e| format!("{n}: {e}"))?;
                    vm.board.provide_blob(&n, data)?;
                }
            },
            Err(BootError::Fail(e)) => return Err(e),
        }
    }

    let activity = Activity::new(true);
    *activity.reads.lock().unwrap() = Some(BTreeSet::new());
    let board = vm.board.clone();
    let _host = machine::host(&board, blobs, &spec.network, &activity);
    let mut runner = Runner::new(vm, clock, false);
    runner.start();

    // Up: a root shell on the serial port, and the app on the console
    let mut boot_seconds = 0.0;
    let mut app_ready = false;
    loop {
        if let Some(s) = runner.stopped() {
            return Err(format!("the guest stopped while booting: {s:?}"));
        }
        if started.elapsed() > TIMEOUT {
            return Err(format!("app not ready after {}s", TIMEOUT.as_secs()));
        }
        if !app_ready {
            app_ready = match &ready {
                Some(r) => {
                    let s = activity.screen.lock().unwrap();
                    s.buf.windows(r.len()).any(|w| w == r.as_bytes())
                },
                None => activity.last_console.lock().unwrap().is_some_and(|t| t.elapsed() >= QUIET),
            };
            if app_ready {
                boot_seconds = started.elapsed().as_secs_f64();
                eprintln!("\nApp ready on hvc0 after {boot_seconds:.1}s");
            }
        }
        let shell = activity.serial.lock().unwrap().windows(2).any(|w| w == b"# ");
        if app_ready && shell {
            break;
        }
        std::thread::sleep(Duration::from_millis(100));
    }

    // Drop the page cache so boot-time file contents aren't baked into the snapshot. The marker
    // is computed by the shell, so the echoed command line itself can't match it
    activity.serial.lock().unwrap().clear();
    board.serial_input(b"sync; echo 3 > /proc/sys/vm/drop_caches; echo CACHES_$((40+2))\n");
    if !activity.wait_serial(Duration::from_secs(120), |s| s.windows(9).any(|w| w == b"CACHES_42")) {
        return Err("the guest did not drop its caches".into());
    }
    let boot_reads = activity.reads.lock().unwrap().take().unwrap_or_default();

    let state = runner.save_state();
    eprintln!("\nCompressing {} MB snapshot ...", state.len() >> 20);
    let compressed = compress(&state)?;
    let out = system.join("state.bin.zst");
    std::fs::write(&out, &compressed).map_err(|e| e.to_string())?;
    write_json(
        &system.join("run-meta.json"),
        &json!({ "bootSeconds": boot_seconds, "stateBytes": state.len(), "snapshotBytes": compressed.len() }),
    )?;
    let console = activity.screen.lock().unwrap().buf.clone();
    let replay = text::without_progress_reports(&text::without_queries(text::since_last_clear(&console)));
    std::fs::write(system.join("console.bin"), replay).map_err(|e| e.to_string())?;
    eprintln!("Saved {} ({} MB)", out.display(), compressed.len() >> 20);
    drop(state);

    // Type each command into the app as a visitor would, from a cold file cache, and record what
    // it fetches and prints
    board.forget_blobs();
    let mut exercise_reads = BTreeMap::new();
    let mut transcript = Vec::new();
    for command in &exercises {
        *activity.reads.lock().unwrap() = Some(BTreeSet::new());
        let begun = Instant::now();
        let from = activity.screen.lock().unwrap().total();
        eprint!("\nExercising: {command}");
        board.console_input(format!("{command}\r").as_bytes());
        activity.touch();
        while (activity.idle_for() < EXERCISE_QUIET
            || activity.connected())
            && begun.elapsed() < EXERCISE_CAP
        {
            std::thread::sleep(Duration::from_millis(250));
        }
        let reads = activity.reads.lock().unwrap().take().unwrap_or_default();
        eprint!(" ({} files, {:.1}s)", reads.len(), begun.elapsed().as_secs_f64());
        let output = String::from_utf8_lossy(activity.screen.lock().unwrap().since(from)).into_owned();
        transcript.push(json!({ "command": command, "output": output }));
        exercise_reads.insert(command.clone(), reads.into_iter().collect::<Vec<_>>());
    }
    if !exercises.is_empty() {
        eprintln!();
    }
    write_json(
        &system.join("reads.json"),
        &json!({ "boot": boot_reads.into_iter().collect::<Vec<_>>(), "exercise": exercise_reads }),
    )?;
    write_json(&system.join("transcript.json"), &serde_json::Value::Array(transcript))?;
    runner.shutdown();
    let _ = std::io::stdout().flush();
    Ok(0)
}

fn compress(data: &[u8]) -> Result<Vec<u8>, String> {
    let mut e = zstd::stream::Encoder::new(Vec::with_capacity(data.len() / 4), 19).map_err(|e| e.to_string())?;
    let threads = std::thread::available_parallelism().map_or(1, |n| n.get()) as u32;
    e.multithread(threads).map_err(|e| e.to_string())?;
    e.include_contentsize(true).map_err(|e| e.to_string())?;
    e.set_pledged_src_size(Some(data.len() as u64)).map_err(|e| e.to_string())?;
    e.write_all(data).map_err(|e| e.to_string())?;
    e.finish().map_err(|e| e.to_string())
}

fn write_json(path: &std::path::Path, v: &serde_json::Value) -> Result<(), String> {
    std::fs::write(path, serde_json::to_vec(v).unwrap()).map_err(|e| format!("{}: {e}", path.display()))
}
