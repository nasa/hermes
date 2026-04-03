use hermes_xtce::{
    ByteOrderType, FloatEncodingType, IntegerEncodingType, ParameterInstanceRefType,
    StringEncodingType,
};
use std::time::Duration;

use crate::error::Error;
use crate::util::{
    parse_boolean, parse_float, parse_hex_binary, parse_integer, parse_relative_time,
};
use crate::{Calibrator, Result};

#[derive(Clone, Debug)]
pub struct ParameterRef(pub String);

/// An expanded parameter reference that allows applying calibration function
/// And optionally querying local sample cache
#[derive(Clone, Debug)]
pub struct ParameterInstanceRef {
    pub parameter: ParameterRef,
    // TODO(tumbar) Build in a store for caching a limited number of samples
    // pub instance: i64,
    pub use_calibrated_value: bool,
}

impl From<hermes_xtce::ParameterInstanceRefType> for ParameterInstanceRef {
    fn from(value: ParameterInstanceRefType) -> Self {
        ParameterInstanceRef {
            parameter: ParameterRef(value.parameter_ref),
            use_calibrated_value: value.use_calibrated_value,
        }
    }
}

#[derive(Clone, Debug)]
pub struct ArgumentRef(pub String);

///A slope and intercept may be applied to scale or shift the value of the parameter in the dynamic value.  The default of slope=1 and intercept=0 results in no change to the value.
#[derive(Clone, Debug)]
pub struct LinearAdjustment {
    pub slope: f64,
    pub intercept: f64,
}

#[derive(Clone, Debug)]
pub enum IntegerValueKind {
    FixedValue(i64),
    DynamicValueParameter(ParameterInstanceRef),
    DynamicValueArgument(ArgumentRef),
}

#[derive(Clone, Debug)]
pub struct IntegerValue {
    pub value: IntegerValueKind,
    pub linear_adjustment: Option<LinearAdjustment>,
}

#[derive(Clone, Debug)]
pub struct IntegerType {
    pub size_in_bits: i64,
    pub signed: bool,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    ///Specifies integer numeric value to raw encoding method, with the default being "unsigned".
    pub encoding: IntegerEncodingType,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
pub struct FloatType {
    pub size_in_bits: hermes_xtce::FloatSizeInBitsType,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    ///Specifies real/decimal numeric value to raw encoding method, with the default being "IEEE754_1985".
    pub encoding: FloatEncodingType,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
pub struct StringType {
    /// Specifies string encoding method, with the default being "UTF-8".
    pub encoding: StringEncodingType,
    /// Fixed size in bits, if applicable (None for variable-length strings)
    pub size_in_bits: Option<i64>,
}

#[derive(Clone, Debug)]
pub struct BooleanType {
    pub size_in_bits: i64,
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    /// Specifies integer numeric value to raw encoding method (typically size_in_bits=1).
    pub encoding: IntegerEncodingType,
    /// String representation for true value (default: "True")
    pub one_string_value: String,
    /// String representation for false value (default: "False")
    pub zero_string_value: String,
}

#[derive(Clone, Debug)]
pub struct EnumeratedType {
    pub size_in_bits: i64,
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    /// Specifies integer numeric value to raw encoding method.
    pub encoding: IntegerEncodingType,
    /// List of enumeration label/value pairs
    pub enumeration_list: Vec<EnumerationEntry>,
}

#[derive(Clone, Debug)]
pub struct EnumerationEntry {
    pub label: String,
    pub value: i64,
    pub short_description: Option<String>,
}

#[derive(Clone, Debug)]
pub struct BinaryType {
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    /// Size in bits (can be fixed or dynamic)
    pub size_in_bits: IntegerValue,
}

#[derive(Clone, Debug)]
pub enum TimeSystem {
    OffsetFrom(ParameterInstanceRef),
    Epoch(std::time::SystemTime),
}

#[derive(Clone, Debug)]
pub struct AbsoluteTimeType {
    /// The time encoding definition
    pub encoding: TimeEncoding,
    /// The time system for computing conversions
    pub time_system: TimeSystem,
}

#[derive(Clone, Debug)]
pub struct RelativeTimeType {
    /// The time encoding definition (typically integer for duration counts)
    pub encoding: TimeEncoding,
    /// Reference time scale
    pub offset: Option<f64>,
}

#[derive(Clone, Debug)]
pub enum TimeEncoding {
    /// Time encoded as integer (counts since epoch)
    Integer(IntegerType),
    /// Time encoded as string
    String(StringType),
}

#[derive(Clone, Debug)]
pub struct ArrayType {
    /// Reference to the element type name
    pub element_type: Box<Type>,
    /// Dimension specifications
    pub dimensions: Vec<Dimension>,
}

///For partial entries of an array, the starting and ending index for each dimension, OR the Size must be specified.  Indexes are zero based.
#[derive(Clone, Debug)]
pub struct Dimension {
    pub starting_index: IntegerValue,
    pub ending_index: IntegerValue,
}

#[derive(Clone, Debug)]
pub struct AggregateType {
    /// List of members (fields) in this aggregate
    pub members: Vec<Member>,
}

#[derive(Clone, Debug)]
pub struct Member {
    pub name: String,
    pub type_: Type,
}

#[derive(Clone, Debug)]
pub enum Type {
    Integer(IntegerType),
    Float(FloatType),
    String(StringType),
    Boolean(BooleanType),
    Binary(BinaryType),
    Enumerated(EnumeratedType),
    AbsoluteTime(AbsoluteTimeType),
    RelativeTime(RelativeTimeType),
    Array(ArrayType),
    Aggregate(AggregateType),
}

#[derive(Clone, Debug)]
pub struct Time {
    /// Time system this count represents
    pub system: TimeSystem,

    /// Nanoseconds since time-systems epoch (~585-year span after epoch)
    pub ns: u64,
}

#[derive(Clone, Debug)]
pub struct AggregateValue(Vec<(String, Value)>);

impl AggregateValue {
    pub fn iter(&self) -> impl Iterator<Item = &(String, Value)> {
        self.0.iter()
    }

    pub fn get(&self, name: &str) -> Option<&Value> {
        self.0
            .iter()
            .find(|(i_name, _)| i_name == name)
            .map(|(_, v)| v)
    }
}

#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RelativeTime {
    // Relative duration forward in time
    Forward(Duration),
    // Negative duration backward in time
    Backward(Duration),
}

#[derive(Clone, Debug)]
pub enum Value {
    Integer(i64),
    Float(f64),
    String(String),
    Boolean(bool),
    Binary(Vec<u8>),
    Enumerated(EnumerationEntry),
    AbsoluteTime(Time),
    RelativeTime(RelativeTime),
    Array(Vec<Value>),
    Aggregate(AggregateValue),
}

impl Value {
    pub fn parse(ty: &Type, s: &str) -> Result<Value> {
        match ty {
            // Values that don't need their types
            Type::Integer(_) => Ok(Value::Integer(parse_integer(s)?)),
            Type::Float(_) => Ok(Value::Float(parse_float(s)?)),
            Type::String(_) => Ok(Value::String(s.to_string())),
            Type::Boolean(_) => Ok(Value::Boolean(parse_boolean(s)?)),
            Type::Binary(_) => Ok(Value::Binary(parse_hex_binary(s)?)),
            Type::RelativeTime(_) => Ok(Value::RelativeTime(parse_relative_time(s)?)),

            Type::Enumerated(ty) => ty
                .enumeration_list
                .iter()
                .find_map(|item| {
                    if item.label == s {
                        Some(Ok(Value::Enumerated(item.clone())))
                    } else {
                        None
                    }
                })
                .unwrap_or(Err(Error::InvalidValue(format!(
                    "No enumeration entry for {}",
                    s
                )))),
            Type::AbsoluteTime(_) => Err(Error::NotImplemented(
                "Parsing absolute time is not implemented yet",
            )),
            Type::Array(_) => Err(Error::NotImplemented(
                "Parsing array values is not implemented yet",
            )),
            Type::Aggregate(_) => Err(Error::NotImplemented(
                "Parsing aggregate values is not implemented yet",
            )),
        }
    }
}
