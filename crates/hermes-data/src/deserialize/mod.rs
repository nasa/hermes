mod container;
mod context;
mod deserialize;
mod expr;

pub(crate) use context::*;

use crate::bit_vec::BitVec;
use crate::{MissionDatabase, Parameter, SequenceContainerType, Value};
use std::collections::HashMap;
use std::sync::Arc;
use std::time::Instant;

#[derive(Clone, Debug)]
pub struct ParameterValue {
    /// The raw value directly from the packet (DN)
    pub raw_value: Value,
    /// The value after calibration has been applied (EU)
    pub calibrated_value: Option<f64>,
    /// The parameter this value refers to
    pub parameter: Arc<Parameter>,
    /// The first bit this value resides in the packet
    pub start_bit: usize,
    /// The last bit this value resides in the packet
    pub end_bit: usize,
}

#[derive(Clone, Debug)]
pub struct SequenceContainer {
    /// The first bit of this container in the packet
    pub start_bit: usize,
    /// The last bit of this container in the packet
    pub end_bit: usize,
    /// The container definition this container instantiates
    pub container: Arc<SequenceContainerType>,
    /// The set of varies extracted from this region in the packet
    pub entries: Vec<Entry>,
}

#[derive(Clone, Debug)]
pub enum Entry {
    Container(Arc<SequenceContainer>),
    Parameter(Arc<ParameterValue>),
}

pub struct Packet {
    /// Name of the instantiated container
    pub name: String,
    /// Raw packet data
    pub raw: Vec<u8>,
    /// Instantiated containers during parameter extraction
    pub root: Arc<SequenceContainer>,
    /// Extracted parameters from the packet
    pub parameters: HashMap<String, Vec<Arc<ParameterValue>>>,
    /// Earth receive time
    pub ert: Instant,
}

impl MissionDatabase {
    pub fn deserialize(&self, data: Vec<u8>) -> crate::Result<Packet> {
        let now = Instant::now();
        let root = &self.telemetry_root;

        let bv = BitVec::from_bytes(&data);

        let mut ctx = Context::new(&self, bv);
        ctx.start_container_entry();
        root.deserialize(&mut ctx)?;
        ctx.finish_container_entry(vec![], self.telemetry_root.clone());

        // FIXME(tumbar) This is not very clean, fix it up
        let mut packet = ctx.finish(now);
        packet.raw = data;
        Ok(packet)
    }
}
