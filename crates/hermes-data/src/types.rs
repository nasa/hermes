use hermes_xtce::{
    AncillaryDataSetType, BitOrderType, ByteOrderType, FloatEncodingType, IntegerEncodingType
    , SplinePointType, TermType,
};

use crate::Calibrator;

/// Common metadata for all named XTCE items
#[derive(Clone, Debug)]
pub struct NamedItem {
    /// The local name of this item
    pub name: String,
    /// The fully qualified name (e.g., "/SpaceSystem/SubSystem/ItemName")
    pub qualified_name: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Optional long description
    pub long_description: Option<String>,
}

#[derive(Clone, Debug)]
pub struct IntegerType {
    size_in_bits: i64,
    signed: bool,
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
    size_in_bits: i64,
    ///Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    ///Specifies real/decimal numeric value to raw encoding method, with the default being "IEEE754_1985".
    pub encoding: FloatEncodingType,
}

#[derive(Clone, Debug)]
pub struct StringType {
    size_in_bits: i64,
    ///Describes the bit ordering of the encoded value.
    pub bit_order: BitOrderType,
    ///Describes the endianness of the encoded value.
    pub byte_order: ByteOrderType,
    ///Specifies real/decimal numeric value to raw encoding method, with the default being "IEEE754_1985".
    pub encoding: FloatEncodingType,
}

#[derive(Clone, Debug)]
pub enum Type {
    Integer(IntegerType),
    Float(FloatType),
    // String(StringParameterType),
    // Boolean(BooleanParameterType),
    // Binary(BinaryParameterType),
    // Enumerated(EnumeratedParameterType),
    // AbsoluteTime(AbsoluteTimeParameterType),
    // RelativeTime(RelativeTimeParameterType),
    // Array(ArrayParameterType),
    // Aggregate(AggregateParameterType),
}

#[derive(Clone, Debug)]
pub struct Parameter {
    metadata: NamedItem,
    units: Option<String>,
}

/// ParameterType is the description of something that can have a value
#[derive(Clone, Debug)]
pub enum ParameterType {
    Integer(IntegerParameterType),
    Float(FloatParameterType),
    String(StringParameterType),
    Boolean(BooleanParameterType),
    Binary(BinaryParameterType),
    Enumerated(EnumeratedParameterType),
    AbsoluteTime(AbsoluteTimeParameterType),
    RelativeTime(RelativeTimeParameterType),
    Array(ArrayParameterType),
    Aggregate(AggregateParameterType),
}

#[derive(Clone, Debug)]
pub struct IntegerParameterType {
    pub base: IntegerType,
}

#[derive(Clone, Debug)]
pub struct FloatParameterType {
    pub metadata: NamedItem,
    /// Size in bits (inherited/resolved)
    pub size_in_bits: i64,
    /// Initial value in calibrated form
    pub initial_value: Option<f64>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::FloatDataEncodingType>,
    /// Unit of measure
    pub unit: Option<String>,
}

#[derive(Clone, Debug)]
pub struct StringParameterType {
    pub metadata: NamedItem,
    /// Initial value
    pub initial_value: Option<String>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::StringDataEncodingType>,
}

#[derive(Clone, Debug)]
pub struct BooleanParameterType {
    pub metadata: NamedItem,
    /// String representation for "true"
    pub one_string_value: Option<String>,
    /// String representation for "false"
    pub zero_string_value: Option<String>,
    /// Initial value
    pub initial_value: Option<bool>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::BooleanDataType>,
}

#[derive(Clone, Debug)]
pub struct BinaryParameterType {
    pub metadata: NamedItem,
    /// Initial value as hex string
    pub initial_value: Option<String>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::BinaryDataEncodingType>,
}

#[derive(Clone, Debug)]
pub struct EnumeratedParameterType {
    pub metadata: NamedItem,
    /// Initial value (enumeration label)
    pub initial_value: Option<String>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::IntegerDataEncodingType>,
    /// Enumeration list (inherited/resolved)
    pub enumeration_list: Option<hermes_xtce::EnumerationListType>,
    /// Unit of measure
    pub unit: Option<String>,
}

#[derive(Clone, Debug)]
pub struct AbsoluteTimeParameterType {
    pub metadata: NamedItem,
    /// Initial value
    pub initial_value: Option<String>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::IntegerDataEncodingType>,
    /// Reference time/epoch information
    pub reference_time: Option<hermes_xtce::ReferenceTimeType>,
}

#[derive(Clone, Debug)]
pub struct RelativeTimeParameterType {
    pub metadata: NamedItem,
    /// Initial value
    pub initial_value: Option<f64>,
    /// Encoding information (inherited/resolved)
    pub encoding: Option<hermes_xtce::IntegerDataEncodingType>,
    /// Reference time information
    pub reference_time: Option<hermes_xtce::ReferenceTimeType>,
}

#[derive(Clone, Debug)]
pub struct ArrayParameterType {
    pub metadata: NamedItem,
    /// The element type (fully qualified name)
    pub element_type_ref: String,
    /// Number of dimensions
    pub number_of_dimensions: i32,
    /// Size of each dimension
    pub dimension_sizes: Vec<ArrayDimension>,
}

#[derive(Clone, Debug)]
pub struct ArrayDimension {
    /// Starting index
    pub starting_index: Option<i32>,
    /// Ending index
    pub ending_index: Option<i32>,
}

#[derive(Clone, Debug)]
pub struct AggregateParameterType {
    pub metadata: NamedItem,
    /// List of members with their types
    pub members: Vec<AggregateMember>,
}

#[derive(Clone, Debug)]
pub struct AggregateMember {
    /// Member name
    pub name: String,
    /// Type reference (fully qualified name)
    pub type_ref: String,
    /// Optional short description
    pub short_description: Option<String>,
}

// ============================================================================
// Resolved Arguments (similar structure to parameters, for commands)
// ============================================================================

/// A fully resolved argument type with inheritance flattened
#[derive(Clone, Debug)]
pub enum ResolvedArgumentType {
    Integer(ResolvedIntegerArgumentType),
    Float(ResolvedFloatArgumentType),
    String(ResolvedStringArgumentType),
    Boolean(ResolvedBooleanArgumentType),
    Binary(ResolvedBinaryArgumentType),
    Enumerated(ResolvedEnumeratedArgumentType),
    AbsoluteTime(ResolvedAbsoluteTimeArgumentType),
    RelativeTime(ResolvedRelativeTimeArgumentType),
    Array(ResolvedArrayArgumentType),
    Aggregate(ResolvedAggregateArgumentType),
}

// Argument types mirror parameter types but are for command arguments
#[derive(Clone, Debug)]
pub struct ResolvedIntegerArgumentType {
    pub metadata: NamedItem,
    pub size_in_bits: i64,
    pub signed: bool,
    pub initial_value: Option<i64>,
    pub encoding: Option<hermes_xtce::IntegerDataEncodingType>,
    pub unit: Option<String>,
}

#[derive(Clone, Debug)]
pub struct ResolvedFloatArgumentType {
    pub metadata: NamedItem,
    pub size_in_bits: i64,
    pub initial_value: Option<f64>,
    pub encoding: Option<hermes_xtce::FloatDataEncodingType>,
    pub unit: Option<String>,
}

#[derive(Clone, Debug)]
pub struct ResolvedStringArgumentType {
    pub metadata: NamedItem,
    pub initial_value: Option<String>,
    pub encoding: Option<hermes_xtce::StringDataEncodingType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedBooleanArgumentType {
    pub metadata: NamedItem,
    pub one_string_value: Option<String>,
    pub zero_string_value: Option<String>,
    pub initial_value: Option<bool>,
    pub encoding: Option<hermes_xtce::BooleanDataEncodingType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedBinaryArgumentType {
    pub metadata: NamedItem,
    pub initial_value: Option<String>,
    pub encoding: Option<hermes_xtce::BinaryDataEncodingType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedEnumeratedArgumentType {
    pub metadata: NamedItem,
    pub initial_value: Option<String>,
    pub encoding: Option<IntegerDataEncodingType>,
    pub enumeration_list: Option<EnumerationListType>,
    pub unit: Option<String>,
}

#[derive(Clone, Debug)]
pub struct ResolvedAbsoluteTimeArgumentType {
    pub metadata: NamedItem,
    pub initial_value: Option<String>,
    pub encoding: Option<IntegerDataEncodingType>,
    pub reference_time: Option<hermes_xtce::ReferenceTimeType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedRelativeTimeArgumentType {
    pub metadata: NamedItem,
    pub initial_value: Option<f64>,
    pub encoding: Option<IntegerDataEncodingType>,
    pub reference_time: Option<hermes_xtce::ReferenceTimeType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedArrayArgumentType {
    pub metadata: NamedItem,
    pub element_type_ref: String,
    pub number_of_dimensions: i32,
    pub dimension_sizes: Vec<ArrayDimension>,
}

#[derive(Clone, Debug)]
pub struct ResolvedAggregateArgumentType {
    pub metadata: NamedItem,
    pub members: Vec<AggregateMember>,
}

// ============================================================================
// Resolved Parameters and Arguments
// ============================================================================

/// A fully resolved parameter (instance of a parameter type)
#[derive(Clone, Debug)]
pub struct ResolvedParameter {
    pub metadata: NamedItem,
    /// Fully qualified name of the parameter type
    pub parameter_type_ref: String,
    /// Initial value (if different from type's initial value)
    pub initial_value: Option<String>,
}

/// A fully resolved argument (instance of an argument type)
#[derive(Clone, Debug)]
pub struct ResolvedArgument {
    pub metadata: NamedItem,
    /// Fully qualified name of the argument type
    pub argument_type_ref: String,
    /// Initial value (if different from type's initial value)
    pub initial_value: Option<String>,
}

// ============================================================================
// Resolved Containers
// ============================================================================

/// A fully resolved sequence container with inheritance flattened
#[derive(Clone, Debug)]
pub struct ResolvedContainer {
    pub metadata: NamedItem,
    /// Whether this is an abstract container
    pub abstract_: bool,
    /// Idle pattern for unallocated space
    pub idle_pattern: Option<String>,
    /// Flattened list of entries (includes inherited entries from base container)
    pub entries: Vec<ResolvedContainerEntry>,
    /// Restriction criteria (if this container was inherited with conditions)
    pub restriction_criteria: Option<hermes_xtce::RestrictionCriteriaType>,
}

/// A resolved container entry (parameter reference with location)
#[derive(Clone, Debug)]
pub enum ResolvedContainerEntry {
    ParameterRef(ResolvedParameterRefEntry),
    ArgumentRef(ResolvedArgumentRefEntry),
    ContainerRef(ResolvedContainerRefEntry),
    FixedValue(ResolvedFixedValueEntry),
    // Add other entry types as needed
}

#[derive(Clone, Debug)]
pub struct ResolvedParameterRefEntry {
    /// Fully qualified name of the parameter
    pub parameter_ref: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Location in container
    pub location_in_container_in_bits: Option<LocationInContainerInBitsType>,
    /// Repeat entry information
    pub repeat: Option<RepeatInfo>,
    /// Include condition
    pub include_condition: Option<hermes_xtce::MatchCriteriaType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedArgumentRefEntry {
    /// Fully qualified name of the argument
    pub argument_ref: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Location in container
    pub location_in_container_in_bits: Option<LocationInContainerInBitsType>,
    /// Repeat entry information
    pub repeat: Option<RepeatInfo>,
    /// Include condition
    pub include_condition: Option<hermes_xtce::MatchCriteriaType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedContainerRefEntry {
    /// Fully qualified name of the container
    pub container_ref: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Location in container
    pub location_in_container_in_bits: Option<LocationInContainerInBitsType>,
}

#[derive(Clone, Debug)]
pub struct ResolvedFixedValueEntry {
    /// Entry name
    pub name: String,
    /// Binary value (hex string)
    pub binary_value: String,
    /// Size in bits
    pub size_in_bits: i64,
    /// Location in container
    pub location_in_container_in_bits: Option<LocationInContainerInBitsType>,
}

#[derive(Clone, Debug)]
pub struct RepeatInfo {
    /// Number of times to repeat
    pub count: Option<i64>,
    /// Offset between repetitions (in bits)
    pub offset_size_in_bits: Option<i64>,
}
