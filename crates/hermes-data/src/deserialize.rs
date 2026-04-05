use crate::bit_vec::BitVec;
use crate::*;
use hermes_xtce::IntegerEncodingType;
use tracing::warn;

#[derive(Clone, Debug)]
pub struct ParameterValue {
    /// The raw value directly from the packet (DN)
    pub raw_value: Value,
    /// The value after calibration has been applied (EU)
    pub calibrated_value: Option<f64>,
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
    containers: Vec<Rc<SequenceContainer>>,
    parameters: HashMap<String, Vec<ParameterValue>>,
}

impl<'a> Context<'a> {
    fn add_parameter(&mut self, pv: ParameterValue) {
        match self.parameters.get_mut(&pv.parameter.head.qualified_name) {
            Some(pvl) => {
                pvl.push(pv);
            }
            None => {
                self.parameters
                    .insert(pv.parameter.head.qualified_name.clone(), vec![pv]);
            }
        }
    }

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

    fn get_parameter_value(&self, r: &ParameterRef) -> Result<&ParameterValue> {
        match self.parameters.get(&r.name) {
            None => Err(Error::ParameterNotFound(r.name.to_string())),
            Some(v) => Ok(v.first().unwrap()),
        }
    }

    fn get_parameter_instance(&self, r: &ParameterInstanceRef) -> Result<&ParameterValue> {
        self.get_parameter_value(&r.parameter)
    }

    fn get_parameter_instance_num(&self, r: &ParameterInstanceRef) -> Result<f64> {
        let value = self.get_parameter_instance(&r)?;
        if r.use_calibrated_value
            && let Some(v) = value.calibrated_value
        {
            Ok(v)
        } else {
            match &value.raw_value {
                Value::UnsignedInteger(v) => Ok(*v as f64),
                Value::SignedInteger(v) => Ok(*v as f64),
                Value::Float(v) => Ok(*v),
                v => Err(Error::InvalidValue(format!(
                    "Expected numeric value, got {}",
                    v
                ))),
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
            FloatSize::F32 => {
                let raw = ctx.get_bits(32, self.byte_order) as u32;
                let f: f32 = f32::from_bits(raw);
                Ok(Value::Float(f as f64))
            }
            FloatSize::F64 => {
                let raw = ctx.get_bits(64, self.byte_order);
                Ok(Value::Float(f64::from_bits(raw)))
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
            // StringEncoding::Utf16 => Ok(Value::String(
            //     String::from_utf16_lossy(&raw.into()).to_string(),
            // )),
        }
    }
}

impl BooleanType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
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
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let data = ctx.read_variable_size(&self.size)?;
        Ok(Value::Binary(data))
    }
}

impl AggregateType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let mut members = Vec::new();

        for member in &self.members {
            let value = member.type_.deserialize(ctx)?;
            members.push((member.name.clone(), value));
        }

        Ok(Value::Aggregate(AggregateValue::new(members)))
    }
}

impl EnumeratedType {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        let Value::SignedInteger(raw) = self.encoding.deserialize(ctx)? else {
            unreachable!()
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

// impl ArrayType {
//     fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
//         let mut members = Vec::new();
//         let mut current = &mut members;
//
//         for dim in &self.dimensions {
//
//         }
//
//         Ok(Value::Array(members))
//     }
// }

impl Type {
    fn deserialize(&self, ctx: &mut Context) -> Result<Value> {
        match self {
            Type::Integer(ty) => ty.deserialize(ctx),
            Type::Float(ty) => ty.deserialize(ctx),
            Type::String(ty) => ty.deserialize(ctx),
            Type::Boolean(ty) => ty.deserialize(ctx),
            Type::Binary(ty) => ty.deserialize(ctx),
            Type::Aggregate(ty) => ty.deserialize(ctx),
            Type::Enumerated(ty) => ty.deserialize(ctx),
            Type::AbsoluteTime(_) => todo!("Absolute time type not yet implemented"),
            Type::RelativeTime(_) => todo!("Relative time type not yet implemented"),
            Type::Array(_) => todo!("Array type not yet implemented"),
        }
    }

    fn calibrate(&self, value: &Value) -> Result<Option<f64>> {
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

impl Entry {
    fn deserialize_once(&self, ctx: &mut Context) -> Result<()> {
        match &self.kind {
            EntryKind::ParameterRefEntry(r) => {
                let prm = ctx.db.telemetry_parameters.get(&r.name).unwrap();

                let start_location = ctx.position;
                let raw_value = prm.type_.deserialize(ctx)?;
                let end_location = ctx.position;

                let calibrated_value = match prm.type_.calibrate(&raw_value) {
                    Ok(v) => v,
                    Err(err) => {
                        warn!("Failed to calibrate parameter {}: {}", r.name, err);
                        None
                    }
                };

                let pv = ParameterValue {
                    raw_value,
                    calibrated_value,
                    parameter: prm.clone(),
                    start_bit: start_location,
                    end_bit: end_location,
                };

                ctx.add_parameter(pv);
                Ok(())
            }
            EntryKind::ContainerRefEntry(r) => {
                let c = ctx.db.telemetry_containers.get(&r.0).unwrap();
                c.deserialize(ctx)
            }
        }
    }

    fn deserialize(&self, ctx: &mut Context) -> Result<()> {
        let start_location = (match &self.location.reference {
            ReferenceLocation::ContainerStart => 0,
            ReferenceLocation::PreviousEntry => ctx.position,
        }) + (self.location.location.get(ctx)? as usize);

        ctx.position = start_location;

        if let Some(repeat) = &self.repeat {
            let count = repeat.count.get(ctx)?;
            for _ in 0..count {
                self.deserialize_once(ctx)?;
                ctx.position += repeat.offset.get(ctx)? as usize;
            }

            Ok(())
        } else {
            self.deserialize_once(ctx)
        }
    }
}

fn builtin_comparison<T: PartialEq + PartialOrd>(
    op: &hermes_xtce::ComparisonOperatorsType,
    l: T,
    r: T,
) -> bool {
    use hermes_xtce::ComparisonOperatorsType::*;
    match op {
        Eq => l == r,
        Neq => l != r,
        Lt => l < r,
        Lte => l <= r,
        Gt => l > r,
        Gte => l >= r,
    }
}

fn comparison(
    op: &hermes_xtce::ComparisonOperatorsType,
    left: &Value,
    right: &Value,
) -> Result<bool> {
    match (&left, &right) {
        // All the simple comparisons
        // If their type matches, compare them directly, if not, upcast to the nearest common type
        (Value::Float(l), Value::Float(r)) => Ok(builtin_comparison(&op, *l, *r)),
        (Value::UnsignedInteger(l), Value::UnsignedInteger(r)) => {
            Ok(builtin_comparison(&op, *l, *r))
        }
        (Value::SignedInteger(l), Value::SignedInteger(r)) => Ok(builtin_comparison(&op, *l, *r)),
        // Float with signed ints
        (Value::Float(l), Value::SignedInteger(r)) => Ok(builtin_comparison(&op, *l, *r as f64)),
        (Value::SignedInteger(l), Value::Float(r)) => Ok(builtin_comparison(&op, *l as f64, *r)),
        // Float with unsigned ints
        (Value::Float(l), Value::UnsignedInteger(r)) => Ok(builtin_comparison(&op, *l, *r as f64)),
        (Value::UnsignedInteger(l), Value::Float(r)) => Ok(builtin_comparison(&op, *l as f64, *r)),
        // Unsigned ints with signed ints
        (Value::SignedInteger(l), Value::UnsignedInteger(r)) => {
            Ok(builtin_comparison(&op, *l, *r as i64))
        }
        (Value::UnsignedInteger(l), Value::SignedInteger(r)) => {
            Ok(builtin_comparison(&op, *l as i64, *r))
        }

        // The rest of the comparisons are non-permissive
        // Left and right types must match
        (Value::String(l), Value::String(r)) => Ok(builtin_comparison(op, l, r)),
        (Value::Boolean(l), Value::Boolean(r)) => Ok(builtin_comparison(op, l, r)),
        (Value::Enumerated(l), Value::Enumerated(r)) => Ok(builtin_comparison(op, l, r)),

        // TODO(tumbar) We can probably implement more comparisons
        (_, _) => Err(Error::InvalidComparison(
            op.clone(),
            left.clone(),
            right.clone(),
        )), // (Value::Array(l), Value::Array(r)) => {
            //     if l.len() != r.len() || *op != hermes_xtce::ComparisonOperatorsType::Eq {
            //         Err(Error::InvalidComparison(
            //             op.clone(),
            //             left.clone(),
            //             right.clone(),
            //         ))
            //     } else {
            //         Ok(l.iter()
            //             .zip(r)
            //             .all(|(l, r)| comparison(&hermes_xtce::ComparisonOperatorsType::Eq, left, right)))
            //     }
            // }
    }
}

impl Comparison {
    fn evaluate(&self, ctx: &Context) -> Result<bool> {
        let left = {
            let left = ctx.get_parameter_instance(&self.parameter_ref)?;
            if self.parameter_ref.use_calibrated_value
                && let Some(cv) = left.calibrated_value
            {
                Value::Float(cv)
            } else {
                left.raw_value.clone()
            }
        };

        comparison(&self.comparison_operator, &left, &self.value)
    }
}

impl ComparisonCheck {
    fn evaluate(&self, ctx: &Context) -> Result<bool> {
        let left = {
            let left = ctx.get_parameter_instance(&self.left)?;
            if self.left.use_calibrated_value
                && let Some(cv) = left.calibrated_value
            {
                Value::Float(cv)
            } else {
                left.raw_value.clone()
            }
        };

        let right = {
            match &self.right {
                ParameterRefOrValue::ParameterInstanceRef(parameter_instance_ref) => {
                    let rv = ctx.get_parameter_instance(&self.left)?;
                    if parameter_instance_ref.use_calibrated_value
                        && let Some(cv) = rv.calibrated_value
                    {
                        Value::Float(cv)
                    } else {
                        rv.raw_value.clone()
                    }
                }
                ParameterRefOrValue::Value(value) => value.clone(),
            }
        };

        comparison(&self.operator, &left, &right)
    }
}

impl BooleanExpression {
    fn evaluate(&self, ctx: &Context) -> Result<bool> {
        match self {
            BooleanExpression::Condition(comparison_check) => comparison_check.evaluate(ctx),
            BooleanExpression::AndConditions(and_conditions) => {
                for v in and_conditions {
                    if !v.evaluate(ctx)? {
                        return Ok(false);
                    }
                }

                Ok(true)
            }
            BooleanExpression::OrConditions(or_conditions) => {
                for v in or_conditions {
                    if v.evaluate(ctx)? {
                        return Ok(true);
                    }
                }

                Ok(false)
            }
        }
    }
}

impl RestrictionCriteria {
    fn evaluate(&self, ctx: &Context) -> bool {
        match self {
            RestrictionCriteria::Comparison(comparison) => {
                comparison.evaluate(ctx).unwrap_or_else(|err| {
                    warn!(err = %err, "Failed to perform evaluation");
                    false
                })
            }
            RestrictionCriteria::ComparisonList(comparisons) => comparisons.iter().all(|c| {
                c.evaluate(ctx).unwrap_or_else(|err| {
                    warn!(err = %err, "Failed to perform evaluation");
                    false
                })
            }),
            RestrictionCriteria::BooleanExpression(boolean_expression) => {
                boolean_expression.evaluate(ctx).unwrap_or_else(|err| {
                    warn!(err = %err, "Failed to perform evaluation");
                    false
                })
            }
        }
    }
}

impl SequenceContainer {
    fn deserialize(&self, ctx: &mut Context) -> Result<()> {
        for entry in &self.entry_list {
            entry.deserialize(ctx)?;
        }

        if self.abstract_ {
            // This is not a real container
            // Look for a child container that fits the match criteria
            for (rc, child) in &self.children {
                if rc.evaluate(ctx) {
                    ctx.containers.push(child.clone());
                    child.deserialize(ctx)?;
                    break;
                }
            }
        }

        Ok(())
    }
}

pub struct Packet {
    pub raw: Vec<u8>,
    pub containers: Vec<Rc<SequenceContainer>>,
    pub parameters: HashMap<String, Vec<ParameterValue>>,
}

impl MissionDatabase {
    pub fn deserialize(&self, data: Vec<u8>) -> Result<Packet> {
        let root = &self.telemetry_root;
        let (parameters, containers) = {
            let mut ctx = Context {
                db: self,
                data: BitVec::new(&data, 0),
                position: 0,
                parameters: Default::default(),
                containers: vec![root.clone()],
            };

            root.deserialize(&mut ctx)?;
            (ctx.parameters, ctx.containers)
        };

        Ok(Packet {
            raw: data,
            containers,
            parameters,
        })
    }
}
