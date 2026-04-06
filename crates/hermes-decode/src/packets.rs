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

        let mut payload: &[u8] = &tm.payload;
        while payload.len() > 0 {
            match mdb.deserialize(payload) {
                Ok(packet) => {
                    payload = &payload[packet.raw.len()..];
                    match out.send(packet) {
                        Ok(_) => {}
                        Err(_) => return Ok(()),
                    }
                }
                Err(hermes_data::Error::Eos) => {
                    // Not a problem
                    break;
                }
                Err(hermes_data::Error::NotAPacket(len)) => {
                    // Idle data
                    payload = &payload[len..];
                }
                Err(err) => {
                    warn!("Failed to deserialize packet: {}", err);
                }
            }
        }
    }

    Ok(())
}
