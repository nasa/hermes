use crate::error::Error;
use crate::util::{
    parse_boolean, parse_float, parse_hex_binary, parse_i64, parse_relative_time, parse_u64,
};
use crate::{Calibrator, Result};
use std::time::Duration;

#[derive(Clone, Debug, PartialEq)]
pub struct ParameterRef {
    pub name: String,
    /// Optional path to a member within an aggregate parameter
    /// Example: for "CCSDS_Packet_ID/Version", name would be "CCSDS_Packet_ID" (fully qualified)
    /// and member_path would be vec!["Version"]
    pub member_path: Option<Vec<String>>,
}

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum ByteOrder {
    LittleEndian,
    BigEndian,
}

impl TryFrom<hermes_xtce::ByteOrderType> for ByteOrder {
    type Error = Error;

    fn try_from(value: hermes_xtce::ByteOrderType) -> Result<Self> {
        match value {
            hermes_xtce::ByteOrderType::MostSignificantByteFirst => Ok(ByteOrder::BigEndian),
            hermes_xtce::ByteOrderType::LeastSignificantByteFirst => Ok(ByteOrder::LittleEndian),
            hermes_xtce::ByteOrderType::String(s) => Err(Error::InvalidXtce(format!(
                "Unsupported byte order type: {}",
                s
            ))),
        }
    }
}

/// An expanded parameter reference that allows applying calibration function
/// And optionally querying local sample cache
#[derive(Clone, Debug, PartialEq)]
pub struct ParameterInstanceRef {
    pub parameter: ParameterRef,
    // TODO(tumbar) Build in a store for caching a limited number of samples
    // pub instance: i64,
    pub use_calibrated_value: bool,
}

impl From<hermes_xtce::ParameterInstanceRefType> for ParameterInstanceRef {
    fn from(value: hermes_xtce::ParameterInstanceRefType) -> Self {
        ParameterInstanceRef {
            parameter: ParameterRef {
                name: value.parameter_ref,
                member_path: None,
            },
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
pub enum IntegerValue {
    FixedValue(i64),
    DynamicValueParameter {
        ref_: ParameterInstanceRef,
        linear_adjustment: Option<LinearAdjustment>,
    },
    DynamicValueArgument {
        ref_: ArgumentRef,
        linear_adjustment: Option<LinearAdjustment>,
    },
}

#[derive(Clone, Debug)]
#[repr(usize)]
pub enum IntegerSize {
    U8 = 8,
    U16 = 16,
    U32 = 32,
    U64 = 64,
}

#[derive(Clone, Debug)]
pub struct IntegerType {
    pub size_in_bits: i64,
    pub signed: bool,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrder,
    ///Specifies integer numeric value to raw encoding method, with the default being "unsigned".
    pub encoding: hermes_xtce::IntegerEncodingType,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
#[repr(usize)]
pub enum FloatSize {
    F32 = 32,
    F64 = 64,
}

impl TryFrom<hermes_xtce::FloatSizeInBitsType> for FloatSize {
    type Error = Error;

    fn try_from(value: hermes_xtce::FloatSizeInBitsType) -> Result<Self> {
        match value {
            hermes_xtce::FloatSizeInBitsType::_32 => Ok(FloatSize::F32),
            hermes_xtce::FloatSizeInBitsType::_64 => Ok(FloatSize::F64),
            hermes_xtce::FloatSizeInBitsType::_128 => Err(Error::InvalidXtce(
                "128-bit floats are not supported".to_string(),
            )),
        }
    }
}

#[derive(Clone, Debug)]
pub struct FloatType {
    pub size_in_bits: FloatSize,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrder,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
pub enum VariableSize {
    /// Size is fixed and not encoded in the binary
    Fixed(usize),
    /// Read a different parameters value to determine the size
    DynamicParameterRef(ParameterInstanceRef),
    /// Size is encoded before the string contents as an integer
    LeadingSize {
        kind: IntegerType,
        max_size_in_bits: usize,
    },
    /// String is terminated by a single ascii byte
    TerminationChar { chr: u8, max_size_in_bits: usize },
}

#[derive(Clone, Debug, Default)]
pub enum StringEncoding {
    #[default]
    Utf8,
    UsAscii,
}

impl TryFrom<hermes_xtce::StringEncodingType> for StringEncoding {
    type Error = Error;

    fn try_from(value: hermes_xtce::StringEncodingType) -> Result<Self> {
        match value {
            hermes_xtce::StringEncodingType::Utf8 => Ok(StringEncoding::Utf8),
            hermes_xtce::StringEncodingType::UsAscii => Ok(StringEncoding::UsAscii),
            // hermes_xtce::StringEncodingType::Utf16 => Ok(StringEncoding::Utf16),
            // hermes_xtce::StringEncodingType::Utf16Le => Ok(StringEncoding::Utf16),
            // hermes_xtce::StringEncodingType::Utf16Be => Ok(StringEncoding::Utf16),
            _ => Err(Error::InvalidXtce(format!(
                "Unsupported string encoding: {:?}",
                value
            ))),
        }
    }
}

#[derive(Clone, Debug)]
pub struct StringType {
    /// Specifies string encoding method, with the default being "UTF-8".
    pub encoding: StringEncoding,
    /// Strings are typically variably sized, determines how to handle this
    pub size: VariableSize,
}

#[derive(Clone, Debug)]
pub enum BooleanEncoding {
    Integer(IntegerType),
    String(StringType),
}

#[derive(Clone, Debug)]
pub struct BooleanType {
    pub encoding: BooleanEncoding,
    /// String representation for true value (default: "True")
    pub one_string_value: String,
    /// String representation for false value (default: "False")
    pub zero_string_value: String,
}

#[derive(Clone, Debug)]
pub struct EnumeratedType {
    /// Specifies integer numeric value to raw encoding method.
    pub encoding: IntegerType,
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
    pub size: VariableSize,
}

#[derive(Clone, Debug, PartialEq)]
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

#[derive(Clone, Debug, PartialEq)]
pub struct Time {
    /// Time system this count represents
    pub system: TimeSystem,

    /// Nanoseconds since time-systems epoch (~585-year span after epoch)
    pub ns: u64,
}

#[derive(Clone, Debug, PartialEq)]
pub struct AggregateValue(Vec<(String, Value)>);

impl AggregateValue {
    pub fn new(members: Vec<(String, Value)>) -> Self {
        AggregateValue(members)
    }

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
pub struct EnumerationValue {
    pub label: String,
    pub value: i64,
}

impl From<EnumerationEntry> for EnumerationValue {
    fn from(entry: EnumerationEntry) -> Self {
        EnumerationValue {
            label: entry.label,
            value: entry.value,
        }
    }
}

impl PartialEq for EnumerationValue {
    fn eq(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

impl PartialOrd for EnumerationValue {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        self.value.partial_cmp(&other.value)
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum Value {
    UnsignedInteger(u64),
    SignedInteger(i64),
    Float(f64),
    String(String),
    Boolean(bool),
    Binary(Vec<u8>),
    Enumerated(EnumerationValue),
    AbsoluteTime(Time),
    RelativeTime(RelativeTime),
    Array(Vec<Value>),
    Aggregate(AggregateValue),
}

impl std::fmt::Display for Value {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Value::UnsignedInteger(u) => f.write_fmt(format_args!("{}", u)),
            Value::SignedInteger(i) => f.write_fmt(format_args!("{}", i)),
            Value::Float(fl) => f.write_fmt(format_args!("{}", fl)),
            Value::String(s) => f.write_fmt(format_args!("\"{}\"", s)),
            Value::Boolean(b) => f.write_str(if *b { "true" } else { "false" }),
            Value::Binary(b) => f.write_fmt(format_args!("{:?}", b)),
            Value::Enumerated(e) => f.write_fmt(format_args!("{}({})", e.label, e.value)),
            Value::AbsoluteTime(t) => write!(f, "{}ns", t.ns),
            Value::RelativeTime(rt) => match rt {
                RelativeTime::Forward(d) => write!(f, "+{:?}", d),
                RelativeTime::Backward(d) => write!(f, "-{:?}", d),
            },
            Value::Array(arr) => {
                f.write_str("[")?;
                for (i, v) in arr.iter().enumerate() {
                    if i > 0 {
                        f.write_str(", ")?;
                    }
                    write!(f, "{}", v)?;
                }
                f.write_str("]")
            }
            Value::Aggregate(agg) => {
                f.write_str("{")?;
                for (i, (name, v)) in agg.iter().enumerate() {
                    if i > 0 {
                        f.write_str(", ")?;
                    }
                    write!(f, "{}: {}", name, v)?;
                }
                f.write_str("}")
            }
        }
    }
}

impl Value {
    pub fn parse(ty: &Type, s: &str) -> Result<Value> {
        match ty {
            // Values that don't need their types
            Type::Integer(ty) => {
                if ty.signed {
                    Ok(Value::SignedInteger(parse_i64(s)?))
                } else {
                    Ok(Value::UnsignedInteger(parse_u64(s)?))
                }
            }
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
                        Some(Ok(Value::Enumerated(item.clone().into())))
                    } else {
                        None
                    }
                })
                .unwrap_or(Err(Error::InvalidValue(format!(
                    "No enumeration entry for {}",
                    s
                )))),
            Type::AbsoluteTime(_) => Err(Error::NotImplemented("Absolute time parsing")),
            Type::Array(_) => Err(Error::NotImplemented("Array value parsing")),
            Type::Aggregate(_) => Err(Error::NotImplemented("Aggregate value parsing")),
        }
    }
}
