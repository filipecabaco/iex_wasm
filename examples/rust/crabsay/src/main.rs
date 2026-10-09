//! cowsay, but it's a crab. Compiled for 32-bit x86 Linux and running in your browser tab.

use std::env;
use std::io::{self, Read};

fn main() {
    let args: Vec<String> = env::args().skip(1).collect();
    let message = if args.is_empty() {
        let mut input = String::new();
        io::stdin().read_to_string(&mut input).ok();
        input.trim().to_string()
    } else {
        args.join(" ")
    };
    let message = if message.is_empty() { "Hello from Rust!".to_string() } else { message };

    let lines: Vec<&str> = message.lines().collect();
    let width = lines.iter().map(|l| l.chars().count()).max().unwrap_or(0);

    println!(" {}", "_".repeat(width + 2));
    for (i, line) in lines.iter().enumerate() {
        let (open, close) = match (lines.len(), i) {
            (1, _) => ('<', '>'),
            (_, 0) => ('/', '\\'),
            (n, i) if i == n - 1 => ('\\', '/'),
            _ => ('|', '|'),
        };
        println!("{open} {line:width$} {close}");
    }
    println!(" {}", "-".repeat(width + 2));
    println!(
        r"        \
         \   _~^~^~_
          \) /  o o  \ (/
            '_   -   _'
            / '-----' \"
    );
}
