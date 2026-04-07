use std::sync::Arc;

use crate::{IntegerValue, ParameterInstanceRef, ParameterRef, Value};

#[derive(Clone, Debug)]
pub struct Item {
    /// The local name of this item
    pub name: String,
    /// The fully qualified name (e.g., "/SpaceSystem/SubSystem/ItemName")
    pub qualified_name: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Optional long description
    pub long_description: Option<String>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    pub ancillary_data_set: Option<hermes_xtce::AncillaryDataSetType>,
}

#[derive(Clone, Debug)]
pub enum RestrictionCriteria {
    ///A simple comparison check involving a single test of a parameter value.
    Comparison(Comparison),
    ///A series of simple comparison checks with an implicit 'and' in that they all must be true for the overall condition to be true.
    ComparisonList(Vec<Comparison>),
    ///Verification is a boolean expression of conditions.
    BooleanExpression(BooleanExpression),
}

#[derive(Clone, Debug)]
pub enum BooleanExpression {
    ///Condition elements describe a test similar to the Comparison element except that the parameters used have additional flexibility.
    Condition(ComparisonCheck),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible.
    AndConditions(Vec<BooleanExpression>),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible.
    OrConditions(Vec<BooleanExpression>),
}

#[derive(Clone, Debug)]
pub struct ComparisonCheck {
    pub left: ParameterInstanceRef,
    pub operator: hermes_xtce::ComparisonOperatorsType,
    pub right: ParameterRefOrValue,
}

#[derive(Clone, Debug)]
pub enum ParameterRefOrValue {
    ParameterInstanceRef(ParameterInstanceRef),
    Value(Value),
}

///A simple ParameterInstanceRef to value comparison.  The string supplied in the value attribute needs to be converted to a type matching the Parameter being compared to.  For integer types it is base 10 form.  Floating point types may be specified in normal (100.0) or scientific (1.0e2) form.  The value is truncated  to use the least significant bits that match the bit size of the Parameter being compared to.
#[derive(Clone, Debug)]
pub struct Comparison {
    pub parameter_ref: ParameterInstanceRef,
    ///Operator to use for the comparison with the common equality operator as the default.
    pub comparison_operator: hermes_xtce::ComparisonOperatorsType,
    pub value: Value,
}

#[derive(Clone, Debug)]
pub enum ReferenceLocation {
    ContainerStart,
    PreviousEntry,
}

#[derive(Clone, Debug)]
pub struct LocationInContainerInBits {
    ///Defines the relative reference used to interpret the start bit position.  The default is 0 bits from the end of the previousEntry, which makes the entry contiguous.
    pub reference: ReferenceLocation,
    pub location: IntegerValue,
}

///Contains elements that describe how an Entry is identically repeated. This includes a Count of the number of appearances and an optional Offset in bits that may occur between appearances. A Count of 1 indicates no repetition. The Offset default is 0 when not specified.
#[derive(Clone, Debug)]
pub struct Repeat {
    ///Value (either fixed or dynamic) that contains the count of appearances for an Entry. The value must be positive where 1 is the same as not specifying a RepeatEntry element at all.
    pub count: IntegerValue,

    ///Value (either fixed or dynamic) that contains an optional offset in bits between repeats of the Entry. The default is 0, which is contiguous. The value must be 0 or positive. Empty offset after the last repeat count is not implicitly reserved, so the parent EntryList should consider if these are occupied bits when placing the next Entry.
    pub offset: IntegerValue,
}

#[derive(Clone, Debug)]
pub struct EntryType {
    pub kind: EntryKind,
    pub repeat: Option<Repeat>,
    pub include_condition: Option<hermes_xtce::MatchCriteriaType>,
    pub location: LocationInContainerInBits,
}

#[derive(Clone, Debug)]
pub enum EntryKind {
    ///Specify a Parameter to be a part of this container layout definition.
    ParameterRefEntry(ParameterRef),
    ///Specify the content of another Container to be a part of this container layout definition.
    ContainerRefEntry(ContainerRef),
}

#[derive(Clone, Debug)]
pub struct ContainerRef(pub String);

#[derive(Clone, Debug)]
pub struct SequenceContainerType {
    pub head: Item,
    pub abstract_: bool,

    ///Number of bits this container occupies on the stream being encoded/decoded.  This is only needed to "force" the bit length of the container to be a fixed value.  In most cases, the entry list would define the size of the container.
    pub size_in_bits: Option<IntegerValue>,

    ///List of item entries to pack/encode into this container definition.
    pub entry_list: Vec<EntryType>,

    /// References to child sequence containers
    pub children: Vec<(RestrictionCriteria, Arc<SequenceContainerType>)>,
}
