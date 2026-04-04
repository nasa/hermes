use hermes_xtce::IntegerEncodingType;
use crate::*;

#[derive(Clone, Debug)]
pub struct DecodedValue {
    /// The final extracted/decoded value
    pub value: Value,
    /// The container stack where this value is from
    pub containers: Vec<String>,
    /// The parameter this value refers to
    pub parameter: Rc<Parameter>,
    /// The first bit this value resides in the parent packet
    pub start_bit: usize,
    /// The last bit this value resides in the parent packet
    pub end_bit: usize,
}

#[derive(Clone, Debug)]
pub struct Packet {
    pub raw: Vec<u8>,
    pub container: Rc<SequenceContainer>,
    pub parameters: Vec<DecodedValue>,
}

pub(crate) struct BitVec<'a>(&'a [u8]);

pub(crate) struct DeserializationContext<'a> {
    db: &'a MissionDatabase,
    raw: BitVec<'a>,
    last_entry_bit: usize,
    parameters: HashMap<String, DecodedValue>,
}

impl<'a> DeserializationContext<'a> {
    pub(crate) fn get_decoded_value(&self, r: &ParameterRef) -> Result<&DecodedValue> {
        match self.parameters.get(&r.0) {
            None => Err(Error::ParameterNotFound(r.0.to_string())),
            Some(v) => Ok(v),
        }
    }

    pub(crate) fn get_parameter(&self, r: &ParameterRef) -> Result<&Value> {
        Ok(&self.get_decoded_value(r)?.value)
    }

    pub(crate) fn get_parameter_instance(&self, r: &ParameterInstanceRef) -> Result<Value> {
        let value = self.get_decoded_value(&r.parameter)?;
        if r.use_calibrated_value {
            match (&value.value, value.parameter.type_.as_ref()) {
                (Value::Integer(v), Type::Integer(ty)) => {
                    Ok(Value::Float(ty.calibrator.compute(*v as f64)?))
                }
                (Value::Float(v), Type::Float(ty)) => Ok(Value::Float(ty.calibrator.compute(*v)?)),
                _ => Err(Error::InvalidValue(format!(
                    "Cannot apply calibration for non-numeric type of {}",
                    r.parameter.0
                ))),
            }
        } else {
            Ok(value.value.clone())
        }
    }
}

impl IntegerValue {
    pub(crate) fn get(&self, ctx: &DeserializationContext) -> Result<i64> {
        match &self {
            IntegerValue::FixedValue(v) => Ok(*v),
            IntegerValue::DynamicValueParameter {
                ref_,
                linear_adjustment,
            } => match ctx.get_parameter_instance(ref_)? {
                Value::Integer(i) => Ok(linear_adjustment
                    .as_ref()
                    .map(|la| (la.intercept + la.slope * (i as f64)) as i64)
                    .unwrap_or(i)),
                Value::Float(f) => Ok(linear_adjustment
                    .as_ref()
                    .map(|la| (la.intercept + la.slope * f) as i64)
                    .unwrap_or(f as i64)),
                _ => Err(Error::InvalidValue(format!(
                    "Cannot convert value for parameter {} to integer",
                    ref_.parameter.0
                ))),
            },
            IntegerValue::DynamicValueArgument { .. } => unreachable!(),
        }
    }
}

impl IntegerType {
    fn deserialize(&self, ctx: &mut DeserializationContext, start_location: usize) -> Result<Value> {

        if self.signed {

        }

        match self.encoding {
            IntegerEncodingType::Unsigned => {}
            IntegerEncodingType::SignMagnitude => {}
            IntegerEncodingType::TwosComplement => {}
            IntegerEncodingType::OnesComplement => {}
            IntegerEncodingType::Bcd => {}
            IntegerEncodingType::PackedBcd => {}
        }
    }
}

    impl Type {
        fn deserialize(&self, ctx: &mut DeserializationContext, start_location: usize) -> Result<Value> {
            match self {
                Type::Integer(ty) => {}
                Type::Float(_) => {}
                Type::String(_) => {}
                Type::Boolean(_) => {}
                Type::Binary(_) => {}
                Type::Enumerated(_) => {}
                Type::AbsoluteTime(_) => {}
                Type::RelativeTime(_) => {}
                Type::Array(_) => {}
                Type::Aggregate(_) => {}
            }
        }
    }

    impl Entry {
        fn deserialize(&self, ctx: &mut DeserializationContext) -> Result<()> {
            let start_location = (match &self.location.reference {
                ReferenceLocation::ContainerStart => 0,
                ReferenceLocation::PreviousEntry => ctx.last_entry_bit,
            }) + (self.location.location.get(ctx)? as usize);

            let ty = match &self.kind {
                EntryKind::ParameterRefEntry(r) => {
                    ctx.db.telemetry_parameters.get(&r.0).unwrap().type_.deserialize(ctx, start_location)?
                }
                EntryKind::ContainerRefEntry(r) => {
                    let c = ctx.db.telemetry_containers.get(&r.0).unwrap()
                }
            }

            Ok(())
        }
    }

    impl MissionDatabase {
        pub fn deserialize(&self, data: Vec<u8>) -> Result<Packet> {
            let mut ctx = DeserializationContext {
                db: self,
                raw: BitVec(&data),
                last_entry_bit: 0,
                parameters: Default::default(),
            };

            let root = &self.telemetry_root;
            for entry in &root.entry_list {
                entry.deserialize(&mut ctx)?;
            }

            Ok(Packet {
                raw: data,
                container: root.clone(),
                parameters: vec![],
            })
        }
    }
