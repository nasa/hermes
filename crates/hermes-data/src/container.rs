use std::sync::Arc;

use crate::{Error, IntegerValue, ParameterInstanceRef, ParameterRef, Result, Value};

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

impl SequenceContainerType {
    /// Create a new SequenceContainer without parent/child relationships.
    ///
    /// This constructor is used during the first pass of container construction.
    /// Children are added in a second pass after all containers are created.
    pub(crate) fn new(
        xml: hermes_xtce::SequenceContainerType,
        qualified_name: String,
        space_system_path: &str,
        parameters: &std::collections::HashMap<String, std::sync::Arc<crate::Parameter>>,
        containers: &std::collections::HashMap<String, crate::util::UnresolvedContainer>,
    ) -> Result<SequenceContainerType> {
        // Convert size_in_bits if specified via binary encoding
        let size_in_bits = if let Some(encoding) = &xml.binary_encoding {
            encoding
                .size_in_bits
                .as_ref()
                .map(|iv| crate::util::convert_integer_value(iv, space_system_path, parameters))
                .transpose()?
        } else {
            None
        };

        // Convert entry list with parameter and container reference resolution
        let entry_list = xml
            .entry_list
            .into_iter()
            .map(|e| convert_entry(e, space_system_path, parameters, containers))
            .collect::<Result<Vec<_>>>()?;

        Ok(SequenceContainerType {
            head: Item {
                name: xml.name.clone(),
                qualified_name,
                short_description: xml.short_description.clone(),
                long_description: xml.long_description.clone(),
                ancillary_data_set: xml.ancillary_data_set.clone(),
            },
            abstract_: xml.abstract_,
            size_in_bits,
            entry_list,
            children: vec![],
        })
    }
}

fn convert_location_in_bits(
    loc: Option<hermes_xtce::LocationInContainerInBitsType>,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, std::sync::Arc<crate::Parameter>>,
) -> Result<LocationInContainerInBits> {
    Ok(loc
        .as_ref()
        .map(|l| convert_location_in_container_in_bits(l, space_system_path, parameters))
        .transpose()?
        .unwrap_or_else(|| LocationInContainerInBits {
            reference: ReferenceLocation::PreviousEntry,
            location: IntegerValue::FixedValue(0),
        }))
}

fn convert_entry(
    xml: hermes_xtce::EntryListType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, std::sync::Arc<crate::Parameter>>,
    containers: &std::collections::HashMap<String, crate::util::UnresolvedContainer>,
) -> Result<EntryType> {
    use hermes_xtce::EntryListType as X;

    match xml {
        X::ParameterRefEntry(param_entry) => {
            let repeat = param_entry
                .repeat_entry
                .as_ref()
                .map(|r| convert_repeat(r, space_system_path, parameters))
                .transpose()?;

            // if param_entry.time_association.is_some() {
            //     return Err(crate::Error::NotImplemented("TimeAssociation in Entry"));
            // }

            // if param_entry.ancillary_data_set.is_some() {
            //     return Err(crate::Error::NotImplemented("AncillaryDataSet in Entry"));
            // }

            // Resolve parameter ref to fully qualified name
            let (resolved_param_ref, member_path) = crate::util::resolve_parameter_ref(
                space_system_path,
                &param_entry.parameter_ref,
                parameters,
            )?;

            // Entry parameter refs should not have member paths
            if member_path.is_some() {
                return Err(crate::Error::InvalidXtce(format!(
                    "Parameter entry '{}' contains member path, which is not supported in container entries",
                    param_entry.parameter_ref
                )));
            }

            Ok(EntryType {
                kind: EntryKind::ParameterRefEntry(ParameterRef {
                    name: resolved_param_ref,
                    member_path: None,
                }),
                repeat,
                include_condition: param_entry.include_condition.clone(),
                location: convert_location_in_bits(
                    param_entry.location_in_container_in_bits,
                    space_system_path,
                    parameters,
                )?,
            })
        }
        X::ContainerRefEntry(container_entry) => {
            let repeat = container_entry
                .repeat_entry
                .as_ref()
                .map(|r| convert_repeat(r, space_system_path, parameters))
                .transpose()?;

            // if container_entry.time_association.is_some() {
            //     return Err(crate::Error::NotImplemented("TimeAssociation in Entry"));
            // }

            // if container_entry.ancillary_data_set.is_some() {
            //     return Err(crate::Error::NotImplemented("AncillaryDataSet in Entry"));
            // }

            // Resolve container reference to fully qualified name
            let resolved_container_ref = crate::util::resolve_container_reference(
                space_system_path,
                &container_entry.container_ref,
                containers,
            )?;

            Ok(EntryType {
                kind: EntryKind::ContainerRefEntry(ContainerRef(resolved_container_ref)),
                repeat,
                include_condition: container_entry.include_condition.clone(),
                location: convert_location_in_bits(
                    container_entry.location_in_container_in_bits,
                    space_system_path,
                    parameters,
                )?,
            })
        }
        X::ParameterSegmentRefEntry(_) => Err(Error::NotImplemented("ParameterSegmentRefEntry")),
        X::ContainerSegmentRefEntry(_) => Err(Error::NotImplemented("ContainerSegmentRefEntry")),
        X::StreamSegmentEntry(_) => Err(Error::NotImplemented("StreamSegmentEntry")),
        X::IndirectParameterRefEntry(_) => Err(Error::NotImplemented("IndirectParameterRefEntry")),
        X::ArrayParameterRefEntry(_) => Err(Error::NotImplemented("ArrayParameterRefEntry")),
    }
}

fn convert_location_in_container_in_bits(
    xml: &hermes_xtce::LocationInContainerInBitsType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, std::sync::Arc<crate::Parameter>>,
) -> Result<LocationInContainerInBits> {
    use hermes_xtce::{LocationInContainerInBitsTypeContent as C, ReferenceLocationType as R};

    let reference = match xml.reference_location {
        R::ContainerStart => ReferenceLocation::ContainerStart,
        R::PreviousEntry => ReferenceLocation::PreviousEntry,
        R::ContainerEnd => {
            return Err(Error::NotImplemented("ReferenceLocation::ContainerEnd"));
        }
        R::NextEntry => {
            return Err(Error::NotImplemented("ReferenceLocation::NextEntry"));
        }
    };

    let location = match &xml.content {
        C::FixedValue(val) => IntegerValue::FixedValue(*val),
        C::DynamicValue(dyn_val) => {
            // Resolve the parameter reference to fully qualified name
            let (resolved_param_ref, member_path) = crate::util::resolve_parameter_ref(
                space_system_path,
                &dyn_val.parameter_instance_ref.parameter_ref,
                parameters,
            )?;

            let parameter = ParameterInstanceRef {
                parameter: ParameterRef {
                    name: resolved_param_ref,
                    member_path,
                },
                use_calibrated_value: dyn_val.parameter_instance_ref.use_calibrated_value,
            };
            let linear_adjustment =
                dyn_val
                    .linear_adjustment
                    .as_ref()
                    .map(|adj| crate::LinearAdjustment {
                        slope: adj.slope,
                        intercept: adj.intercept,
                    });

            IntegerValue::DynamicValueParameter {
                ref_: parameter,
                linear_adjustment,
            }
        }
        C::DiscreteLookupList(_) => {
            return Err(Error::NotImplemented(
                "DiscreteLookupList in LocationInContainerInBits",
            ));
        }
    };

    Ok(LocationInContainerInBits {
        reference,
        location,
    })
}

fn convert_repeat(
    xml: &hermes_xtce::RepeatType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, std::sync::Arc<crate::Parameter>>,
) -> Result<Repeat> {
    let count = crate::util::convert_integer_value(&xml.count, space_system_path, parameters)?;
    let offset = xml
        .offset
        .as_ref()
        .map(|iv| crate::util::convert_integer_value(iv, space_system_path, parameters))
        .transpose()?
        .unwrap_or(IntegerValue::FixedValue(0));

    Ok(Repeat { count, offset })
}
