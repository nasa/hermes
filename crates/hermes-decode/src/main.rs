mod link;
mod packets;

use crate::link::Link;
use crate::packets::process_packets;
use clap::{Parser, ValueEnum};
use hermes_data::ParameterValue;
use std::fmt::Display;
use std::fs;
use std::sync::Arc;
use tracing::{error, info};
use tracing_subscriber::{fmt, EnvFilter};

#[derive(Clone, Default, PartialEq, Eq, PartialOrd, Ord, ValueEnum)]
enum LinkArg {
    #[default]
    /// Read packets from stdin whose data is prefixed by big-endian u32 marking it's size
    Stdin,
    /// Read packets from a UDP port
    Udp,
}

#[derive(Parser)]
#[command(name = "hermes-decode")]
#[command(version, about, long_about = None)]
struct Args {
    /// Path to XTCE Specification
    #[arg(short = 'x', long)]
    xtce: String,

    /// Physical link to read packets from
    #[arg(short = 'l', long)]
    link: LinkArg,

    /// UDP port to listen on when using the `--link udp` option
    #[arg(long)]
    udp_port: Option<u16>,
}

fn main() {
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));

    fmt()
        .with_env_filter(env_filter)
        .with_writer(std::io::stderr)
        .init();

    match main_result(&Args::parse()) {
        Ok(_) => {}
        Err(err) => {
            error!("{}", err);
        }
    }
}

struct ParameterValueWrapper<'a>(&'a ParameterValue);
impl<'a> Display for ParameterValueWrapper<'a> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_str(&self.0.parameter.head.qualified_name)?;
        f.write_fmt(format_args!(" raw={}", self.0.raw_value))?;

        if let Some(calibrated_value) = self.0.calibrated_value {
            f.write_fmt(format_args!(", calibrated={}", calibrated_value))?;
        }

        Ok(())
    }
}

impl TryFrom<&Args> for Link {
    type Error = anyhow::Error;

    fn try_from(value: &Args) -> anyhow::Result<Self> {
        match value.link {
            LinkArg::Stdin => Ok(Link::Stdin),
            LinkArg::Udp => match value.udp_port {
                None => Err(anyhow::anyhow!("No UDP port specified")),
                Some(p) => Ok(Link::Udp(p)),
            },
        }
    }
}

fn main_result(args: &Args) -> anyhow::Result<()> {
    info!(xtce_path = %args.xtce, "reading XTCE specification");
    let xtce_raw = fs::read_to_string(&args.xtce)?;
    let link: Link = args.try_into()?;

    let mdb = Arc::new(hermes_data::MissionDatabase::new_from_xtce_str(
        xtce_raw.as_str(),
    )?);

    let mdb_c = mdb.clone();
    let (tx, rx) = std::sync::mpsc::channel();
    let deserialize_thread = std::thread::spawn(move || process_packets(mdb_c.clone(), link, tx));

    for pkt in rx {
        let container_name = pkt.containers.last().unwrap().head.qualified_name.clone();
        info!(name = %container_name, "Packet Received");
        for prms in pkt.parameters.values() {
            for prm in prms {
                eprintln!("{}", ParameterValueWrapper(prm));
            }
        }
    }

    match deserialize_thread.join() {
        Ok(_) => Ok(()),
        Err(err) => Err(anyhow::anyhow!("{:#?}", err)),
    }
}
