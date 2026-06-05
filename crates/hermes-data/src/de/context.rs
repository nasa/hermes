use crate::de::{BitVec, Entry, Packet, ParameterValue, SequenceContainer, SequenceContainerType};
use crate::{
    ByteOrder, Error, MissionDatabase, Parameter, ParameterInstanceRef, ParameterRef, Result,
    Value, VariableSize,
};

use std::collections::HashMap;
use std::sync::Arc;
use std::time::Instant;

pub(crate) struct Context<'a> {
    pub db: &'a MissionDatabase,
    data: BitVec<'a>,
    position: usize,
    packet_name: Option<String>,
    parameters: HashMap<String, Vec<Arc<ParameterValue>>>,
    entry_start: Vec<usize>,
    entries: Vec<Entry>,
}

impl<'a> Context<'a> {
    pub(crate) fn new(db: &'a MissionDatabase, data: BitVec<'a>) -> Self {
        Context {
            db,
            data,
            position: 0,
            packet_name: None,
            parameters: Default::default(),
            entry_start: vec![0],
            entries: vec![],
        }
    }

    pub(crate) fn finish(mut self, ert: Instant) -> Result<Packet> {
        assert_eq!(self.entries.len(), 1);

        let root = match self.entries.pop().unwrap() {
            Entry::Container(c) => c,
            Entry::Parameter(_) => panic!("Root entry should be a container"),
        };

        let len = if root.end_bit % 8 == 0 {
            root.end_bit / 8
        } else {
            root.end_bit / 8 + 1
        };

        match self.packet_name {
            None => Err(Error::NotAPacket(len)),
            Some(name) => Ok(Packet {
                name,
                raw: self.data.read(0, len),
                parameters: self.parameters,
                root,
                ert,
            }),
        }
    }

    pub(crate) fn start_parameter_entry(&mut self) {
        self.entry_start.push(self.position);
    }

    pub(crate) fn finish_parameter_entry(
        &mut self,
        raw_value: Value,
        calibrated_value: Option<f64>,
        parameter: Arc<Parameter>,
    ) {
        let start_bit = self.entry_start.pop().unwrap();
        let end_bit = self.position;

        let prm = Arc::new(ParameterValue {
            raw_value,
            calibrated_value,
            parameter,
            start_bit,
            end_bit,
        });

        // Store parameters by their fully qualified name
        let qualified_name = prm.parameter.head.qualified_name.clone();

        match self.parameters.get_mut(&qualified_name) {
            Some(pvl) => {
                pvl.push(prm.clone());
            }
            None => {
                self.parameters.insert(qualified_name, vec![prm.clone()]);
            }
        }

        self.entries.push(Entry::Parameter(prm));
    }

    pub(crate) fn start_container_entry(&mut self) -> Vec<Entry> {
        self.entry_start.push(self.position);
        std::mem::take(&mut self.entries)
    }

    pub(crate) fn finish_container_entry(
        &mut self,
        parent: Vec<Entry>,
        container: Arc<SequenceContainerType>,
    ) {
        let entries = std::mem::replace(&mut self.entries, parent);
        let start_bit = self.entry_start.pop().unwrap();
        let end_bit = self.position;

        if !container.abstract_ {
            self.packet_name = Some(container.head.name.clone());
        }

        self.entries
            .push(Entry::Container(Arc::new(SequenceContainer {
                start_bit,
                end_bit,
                container,
                entries,
            })));
    }

    pub(crate) fn get_position(&self) -> usize {
        self.position
    }

    pub(crate) fn set_position(&mut self, position: usize) {
        self.position = position;
    }

    pub(crate) fn get_bits(&mut self, num_bits: usize, order: ByteOrder) -> Result<u64> {
        assert!(num_bits <= 64, "Invalid bit count {}", num_bits);

        let end_pos = self.position + num_bits;

        if (end_pos % 8 == 0) && (end_pos / 8) > self.data.len() {
            Err(Error::Eos)
        } else if (end_pos % 8 > 0) && (end_pos / 8) >= self.data.len() {
            Err(Error::Eos)
        } else {
            let r = self.data.get(self.position, num_bits, order);
            self.position += num_bits;
            Ok(r)
        }
    }

    pub(crate) fn get_data(&mut self, num_bytes: usize) -> Vec<u8> {
        let r = self.data.read(self.position, num_bytes);
        self.position += num_bytes * 8;
        r
    }

    pub(crate) fn get_parameter_value(&self, r: &ParameterRef) -> Result<&ParameterValue> {
        // r.name should already be a fully qualified name after loading
        match self.parameters.get(&r.name) {
            None => Err(Error::ParameterNotFound(r.name.to_string())),
            Some(v) => Ok(v.first().unwrap()),
        }
    }

    pub(crate) fn get_parameter_instance(&self, r: &ParameterInstanceRef) -> Result<Value> {
        let param_value = self.get_parameter_value(&r.parameter)?;

        // If there's a member path, navigate to the member value
        if let Some(ref member_path) = r.parameter.member_path {
            let mut current_value = &param_value.raw_value;

            for member_name in member_path {
                match current_value {
                    Value::Aggregate(agg) => {
                        current_value = agg.get(member_name).ok_or_else(|| {
                            Error::InvalidXtce(format!(
                                "Member '{}' not found in aggregate",
                                member_name
                            ))
                        })?;
                    }
                    _ => {
                        return Err(Error::InvalidXtce(format!(
                            "Cannot access member '{}' on non-aggregate value",
                            member_name
                        )));
                    }
                }
            }

            Ok(current_value.clone())
        } else if r.use_calibrated_value {
            // Return calibrated value if requested and available
            if let Some(cv) = param_value.calibrated_value {
                Ok(Value::Float(cv))
            } else {
                Ok(param_value.raw_value.clone())
            }
        } else {
            Ok(param_value.raw_value.clone())
        }
    }

    pub(crate) fn get_parameter_instance_num(&self, r: &ParameterInstanceRef) -> Result<f64> {
        let value = self.get_parameter_instance(&r)?;
        match &value {
            Value::UnsignedInteger(v) => Ok(*v as f64),
            Value::SignedInteger(v) => Ok(*v as f64),
            Value::Float(v) => Ok(*v),
            v => Err(Error::InvalidValue(format!(
                "Expected numeric value, got {}",
                v
            ))),
        }
    }

    pub(crate) fn read_variable_size(&mut self, r: &VariableSize) -> Result<Vec<u8>> {
        match r {
            VariableSize::Fixed(size) => Ok(self.get_data(*size)),
            VariableSize::DynamicParameterRef(ref_) => {
                Ok(self.get_data(self.get_parameter_instance_num(ref_)? as usize))
            }
            VariableSize::LeadingSize {
                kind,
                max_size_in_bits,
            } => {
                let size = match kind.deserialize(self)? {
                    Value::UnsignedInteger(size) => size,
                    r => return Err(Error::InvalidValue(format!("Invalid leading size {}", r))),
                };
                let size = size as usize;
                if (size * 8) > *max_size_in_bits {
                    Ok(self.get_data(*max_size_in_bits / 8))
                } else {
                    Ok(self.get_data(size))
                }
            }
            VariableSize::TerminationChar {
                chr,
                max_size_in_bits,
            } => {
                let mut o = vec![];
                loop {
                    if o.len() * 8 >= *max_size_in_bits {
                        break;
                    }

                    let c = self.get_bits(8, ByteOrder::BigEndian)? as u8;
                    if c == *chr {
                        break;
                    } else {
                        o.push(c);
                    }
                }

                Ok(o)
            }
        }
    }
}
