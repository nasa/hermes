use anyhow::{anyhow, Result};
use std::io::Read;
use tracing::{debug, info};

#[derive(Debug, Clone, Copy)]
pub enum Link {
    Stdin,
    Udp(u16),
}

pub trait LinkHandle {
    fn read(&mut self) -> Result<Option<Vec<u8>>>;
}

struct StdinHandle(std::io::Stdin);

impl LinkHandle for StdinHandle {
    fn read(&mut self) -> Result<Option<Vec<u8>>> {
        let mut size: [u8; 4] = [0; 4];

        match self.0.read_exact(&mut size) {
            Ok(_) => {}
            Err(err) if err.kind() == std::io::ErrorKind::UnexpectedEof => return Ok(None),
            Err(err) => return Err(anyhow!("Failed to read from stdin: {}", err)),
        }

        let size = u32::from_be_bytes(size);
        let mut data = vec![0; size as usize];

        match self.0.read_exact(data.as_mut_slice()) {
            Ok(_) => {}
            Err(err) => return Err(anyhow!("Failed to read from stdin: {}", err)),
        }

        Ok(Some(data))
    }
}

struct UdpHandle {
    socket: std::net::UdpSocket,
    buf: [u8; 65536],
}

impl LinkHandle for UdpHandle {
    fn read(&mut self) -> Result<Option<Vec<u8>>> {
        let (amt, src) = self.socket.recv_from(&mut self.buf)?;
        debug!("Received {} bytes from {}", amt, src);
        Ok(Some(self.buf[0..amt].to_vec()))
    }
}

impl Link {
    pub fn start(&self) -> Result<Box<dyn LinkHandle>> {
        match self {
            Link::Stdin => {
                info!("Reading packets from stdin");
                Ok(Box::new(StdinHandle(std::io::stdin())))
            }
            Link::Udp(port) => {
                info!(port = %port, "Reading packets from UDP");
                Ok(Box::new(UdpHandle {
                    socket: std::net::UdpSocket::bind(("0.0.0.0", *port))?,
                    buf: [0; 65536],
                }))
            }
        }
    }
}
