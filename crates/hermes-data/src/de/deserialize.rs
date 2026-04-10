use crate::de::*;
use crate::*;
use hermes_xtce::IntegerEncodingType;

impl IntegerValue {
    pub(crate) fn get(&self, ctx: &Context) -> Result<i64> {
        match &self {
            IntegerValue::FixedValue(v) => Ok(*v),
            IntegerValue::DynamicValueParameter {
                ref_,
                linear_adjustment,
            } => {
                let raw = ctx.get_parameter_instance_num(ref_)?;
                match &linear_adjustment
                    .as_ref()
                    .map(|la| la.intercept + la.slope * raw)
                {
                    None => Ok(raw as i64),
                    Some(l) => Ok(*l as i64),
                }
            }
            IntegerValue::DynamicValueArgument { .. } => unreachable!(),
        }
    }
}

impl IntegerType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let r = ctx.get_bits(self.size_in_bits as usize, self.byte_order)?;
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
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match self.size_in_bits {
            FloatSize::F32 => {
                let raw = ctx.get_bits(32, self.byte_order)? as u32;
                let f: f32 = f32::from_bits(raw);
                Ok(Value::Float(f as f64))
            }
            FloatSize::F64 => {
                let raw = ctx.get_bits(64, self.byte_order)?;
                Ok(Value::Float(f64::from_bits(raw)))
            }
        }
    }
}

impl StringType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let raw: Vec<u8> = ctx.read_variable_size(&self.size)?;

        match &self.encoding {
            StringEncoding::UsAscii => Ok(Value::String(String::from_utf8_lossy(&raw).to_string())),
            StringEncoding::Utf8 => Ok(Value::String(String::from_utf8_lossy(&raw).to_string())),
            // StringEncoding::Utf16 => Ok(Value::String(
            //     String::from_utf16_lossy(&raw.into()).to_string(),
            // )),
        }
    }
}

impl BooleanType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match &self.encoding {
            BooleanEncoding::Integer(ty) => match ty.deserialize(ctx)? {
                Value::UnsignedInteger(v) => Ok(Value::Boolean(v != 0)),
                Value::SignedInteger(v) => Ok(Value::Boolean(v != 0)),
                _ => unreachable!(),
            },
            BooleanEncoding::String(ty) => {
                let Value::String(v) = ty.deserialize(ctx)? else {
                    unreachable!()
                };
                Ok(Value::Boolean(v != self.zero_string_value))
            }
        }
    }
}

impl BinaryType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let data = ctx.read_variable_size(&self.size)?;
        Ok(Value::Binary(data))
    }
}

impl AggregateType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let mut members = Vec::new();

        for member in &self.members {
            let value = member.type_.deserialize(ctx)?;
            members.push((member.name.clone(), value));
        }

        Ok(Value::Aggregate(AggregateValue::new(members)))
    }
}

impl EnumeratedType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let raw = match self.encoding.deserialize(ctx)? {
            Value::SignedInteger(v) => v,
            Value::UnsignedInteger(v) => v as i64,
            _ => unreachable!(),
        };

        match self.enumeration_list.iter().find_map(|item| {
            if item.value == raw {
                Some(Value::Enumerated(item.clone().into()))
            } else {
                None
            }
        }) {
            Some(v) => Ok(v),
            None => Err(Error::EnumeratedEntryNotFound(raw)),
        }
    }
}

impl ArrayType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let mut dims = Vec::new();
        for dim in &self.dimensions {
            let start = dim.starting_index.get(ctx)?;
            let end = dim.ending_index.get(ctx)?;
            dims.push(end - start + 1);
        }

        let total: i64 = dims.iter().product();

        let mut flat = Vec::new();
        for _ in 0..total {
            flat.push(self.element_type.deserialize(ctx)?);
        }

        // TODO Figure out how to handle multi-dimensional arrays
        Ok(Value::Array(flat))
    }
}

impl AbsoluteTimeType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        // TODO(tumbar) Convert this to an absolute time type
        match &self.encoding {
            TimeEncoding::Integer(ty) => ty.deserialize(ctx),
            TimeEncoding::String(ty) => ty.deserialize(ctx),
        }
    }
}

impl RelativeTimeType {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        // TODO(tumbar) Convert this to an relative time type
        match &self.encoding {
            TimeEncoding::Integer(ty) => ty.deserialize(ctx),
            TimeEncoding::String(ty) => ty.deserialize(ctx),
        }
    }
}

impl Type {
    pub(crate) fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match self {
            Type::Integer(ty) => ty.deserialize(ctx),
            Type::Float(ty) => ty.deserialize(ctx),
            Type::String(ty) => ty.deserialize(ctx),
            Type::Boolean(ty) => ty.deserialize(ctx),
            Type::Binary(ty) => ty.deserialize(ctx),
            Type::Aggregate(ty) => ty.deserialize(ctx),
            Type::Enumerated(ty) => ty.deserialize(ctx),
            Type::AbsoluteTime(ty) => ty.deserialize(ctx),
            Type::RelativeTime(ty) => ty.deserialize(ctx),
            Type::Array(ty) => ty.deserialize(ctx),
        }
    }

    pub(crate) fn calibrate(&self, value: &Value) -> Result<Option<f64>> {
        match (self, value) {
            (Type::Integer(ty), Value::SignedInteger(i)) => {
                Ok(Some(ty.calibrator.compute(*i as f64)?))
            }
            (Type::Integer(ty), Value::UnsignedInteger(i)) => {
                Ok(Some(ty.calibrator.compute(*i as f64)?))
            }
            (Type::Float(ty), Value::Float(i)) => Ok(Some(ty.calibrator.compute(*i)?)),
            _ => Ok(None),
        }
    }
}
