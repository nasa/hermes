use crate::bit_vec::BitVec;
use crate::*;
use hermes_xtce::{FloatSizeInBitsType, IntegerEncodingType};

#[derive(Clone, Debug)]
pub struct DecodedValue {
    /// The raw value directly from the packet (DN)
    pub raw_value: Value,
    /// The value after calibration has been applied (EU)
    pub calibrated_value: Option<f64>,
    /// The container stack where this value is from
    pub containers: Vec<String>,
    /// The parameter this value refers to
    pub parameter: Rc<Parameter>,
    /// The first bit this value resides in the parent container
    pub start_bit: usize,
    /// The last bit this value resides in the parent container
    pub end_bit: usize,
}

struct Context<'a> {
    db: &'a MissionDatabase,
    data: BitVec<'a>,
    position: usize,
    parameters: HashMap<String, Vec<DecodedValue>>,
}

impl<'a> Context<'a> {
    fn get_bits(&mut self, num_bits: usize, order: ByteOrder) -> u64 {
        assert!(num_bits <= 64, "Invalid bit count {}", num_bits);

        let r = self.data.get(self.position, num_bits, order);
        self.position += num_bits;
        r
    }

    fn get_data(&mut self, num_bytes: usize) -> Vec<u8> {
        let r = self.data.read(self.position, num_bytes);
        self.position += num_bytes * 8;
        r
    }

    fn get_decoded_value(&self, r: &ParameterRef) -> Result<&DecodedValue> {
        match self.parameters.get(&r.0) {
            None => Err(Error::ParameterNotFound(r.0.to_string())),
            Some(v) => Ok(v.first().unwrap()),
        }
    }

    fn get_parameter_instance_num(&self, r: &ParameterInstanceRef) -> Result<f64> {
        let value = self.get_decoded_value(&r.parameter)?;
        if r.use_calibrated_value && let Some(v) = value.calibrated_value {
            Ok(v)
        } else {
            match &value.raw_value {
                Value::UnsignedInteger(v) => Ok(*v as f64),
                Value::SignedInteger(v) => Ok(*v as f64),
                Value::Float(v) => Ok(*v),
                v => Err(Error::InvalidValue(format!("Expected numeric value, got {}", v)))
            }
        }
    }

    fn read_variable_size(&mut self, r: &VariableSize) -> Result<Vec<u8>> {
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
                    r => return Err(Error::InvalidValue(format!("Invalid leading size {}", r)))
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

                    let c = self.get_bits(8, ByteOrder::BigEndian) as u8;
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

impl IntegerValue {
    fn get(&self, ctx: &Context) -> Result<i64> {
        match &self {
            IntegerValue::FixedValue(v) => Ok(*v),
            IntegerValue::DynamicValueParameter {
                ref_,
                linear_adjustment,
            } => {
                let raw = ctx.get_parameter_instance_num(ref_)?;
                match &linear_adjustment.as_ref().map(|la| la.intercept + la.slope * raw) {
                    None => Ok(raw as i64),
                    Some(l) => Ok(*l as i64)
                }
            }
            IntegerValue::DynamicValueArgument { .. } => unreachable!(),
        }
    }
}

impl IntegerType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let r = ctx.get_bits(self.size_in_bits as usize, self.byte_order);
        match (&self.encoding, self.signed) {
            (IntegerEncodingType::Unsigned, _) => Ok(Value::UnsignedInteger(r)),
            (IntegerEncodingType::SignMagnitude, true) => {
                if (r >> (self.size_in_bits - 1) % 2) != 0 {
                    // Negative, remove the sign and return a negative integer
                    Ok(Value::SignedInteger(
                        -((r & !(1u64 << self.size_in_bits)) as i64),
                    ))
                } else {
                    Ok(Value::SignedInteger(r as i64))
                }
            }
            (IntegerEncodingType::TwosComplement, true) => {
                // Shift left then swap to signed to do an arithmetic shift back to the right
                let n = 64 - self.size_in_bits;
                Ok(Value::SignedInteger(((r << n) as i64) >> n))
            }
            (IntegerEncodingType::OnesComplement, true) => {
                if (r >> (self.size_in_bits - 1) % 2) != 0 {
                    let n = 64 - self.size_in_bits;
                    Ok(Value::SignedInteger(-!(((r << n) as i64) >> n)))
                } else {
                    Ok(Value::SignedInteger(r as i64))
                }
            }
            (IntegerEncodingType::Bcd, _) => {
                // 8-bits per decimal
                let mut m = 1;
                let mut rot = r;
                let mut out = 0u64;
                for _ in 0..8 {
                    out = out + (m * (rot & 0xFF));
                    rot >>= 8;
                    m *= 10;
                }

                Ok(Value::UnsignedInteger(out))
            }
            (IntegerEncodingType::PackedBcd, _) => {
                // 4-bits per decimal
                let mut m = 1;
                let mut rot = r;
                let mut out = 0u64;
                for _ in 0..16 {
                    out = out + (m * (rot & 0xF));
                    rot >>= 4;
                    m *= 10;
                }

                Ok(Value::UnsignedInteger(out))
            }
            (_, false) => Ok(Value::UnsignedInteger(r)),
        }
    }
}

impl FloatType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match self.size_in_bits {
            FloatSizeInBitsType::_32 => {
                let raw = ctx.get_bits(32, self.byte_order) as u32;
                let f: f32 = f32::from_bits(raw);
                Ok(Value::Float(f as f64))
            }
            FloatSizeInBitsType::_64 => {
                let raw = ctx.get_bits(64, self.byte_order);
                Ok(Value::Float(f64::from_bits(raw)))
            }
            FloatSizeInBitsType::_128 => {
                // TODO(tumbar) Rust has a nightly feature to represent f128 but it is not standard
                //              on most systems. We will just store these as binary
                Ok(Value::Binary(ctx.get_data(16)))
            }
        }
    }
}

impl StringType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let raw: Vec<u8> = ctx.read_variable_size(&self.size)?;

        match &self.encoding {
            StringEncoding::UsAscii => Ok(Value::String(String::from_utf8_lossy(&raw).to_string())),
            StringEncoding::Utf8 => Ok(Value::String(String::from_utf8_lossy(&raw).to_string())),
            StringEncoding::Utf16 => Ok(Value::String(
                String::from_utf16_lossy(&raw.into()).to_string(),
            )),
        }
    }
}

impl BooleanType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match &self.encoding {
            BooleanEncoding::Integer(ty) => {
                match ty.deserialize(ctx)? {
                    Value::UnsignedInteger(v) => Ok(Value::Boolean(v != 0)),
                    Value::SignedInteger(v) => Ok(Value::Boolean(v != 0)),
                    _ => unreachable!(),
                }
            }
            BooleanEncoding::String(ty) => {
                let Value::String(v) = ty.deserialize(ctx)? else { unreachable!() };
                Ok(Value::Boolean(v != self.zero_string_value))
            }
        }
    }
}

impl BinaryType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let data = ctx.read_variable_size(&self.size)?;
        Ok(Value::Binary(data))
    }
}

impl Type {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match self {
            Type::Integer(ty) => ty.deserialize(ctx),
            Type::Float(ty) => ty.deserialize(ctx),
            Type::String(ty) => ty.deserialize(ctx),
            Type::Boolean(ty) => ty.deserialize(ctx),
            Type::Binary(ty) => ty.deserialize(ctx),
            // Type::Enumerated(ty) => {}
            // Type::AbsoluteTime(ty) => {}
            // Type::RelativeTime(ty) => {}
            // Type::Array(ty) => {}
            // Type::Aggregate(ty) => {}
            _ => unimplemented!()
        }
    }

    fn calibrate(&self, value: &Value) -> Result<Value> {
        match (self, value) {
            (Type::Integer(ty), Value::SignedInteger(i)) => {
                Ok(Value::Float(ty.calibrator.compute(*i as f64)?))
            }
            (Type::Integer(ty), Value::UnsignedInteger(i)) => {
                Ok(Value::Float(ty.calibrator.compute(*i as f64)?))
            }
            (Type::Float(ty), Value::Float(i)) => {
                Ok(Value::Float(ty.calibrator.compute(*i)?))
            }
            _ => Ok(value.clone())
        }
    }
}

impl Entry {
    fn deserialize(&self, ctx: &mut Context) -> Result<()> {
        let start_location = (match &self.location.reference {
            ReferenceLocation::ContainerStart => 0,
            ReferenceLocation::PreviousEntry => ctx.position,
        }) + (self.location.location.get(ctx)? as usize);

        ctx.position = start_location;

        if let Some(repeat) = self.repeat {} else {
            let ty = match &self.kind {
                EntryKind::ParameterRefEntry(r) => {
                    let value = ctx.db.telemetry_parameters.get(&r.0).unwrap().type_.deserialize(ctx)?;
                    ctx.add(r, value)
                }
                EntryKind::ContainerRefEntry(r) => {
                    let c = ctx.db.telemetry_containers.get(&r.0).unwrap();
                }
            }
        }


        Ok(())
    }
}

impl SequenceContainer {
    fn deserialize(&self, ctx: &mut Context) -> Result<()> {}
}

impl MissionDatabase {
        pub fn deserialize(&self, data: Vec<u8>) -> Result<Packet> {
            unimplemented!();
            // let mut ctx = DeserializationContext {
            //     db: self,
            //     data: &data,
            //     last_entry_bit: 0,
            //     parameters: Default::default(),
            // };
            //
            // let root = &self.telemetry_root;
            // for entry in &root.entry_list {
            //     entry.deserialize(&mut ctx)?;
            // }
            //
            // Ok(Packet {
            //     raw: data,
            //     container: root.clone(),
            //     parameters: vec![],
            // })
        }
    }
