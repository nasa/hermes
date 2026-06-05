use clap::Parser;
use hermes_fprime_dictionary::parse_fprime_json_dictionary;
use prost::Message;
use std::fs;
use std::io::{self, Write};
use std::path::PathBuf;
use std::process;

/// Load an FPrime (JSON) dictionary and convert it to Hermes protobuf format
///
/// Usage:
///   hermes-fprime-dictionary dict.json > out.pb
///   hermes-fprime-dictionary dict.json --json > out.json
#[derive(Parser, Debug)]
#[command(name = "hermes-fprime-dictionary")]
#[command(about, long_about = None)]
struct Args {
    /// Path to the FPrime JSON dictionary file
    dictionary: PathBuf,
}

fn main() {
    if let Err(e) = run() {
        eprintln!("Error: {}", e);
        process::exit(1);
    }
}

fn run() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    // Read the dictionary file
    let json_content = fs::read_to_string(&args.dictionary)?;

    // Parse the FPrime JSON dictionary
    let dictionary = parse_fprime_json_dictionary(&json_content)?;

    // Encode to protobuf
    let mut buf = Vec::new();
    dictionary.encode(&mut buf)?;

    // Write to stdout
    io::stdout().write_all(&buf)?;

    Ok(())
}
