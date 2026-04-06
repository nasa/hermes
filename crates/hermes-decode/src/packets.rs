use crate::link::Link;
use anyhow::Result;
use hermes_data::{MissionDatabase, Packet, TmFrame};
use std::sync::{mpsc, Arc};
use tracing::warn;

pub fn process_packets(
    mdb: Arc<MissionDatabase>,
    link: Link,
    out: mpsc::Sender<Packet>,
) -> Result<()> {
    let mut link_handle = link.start()?;

    loop {
        let Some(data) = link_handle.read()? else {
            break;
        };

        let tm = match TmFrame::decode(&data, true) {
            Ok(tm) => tm,
            Err(err) => {
                warn!("Failed to decode tm frame {}", err);
                continue;
            }
        };

        match mdb.deserialize(tm.payload) {
            Ok(packet) => match out.send(packet) {
                Ok(_) => {}
                Err(_) => break,
            },
            Err(err) => {
                warn!("Failed to deserialize packet: {}", err);
            }
        }
    }

    Ok(())
}
