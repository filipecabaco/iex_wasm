//! The machine a site runs on, and what it is doing (for "is it quiet yet?").

use std::collections::{BTreeSet, HashSet};
use std::path::{Path, PathBuf};
use std::sync::{Arc, Condvar, Mutex};
use std::time::{Duration, Instant};

use armless::dev::{DeviceConfig, Event};
use armless::native::{HostOptions, NativeHost};
use armless::platform::{Clock, NativePlatform};
use armless::vm::{Config, Vm};

/// The guest's kernel command line: the root filesystem is the 9p device.
pub const CMDLINE: &str = "rw root=host9p rootfstype=9p rootflags=trans=virtio,cache=loose \
                           modules=virtio_pci console=ttyS0 init_on_free=on";

/// Everything here must match between the snapshot and every restore of it.
pub struct Spec {
    pub memory_mb: usize,
    pub cpus: usize,
    /// "none" or "fetch"
    pub network: String,
}

pub fn new_vm(spec: &Spec, system: &Path) -> Result<(Vm<NativePlatform>, Arc<Clock>), String> {
    let config = Config {
        memory_size: spec.memory_mb << 20,
        cpus: spec.cpus,
        devices: DeviceConfig {
            console: true,
            fs_tag: Some("host9p".into()),
            net: spec.network == "fetch",
            ..Default::default()
        },
    };
    let (vm, clock) = armless::runner::new_vm(config)?;
    let json = std::fs::read(system.join("filesystem.json")).map_err(|e| format!("filesystem.json: {e}"))?;
    vm.board.load_filesystem(&json)?;
    Ok((vm, clock))
}

/// The console's output so far (the last MiB of it) and offsets into the whole stream.
#[derive(Default)]
pub struct Screen {
    pub buf: Vec<u8>,
    /// Bytes dropped from the front of `buf`
    pub dropped: usize,
}

impl Screen {
    pub fn total(&self) -> usize {
        self.dropped + self.buf.len()
    }
    /// Everything printed since stream offset `from`.
    pub fn since(&self, from: usize) -> &[u8] {
        &self.buf[from.saturating_sub(self.dropped).min(self.buf.len())..]
    }
}

type Watcher = Box<dyn FnMut(&[u8]) -> bool + Send>;

/// What the machine has been doing, as seen from its events.
pub struct Activity {
    pub screen: Mutex<Screen>,
    pub screen_cv: Condvar,
    pub serial: Mutex<Vec<u8>>,
    pub last: Mutex<Instant>,
    /// When the console last printed (None: never)
    pub last_console: Mutex<Option<Instant>>,
    /// TCP connections open between the guest and the outside
    connections: Mutex<HashSet<u32>>,
    /// Files fetched in the current phase, when recording
    pub reads: Mutex<Option<BTreeSet<String>>>,
    watchers: Mutex<Vec<Watcher>>,
    pub echo_serial: bool,
}

const SCREEN_MAX: usize = 1 << 20;

impl Activity {
    pub fn new(echo_serial: bool) -> Arc<Activity> {
        Arc::new(Activity {
            screen: Mutex::default(),
            screen_cv: Condvar::new(),
            serial: Mutex::default(),
            last: Mutex::new(Instant::now()),
            last_console: Mutex::new(None),
            connections: Mutex::default(),
            reads: Mutex::new(None),
            watchers: Mutex::default(),
            echo_serial,
        })
    }

    /// Whether the guest has TCP connections open.
    pub fn connected(&self) -> bool {
        !self.connections.lock().unwrap().is_empty()
    }

    pub fn touch(&self) {
        *self.last.lock().unwrap() = Instant::now();
    }

    pub fn idle_for(&self) -> Duration {
        self.last.lock().unwrap().elapsed()
    }

    /// Called with every console chunk until it returns false.
    pub fn watch(&self, w: Watcher) {
        self.watchers.lock().unwrap().push(w);
    }

    pub fn observe(self: &Arc<Self>, e: &Event) {
        match e {
            Event::Console(b) => {
                {
                    let mut s = self.screen.lock().unwrap();
                    s.buf.extend_from_slice(b);
                    if s.buf.len() > SCREEN_MAX * 2 {
                        let cut = s.buf.len() - SCREEN_MAX;
                        s.buf.drain(..cut);
                        s.dropped += cut;
                    }
                }
                self.screen_cv.notify_all();
                self.touch();
                *self.last_console.lock().unwrap() = Some(Instant::now());
                self.watchers.lock().unwrap().retain_mut(|w| w(b));
            },
            Event::Serial(b) => {
                if self.echo_serial {
                    use std::io::Write;
                    let mut out = std::io::stdout();
                    let _ = out.write_all(b);
                    let _ = out.flush();
                }
                self.serial.lock().unwrap().extend_from_slice(b);
                self.screen_cv.notify_all();
            },
            Event::Blob(name) => {
                if let Some(r) = self.reads.lock().unwrap().as_mut() {
                    r.insert(name.clone());
                }
                self.touch();
            },
            Event::TcpOpen { id, .. } | Event::TcpConnected { id } => {
                self.connections.lock().unwrap().insert(*id);
                self.touch();
            },
            Event::TcpClosed { id } => {
                self.connections.lock().unwrap().remove(id);
                self.touch();
            },
            Event::TcpData { .. } | Event::TcpEof { .. } => self.touch(),
        }
    }

    /// Wait until `test` passes on the serial output (or the timeout).
    pub fn wait_serial(&self, timeout: Duration, test: impl Fn(&[u8]) -> bool) -> bool {
        let deadline = Instant::now() + timeout;
        let mut s = self.screen.lock().unwrap();
        loop {
            if test(&self.serial.lock().unwrap()) {
                return true;
            }
            let left = deadline.saturating_duration_since(Instant::now());
            if left.is_zero() {
                return false;
            }
            s = self.screen_cv.wait_timeout(s, left.min(Duration::from_millis(200))).unwrap().0;
        }
    }
}

/// The host side of the machine: blobs from `blobs`, the network if the site has one.
pub fn host(board: &Arc<armless::Board>, blobs: PathBuf, network: &str, activity: &Arc<Activity>) -> NativeHost {
    let a = activity.clone();
    NativeHost::spawn(
        board.clone(),
        HostOptions {
            blobs: Some(blobs),
            nat: network == "fetch",
        },
        Box::new(move |e| a.observe(e)),
    )
}
