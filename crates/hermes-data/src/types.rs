use crate::error::Error;
use crate::util::{
    parse_boolean, parse_float, parse_hex_binary, parse_i64, parse_relative_time, parse_u64,
};
use crate::{Calibrator, Result};
use std::time::Duration;

#[derive(Clone, Debug)]
pub struct ParameterRef(pub String);

#[derive(Clone, Copy, Debug)]
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
#[derive(Clone, Debug)]
pub struct ParameterInstanceRef {
    pub parameter: ParameterRef,
    // TODO(tumbar) Build in a store for caching a limited number of samples
    // pub instance: i64,
    pub use_calibrated_value: bool,
}

impl From<hermes_xtce::ParameterInstanceRefType> for ParameterInstanceRef {
    fn from(value: hermes_xtce::ParameterInstanceRefType) -> Self {
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

#[derive(Clone, Debug)]
pub struct FloatType {
    pub size_in_bits: hermes_xtce::FloatSizeInBitsType,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrder,
    ///Specifies real/decimal numeric value to raw encoding method, with the default being "IEEE754_1985".
    pub encoding: hermes_xtce::FloatEncodingType,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
pub enum StringSize {
    /// String size is fixed and not encoded in the binary
    Fixed(usize),
    /// Size is encoded before the string contents as an integer
    LeadingSize(IntegerType),
    /// String is terminated by a single ascii byte
    TerminationChar(u8),
}

#[derive(Clone, Debug)]
pub struct StringType {
    /// Specifies string encoding method, with the default being "UTF-8".
    pub encoding: hermes_xtce::StringEncodingType,
    /// Strings are typically variably sized, determines how to handle this
    pub size: StringSize,
}

#[derive(Clone, Debug)]
pub struct BooleanType {
    pub size_in_bits: i64,
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrder,
    /// Specifies integer numeric value to raw encoding method (typically size_in_bits=1).
    pub encoding: hermes_xtce::IntegerEncodingType,
    /// String representation for true value (default: "True")
    pub one_string_value: String,
    /// String representation for false value (default: "False")
    pub zero_string_value: String,
}

#[derive(Clone, Debug)]
pub struct EnumeratedType {
    pub size_in_bits: i64,
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrder,
    /// Specifies integer numeric value to raw encoding method.
    pub encoding: hermes_xtce::IntegerEncodingType,
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
    pub byte_order: ByteOrder,
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
    UnsignedInteger(u64),
    SignedInteger(i64),
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
                        Some(Ok(Value::Enumerated(item.clone())))
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

pub(crate) fn convert_parameter_type_set(xml: &hermes_xtce::ParameterTypeSetType) -> Result<Type> {
    match xml {
        hermes_xtce::ParameterTypeSetType::IntegerParameterType(t) => {
            Ok(Type::Integer(convert_integer_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::FloatParameterType(t) => {
            Ok(Type::Float(convert_float_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::StringParameterType(t) => {
            Ok(Type::String(convert_string_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::BooleanParameterType(t) => {
            Ok(Type::Boolean(convert_boolean_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::EnumeratedParameterType(t) => {
            Ok(Type::Enumerated(convert_enumerated_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::BinaryParameterType(t) => {
            Ok(Type::Binary(convert_binary_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::AbsoluteTimeParameterType(t) => {
            Ok(Type::AbsoluteTime(convert_absolute_time_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::RelativeTimeParameterType(t) => {
            Ok(Type::RelativeTime(convert_relative_time_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::ArrayParameterType(_t) => {
            panic!("Array types cannot be converted by 'convert_parameter_type_set'")
        }
        hermes_xtce::ParameterTypeSetType::AggregateParameterType(_t) => {
            panic!("Aggregate types cannot be converted by 'convert_parameter_type_set'")
        }
    }
}

/// Convert parameter type with context for resolving type references (used for Array and Aggregate types)
pub(crate) fn convert_parameter_type_set_with_context(
    xml: &hermes_xtce::ParameterTypeSetType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::rc::Rc<Type>>,
) -> Result<Type> {
    match xml {
        hermes_xtce::ParameterTypeSetType::ArrayParameterType(t) => Ok(Type::Array(
            convert_array_parameter_type(t, space_system_path, available_types)?,
        )),
        hermes_xtce::ParameterTypeSetType::AggregateParameterType(t) => Ok(Type::Aggregate(
            convert_aggregate_parameter_type(t, space_system_path, available_types)?,
        )),
        // For other types, use the simple converter (shouldn't happen in normal flow)
        _ => convert_parameter_type_set(xml),
    }
}

fn convert_integer_parameter_type(xml: &hermes_xtce::IntegerParameterType) -> Result<IntegerType> {
    // Extract encoding information from content
    let encoding_opt = xml.content.iter().find_map(|item| match item {
        hermes_xtce::IntegerParameterTypeContent::IntegerDataEncoding(enc) => Some(enc),
        _ => None,
    });

    // If no encoding is present, this type may use baseType inheritance
    // For now, create a default encoding based on the size and signedness
    let (size_in_bits, byte_order, encoding, calibrator) = if let Some(enc) = encoding_opt {
        let calibrator = if let Some(default_calibrator) = &enc.default_calibrator {
            Calibrator::new(default_calibrator.clone())?
        } else {
            Calibrator::None
        };
        (
            enc.size_in_bits,
            enc.byte_order.clone().try_into()?,
            enc.encoding.clone(),
            calibrator,
        )
    } else {
        // Use default encoding based on type attributes
        // This handles types that inherit from baseType without their own encoding
        (
            xml.size_in_bits,
            ByteOrder::BigEndian,
            if xml.signed {
                hermes_xtce::IntegerEncodingType::TwosComplement
            } else {
                hermes_xtce::IntegerEncodingType::Unsigned
            },
            Calibrator::None,
        )
    };

    Ok(IntegerType {
        size_in_bits,
        signed: xml.signed,
        byte_order,
        encoding,
        calibrator,
    })
}

fn convert_float_parameter_type(xml: &hermes_xtce::FloatParameterType) -> Result<FloatType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::FloatParameterTypeContent::FloatDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("FloatParameterType missing FloatDataEncoding".to_string())
        })?;

    // Get calibrator if present
    let calibrator = if let Some(default_calibrator) = &encoding.default_calibrator {
        Calibrator::new(default_calibrator.clone())?
    } else {
        Calibrator::None
    };

    Ok(FloatType {
        size_in_bits: xml.size_in_bits.clone(),
        byte_order: encoding.byte_order.clone().try_into()?,
        encoding: encoding.encoding.clone(),
        calibrator,
    })
}

fn convert_string_parameter_type(xml: &hermes_xtce::StringParameterType) -> Result<StringType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::StringParameterTypeContent::StringDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("StringParameterType missing StringDataEncoding".to_string())
        })?;

    // Determine size (fixed, leading, or termination char)
    let byte_order = encoding.byte_order.clone().try_into()?;
    let size = encoding
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::StringDataEncodingTypeContent::SizeInBits(size) => {
                // Fixed size strings - check for optional termination char or leading size
                if let Some(leading_size) = &size.leading_size {
                    // Pascal-style string with fixed buffer and leading size tag
                    Some(Ok(StringSize::LeadingSize(IntegerType {
                        size_in_bits: leading_size.size_in_bits_of_size_tag,
                        signed: false,
                        byte_order,
                        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                        calibrator: Calibrator::None,
                    })))
                } else if let Some(term_char) = &size.termination_char {
                    // Null-terminated string with fixed buffer
                    Some(parse_termination_char(term_char).map(StringSize::TerminationChar))
                } else {
                    // Fixed size string
                    Some(Ok(StringSize::Fixed((size.fixed.fixed_value / 8) as usize)))
                }
            }
            hermes_xtce::StringDataEncodingTypeContent::Variable(var) => {
                // Variable size strings - check what determines the size
                var.content
                    .iter()
                    .find_map(|var_content| match var_content {
                        hermes_xtce::VariableStringTypeContent::LeadingSize(leading_size) => {
                            Some(Ok(StringSize::LeadingSize(IntegerType {
                                size_in_bits: leading_size.size_in_bits_of_size_tag,
                                signed: false,
                                byte_order,
                                encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                                calibrator: Calibrator::None,
                            })))
                        }
                        hermes_xtce::VariableStringTypeContent::TerminationChar(term_char) => {
                            Some(parse_termination_char(term_char).map(StringSize::TerminationChar))
                        }
                        _ => None,
                    })
            }
            _ => None,
        })
        .transpose()?
        .ok_or_else(|| {
            Error::InvalidXtce(
                "StringParameterType missing size specification (Fixed or Variable)".to_string(),
            )
        })?;

    Ok(StringType {
        encoding: encoding.encoding.clone(),
        size,
    })
}

fn parse_termination_char(hex: &str) -> Result<u8> {
    // HexBinaryType is a String containing hex digits
    let bytes = parse_hex_binary(hex)?;

    if bytes.len() != 1 {
        return Err(Error::InvalidXtce(format!(
            "Termination char must be a single byte, got {} bytes",
            bytes.len()
        )));
    }

    Ok(bytes[0])
}

fn convert_boolean_parameter_type(xml: &hermes_xtce::BooleanParameterType) -> Result<BooleanType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::BooleanParameterTypeContent::IntegerDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("BooleanParameterType missing IntegerDataEncoding".to_string())
        })?;

    Ok(BooleanType {
        size_in_bits: encoding.size_in_bits,
        byte_order: encoding.byte_order.clone().try_into()?,
        encoding: encoding.encoding.clone(),
        one_string_value: xml.one_string_value.clone(),
        zero_string_value: xml.zero_string_value.clone(),
    })
}

fn convert_enumerated_parameter_type(
    xml: &hermes_xtce::EnumeratedParameterType,
) -> Result<EnumeratedType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::EnumeratedParameterTypeContent::IntegerDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("EnumeratedParameterType missing IntegerDataEncoding".to_string())
        })?;

    // Extract enumeration list from content
    let enumeration_list = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::EnumeratedParameterTypeContent::EnumerationList(list) => Some(list),
            _ => None,
        })
        .map(|list| {
            list.enumeration
                .iter()
                .map(|e| EnumerationEntry {
                    label: e.label.clone(),
                    value: e.value,
                    short_description: e.short_description.clone(),
                })
                .collect()
        })
        .unwrap_or_default();

    Ok(EnumeratedType {
        size_in_bits: encoding.size_in_bits,
        byte_order: encoding.byte_order.clone().try_into()?,
        encoding: encoding.encoding.clone(),
        enumeration_list,
    })
}

fn convert_binary_parameter_type(xml: &hermes_xtce::BinaryParameterType) -> Result<BinaryType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::BinaryParameterTypeContent::BinaryDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("BinaryParameterType missing BinaryDataEncoding".to_string())
        })?;

    // Convert size (IntegerValueType can be fixed or dynamic)
    let size_in_bits = crate::util::convert_integer_value(&encoding.size_in_bits)?;

    Ok(BinaryType {
        byte_order: encoding.byte_order.clone().try_into()?,
        size_in_bits,
    })
}

fn convert_absolute_time_parameter_type(
    xml: &hermes_xtce::AbsoluteTimeParameterType,
) -> Result<AbsoluteTimeType> {
    // Extract encoding information (it's a direct field, not in content)
    let encoding_xml = xml.encoding.as_ref().ok_or_else(|| {
        Error::InvalidXtce("AbsoluteTimeParameterType missing Encoding".to_string())
    })?;

    // Convert encoding (can be Integer or String)
    let encoding = match &encoding_xml.content {
        hermes_xtce::EncodingTypeContent::IntegerDataEncoding(enc) => {
            TimeEncoding::Integer(IntegerType {
                size_in_bits: enc.size_in_bits,
                signed: false, // Time is typically unsigned
                byte_order: enc.byte_order.clone().try_into()?,
                encoding: enc.encoding.clone(),
                calibrator: Calibrator::None,
            })
        }
        hermes_xtce::EncodingTypeContent::StringDataEncoding(enc) => {
            let byte_order = enc.byte_order.clone().try_into()?;
            let size = enc
                .content
                .iter()
                .find_map(|item| match item {
                    hermes_xtce::StringDataEncodingTypeContent::SizeInBits(size) => {
                        if let Some(leading_size) = &size.leading_size {
                            Some(Ok(StringSize::LeadingSize(IntegerType {
                                size_in_bits: leading_size.size_in_bits_of_size_tag,
                                signed: false,
                                byte_order,
                                encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                                calibrator: Calibrator::None,
                            })))
                        } else if let Some(term_char) = &size.termination_char {
                            Some(parse_termination_char(term_char).map(StringSize::TerminationChar))
                        } else {
                            Some(Ok(StringSize::Fixed((size.fixed.fixed_value / 8) as usize)))
                        }
                    }
                    hermes_xtce::StringDataEncodingTypeContent::Variable(var) => var
                        .content
                        .iter()
                        .find_map(|var_content| match var_content {
                            hermes_xtce::VariableStringTypeContent::LeadingSize(leading_size) => {
                                Some(Ok(StringSize::LeadingSize(IntegerType {
                                    size_in_bits: leading_size.size_in_bits_of_size_tag,
                                    signed: false,
                                    byte_order,
                                    encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                                    calibrator: Calibrator::None,
                                })))
                            }
                            hermes_xtce::VariableStringTypeContent::TerminationChar(term_char) => {
                                Some(
                                    parse_termination_char(term_char)
                                        .map(StringSize::TerminationChar),
                                )
                            }
                            _ => None,
                        }),
                    _ => None,
                })
                .transpose()
                .ok()
                .flatten()
                .unwrap_or(StringSize::Fixed(0)); // Default for time strings
            TimeEncoding::String(StringType {
                encoding: enc.encoding.clone(),
                size,
            })
        }
        _ => {
            return Err(Error::InvalidXtce(
                "AbsoluteTimeParameterType has unsupported encoding type".to_string(),
            ));
        }
    };

    // For now, use a default epoch time system
    // TODO: Parse reference_time to determine the actual epoch
    let time_system = TimeSystem::Epoch(std::time::SystemTime::UNIX_EPOCH);

    Ok(AbsoluteTimeType {
        encoding,
        time_system,
    })
}

fn convert_relative_time_parameter_type(
    xml: &hermes_xtce::RelativeTimeParameterType,
) -> Result<RelativeTimeType> {
    // Extract encoding information (it's a direct field, not in content)
    let encoding_xml = xml.encoding.as_ref().ok_or_else(|| {
        Error::InvalidXtce("RelativeTimeParameterType missing Encoding".to_string())
    })?;

    // Convert encoding (typically Integer for duration counts)
    let encoding = match &encoding_xml.content {
        hermes_xtce::EncodingTypeContent::IntegerDataEncoding(enc) => {
            TimeEncoding::Integer(IntegerType {
                size_in_bits: enc.size_in_bits,
                signed: false,
                byte_order: enc.byte_order.clone().try_into()?,
                encoding: enc.encoding.clone(),
                calibrator: Calibrator::None,
            })
        }
        hermes_xtce::EncodingTypeContent::StringDataEncoding(enc) => {
            let byte_order = enc.byte_order.clone().try_into()?;
            let size = enc
                .content
                .iter()
                .find_map(|item| match item {
                    hermes_xtce::StringDataEncodingTypeContent::SizeInBits(size) => {
                        if let Some(leading_size) = &size.leading_size {
                            Some(Ok(StringSize::LeadingSize(IntegerType {
                                size_in_bits: leading_size.size_in_bits_of_size_tag,
                                signed: false,
                                byte_order,
                                encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                                calibrator: Calibrator::None,
                            })))
                        } else if let Some(term_char) = &size.termination_char {
                            Some(parse_termination_char(term_char).map(StringSize::TerminationChar))
                        } else {
                            Some(Ok(StringSize::Fixed((size.fixed.fixed_value / 8) as usize)))
                        }
                    }
                    hermes_xtce::StringDataEncodingTypeContent::Variable(var) => var
                        .content
                        .iter()
                        .find_map(|var_content| match var_content {
                            hermes_xtce::VariableStringTypeContent::LeadingSize(leading_size) => {
                                Some(Ok(StringSize::LeadingSize(IntegerType {
                                    size_in_bits: leading_size.size_in_bits_of_size_tag,
                                    signed: false,
                                    byte_order,
                                    encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                                    calibrator: Calibrator::None,
                                })))
                            }
                            hermes_xtce::VariableStringTypeContent::TerminationChar(term_char) => {
                                Some(
                                    parse_termination_char(term_char)
                                        .map(StringSize::TerminationChar),
                                )
                            }
                            _ => None,
                        }),
                    _ => None,
                })
                .transpose()
                .ok()
                .flatten()
                .unwrap_or(StringSize::Fixed(0)); // Default for time strings
            TimeEncoding::String(StringType {
                encoding: enc.encoding.clone(),
                size,
            })
        }
        _ => {
            return Err(Error::InvalidXtce(
                "RelativeTimeParameterType has unsupported encoding type".to_string(),
            ));
        }
    };

    Ok(RelativeTimeType {
        encoding,
        offset: None, // TODO: Parse offset from XTCE if present
    })
}

fn convert_array_parameter_type(
    xml: &hermes_xtce::ArrayParameterType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::rc::Rc<Type>>,
) -> Result<ArrayType> {
    // Resolve the element type reference
    let resolved_type_name = crate::util::resolve_parameter_type_name(
        space_system_path,
        &xml.array_type_ref,
        available_types,
    )?;

    let element_type_rc = available_types.get(&resolved_type_name).ok_or_else(|| {
        Error::InvalidXtce(format!(
            "Array element type '{}' not found in available types",
            resolved_type_name
        ))
    })?;

    // Clone the Type from the Rc (arrays need owned types, not references)
    let element_type = (**element_type_rc).clone();

    // Convert dimensions
    let dimensions: Result<Vec<Dimension>> = xml
        .dimension_list
        .dimension
        .iter()
        .map(|dim| {
            Ok(Dimension {
                starting_index: crate::util::convert_integer_value(&dim.starting_index)?,
                ending_index: crate::util::convert_integer_value(&dim.ending_index)?,
            })
        })
        .collect();

    Ok(ArrayType {
        element_type: Box::new(element_type),
        dimensions: dimensions?,
    })
}

fn convert_aggregate_parameter_type(
    xml: &hermes_xtce::AggregateParameterType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::rc::Rc<Type>>,
) -> Result<AggregateType> {
    // Convert all members
    let members: Result<Vec<Member>> = xml
        .member_list
        .member
        .iter()
        .map(|member_xml| {
            // Resolve the member type reference
            let resolved_type_name = crate::util::resolve_parameter_type_name(
                space_system_path,
                &member_xml.type_ref,
                available_types,
            )?;

            let member_type_rc = available_types.get(&resolved_type_name).ok_or_else(|| {
                Error::InvalidXtce(format!(
                    "Aggregate member type '{}' not found in available types",
                    resolved_type_name
                ))
            })?;

            // Clone the Type from the Rc
            let member_type = (**member_type_rc).clone();

            Ok(Member {
                name: member_xml.name.clone(),
                type_: member_type,
            })
        })
        .collect();

    Ok(AggregateType { members: members? })
}
