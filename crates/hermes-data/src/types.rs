use hermes_xtce::{
    BitOrderType, ByteOrderType, FloatEncodingType, IntegerEncodingType, StringEncodingType,
};

use crate::Calibrator;

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
    ///Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    ///Specifies integer numeric value to raw encoding method, with the default being "unsigned".
    pub encoding: IntegerEncodingType,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
pub struct FloatType {
    pub size_in_bits: hermes_xtce::FloatSizeInBitsType,
    ///Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    ///Specifies real/decimal numeric value to raw encoding method, with the default being "IEEE754_1985".
    pub encoding: FloatEncodingType,
    pub calibrator: Calibrator,
}

#[derive(Clone, Debug)]
pub struct StringType {
    /// Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    /// Specifies string encoding method, with the default being "UTF-8".
    pub encoding: StringEncodingType,
    /// Fixed size in bits, if applicable (None for variable-length strings)
    pub size_in_bits: Option<i64>,
}

#[derive(Clone, Debug)]
pub struct BooleanType {
    pub size_in_bits: i64,
    /// Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
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
    /// Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
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
    /// Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
    /// Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    /// Size in bits (can be fixed or dynamic)
    pub size_in_bits: IntegerValue,
}

#[derive(Clone, Debug)]
pub struct AbsoluteTimeType {
    /// The time encoding definition
    pub encoding: TimeEncoding,
    /// Reference epoch for time calculations
    pub epoch: Epoch,
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
pub enum Epoch {
    TAI,   // CCSDS standard
    J2000, // 2000-01-01T12:00:00 TT
    Unix,  // 1970-01-01T00:00:00 UTC (also POSIX)
    GPS,   // 1980-01-06T00:00:00 UTC
    UserDefined { date_time: String },
    // TODO(tumbar) Define integrations with SPICE
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
