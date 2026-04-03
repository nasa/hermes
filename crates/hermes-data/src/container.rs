use std::rc::Rc;

use crate::{IntegerValue, ParameterInstanceRef, ParameterRef, Type};

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
pub struct Parameter {
    pub head: Item,
    /// Data type of this parameter
    pub type_: Type,
    ///Describes extended properties/attributes of Parameter definitions.
    pub properties: Option<hermes_xtce::ParameterPropertiesType>,
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
    AndCondition(Vec<AndCondition>),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible.
    OrCondition(Vec<OrCondition>),
}

#[derive(Clone, Debug)]
pub struct ComparisonCheck {
    pub left: ParameterInstanceRef,
    pub operator: hermes_xtce::ComparisonOperatorsType,
    pub right: ParameterRefOrValue,
}

#[derive(Clone, Debug)]
pub enum AndCondition {
    ///Condition elements describe a test similar to the Comparison element except that the parameters used have additional flexibility for the compare.
    Condition(ComparisonCheck),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible and the and/or for multiple checks can be specified.
    ORedConditions(Vec<OrCondition>),
}

///Describe two or more conditions that are logically ored together. Conditions may be a mix of Condition and ANDedCondition.   See ORedConditionType and BooleanExpressionType.
#[derive(Clone, Debug)]
pub enum OrCondition {
    ///Condition elements describe a test similar to the Comparison element except that the parameters used have additional flexibility for the compare.
    Condition(ComparisonCheck),
    ///This element describes tests similar to the ComparisonList element except that the parameters used are more flexible and the and/or for multiple checks can be specified.
    AndCondition(Vec<AndCondition>),
}

#[derive(Clone, Debug)]
pub enum ParameterRefOrValue {
    ParameterInstanceRef(ParameterInstanceRef),
    Value(String),
}

///A simple ParameterInstanceRef to value comparison.  The string supplied in the value attribute needs to be converted to a type matching the Parameter being compared to.  For integer types it is base 10 form.  Floating point types may be specified in normal (100.0) or scientific (1.0e2) form.  The value is truncated  to use the least significant bits that match the bit size of the Parameter being compared to.
#[derive(Clone, Debug)]
pub struct Comparison {
    pub parameter_ref: ParameterInstanceRef,
    ///Operator to use for the comparison with the common equality operator as the default.
    pub comparison_operator: hermes_xtce::ComparisonOperatorsType,
    pub value: String,
}

#[derive(Clone, Debug)]
pub struct BaseContainer {
    pub parent: Rc<SequenceContainer>,
    pub restriction_criteria: Option<RestrictionCriteria>,
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
pub struct Entry {
    ///Optional short description for this entry element.
    // pub short_description: Option<String>,
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
pub struct SequenceContainer {
    pub head: Item,
    pub abstract_: bool,

    // Optional inheritance for this container from another named container.
    // This inheritance is already resolved here just the fully qualified name of the parent is held here
    pub base: Option<BaseContainer>,

    ///Number of bits this container occupies on the stream being encoded/decoded.  This is only needed to "force" the bit length of the container to be a fixed value.  In most cases, the entry list would define the size of the container.
    pub size_in_bits: Option<IntegerValue>,

    ///List of item entries to pack/encode into this container definition.
    pub entry_list: Vec<Entry>,
}

impl SequenceContainer {
    /// Create a new SequenceContainer with a resolved parent.
    ///
    /// This constructor is used during Pass 3 after all dependencies have been resolved.
    /// The parent should already be constructed and available in the completed containers map.
    pub fn new(
        xml: &hermes_xtce::SequenceContainerType,
        qualified_name: String,
        resolved_parent: Option<Rc<SequenceContainer>>,
        restriction_criteria: Option<RestrictionCriteria>,
    ) -> crate::Result<SequenceContainer> {
        // Create BaseContainer with resolved parent if present
        let base = match (resolved_parent, restriction_criteria) {
            (Some(parent), criteria) => Some(BaseContainer {
                parent,
                restriction_criteria: criteria,
            }),
            (None, _) => None,
        };

        // Convert size_in_bits if specified via binary encoding
        let size_in_bits = if let Some(encoding) = &xml.binary_encoding {
            encoding
                .size_in_bits
                .as_ref()
                .map(convert_integer_value)
                .transpose()?
        } else {
            None
        };

        // Convert entry list
        let entry_list = xml
            .entry_list
            .iter()
            .map(convert_entry)
            .collect::<crate::Result<Vec<_>>>()?;

        Ok(SequenceContainer {
            head: Item {
                name: xml.name.clone(),
                qualified_name,
                short_description: xml.short_description.clone(),
                long_description: xml.long_description.clone(),
                ancillary_data_set: xml.ancillary_data_set.clone(),
            },
            abstract_: xml.abstract_,
            base,
            size_in_bits,
            entry_list,
        })
    }
}

/// Extract restriction criteria from BaseContainer XML.
/// The parent container must be resolved separately and passed to SequenceContainer::new().
pub(crate) fn convert_base_container_restriction(
    xml: &hermes_xtce::BaseContainerType,
) -> crate::Result<Option<RestrictionCriteria>> {
    xml.restriction_criteria
        .as_ref()
        .map(convert_restriction_criteria)
        .transpose()
}

fn convert_restriction_criteria(
    xml: &hermes_xtce::RestrictionCriteriaType,
) -> crate::Result<RestrictionCriteria> {
    use hermes_xtce::RestrictionCriteriaType as X;
    match xml {
        X::Comparison(comp) => Ok(RestrictionCriteria::Comparison(convert_comparison(comp)?)),
        X::ComparisonList(list) => {
            let comparisons = list
                .comparison
                .iter()
                .map(convert_comparison)
                .collect::<crate::Result<Vec<_>>>()?;
            Ok(RestrictionCriteria::ComparisonList(comparisons))
        }
        X::BooleanExpression(expr) => Ok(RestrictionCriteria::BooleanExpression(
            convert_boolean_expression(expr)?,
        )),
        X::CustomAlgorithm(_) => Err(crate::Error::NotImplemented(
            "CustomAlgorithm in RestrictionCriteria",
        )),
        X::NextContainer(_) => Err(crate::Error::NotImplemented(
            "NextContainer in RestrictionCriteria",
        )),
    }
}

fn convert_boolean_expression(
    xml: &hermes_xtce::BooleanExpressionType,
) -> crate::Result<BooleanExpression> {
    use hermes_xtce::BooleanExpressionType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
        )?)),
        X::AnDedConditions(ands) => {
            let conditions = ands
                .iter()
                .map(convert_and_condition)
                .collect::<crate::Result<Vec<_>>>()?;
            Ok(BooleanExpression::AndCondition(conditions))
        }
        X::ORedConditions(ors) => {
            let conditions = ors
                .iter()
                .map(convert_or_condition)
                .collect::<crate::Result<Vec<_>>>()?;
            Ok(BooleanExpression::OrCondition(conditions))
        }
    }
}

fn convert_comparison_check(
    xml: &hermes_xtce::ComparisonCheckType,
) -> crate::Result<ComparisonCheck> {
    use hermes_xtce::ComparisonCheckTypeContent as C;

    // The content array has exactly 3 elements:
    // [0]: ParameterInstanceRef (left side)
    // [1]: ComparisonOperator
    // [2]: Value or ParameterInstanceRef (right side)

    let left = match &xml.content[0] {
        C::ParameterInstanceRef(param_ref) => convert_parameter_instance_ref(param_ref)?,
        _ => {
            return Err(crate::Error::InvalidXtce(
                "ComparisonCheck first element must be ParameterInstanceRef".to_string(),
            ));
        }
    };

    let operator = match &xml.content[1] {
        C::ComparisonOperator(op) => op.clone(),
        _ => {
            return Err(crate::Error::InvalidXtce(
                "ComparisonCheck second element must be ComparisonOperator".to_string(),
            ));
        }
    };

    let right = match &xml.content[2] {
        C::ParameterInstanceRef(param_ref) => {
            ParameterRefOrValue::ParameterInstanceRef(convert_parameter_instance_ref(param_ref)?)
        }
        C::Value(val) => ParameterRefOrValue::Value(val.clone()),
        _ => {
            return Err(crate::Error::InvalidXtce(
                "ComparisonCheck third element must be Value or ParameterInstanceRef".to_string(),
            ));
        }
    };

    Ok(ComparisonCheck {
        left,
        operator,
        right,
    })
}

fn convert_and_condition(xml: &hermes_xtce::AnDedConditionsType) -> crate::Result<AndCondition> {
    use hermes_xtce::AnDedConditionsType as X;
    match xml {
        X::Condition(cond) => Ok(AndCondition::Condition(convert_comparison_check(cond)?)),
        X::ORedConditions(ors) => {
            let conditions = ors
                .iter()
                .map(convert_or_condition)
                .collect::<crate::Result<Vec<_>>>()?;
            Ok(AndCondition::ORedConditions(conditions))
        }
    }
}

fn convert_or_condition(xml: &hermes_xtce::ORedConditionsType) -> crate::Result<OrCondition> {
    use hermes_xtce::ORedConditionsType as X;
    match xml {
        X::Condition(cond) => Ok(OrCondition::Condition(convert_comparison_check(cond)?)),
        X::AnDedConditions(ands) => {
            let conditions = ands
                .iter()
                .map(convert_and_condition)
                .collect::<crate::Result<Vec<_>>>()?;
            Ok(OrCondition::AndCondition(conditions))
        }
    }
}

fn convert_comparison(xml: &hermes_xtce::ComparisonType) -> crate::Result<Comparison> {
    Ok(Comparison {
        parameter_ref: ParameterInstanceRef {
            parameter: ParameterRef(xml.parameter_ref.clone()),
            use_calibrated_value: xml.use_calibrated_value,
        },
        comparison_operator: xml.comparison_operator.clone(),
        value: xml.value.clone(),
    })
}

fn convert_entry(xml: &hermes_xtce::EntryListType) -> crate::Result<Entry> {
    use hermes_xtce::EntryListType as X;

    match xml {
        X::ParameterRefEntry(param_entry) => {
            let repeat = param_entry
                .repeat_entry
                .as_ref()
                .map(convert_repeat)
                .transpose()?;

            let location = param_entry
                .location_in_container_in_bits
                .as_ref()
                .map(convert_location_in_container_in_bits)
                .transpose()?
                .unwrap_or_else(|| LocationInContainerInBits {
                    reference: ReferenceLocation::PreviousEntry,
                    location: IntegerValue {
                        value: crate::IntegerValueKind::FixedValue(0),
                        linear_adjustment: None,
                    },
                });

            // if param_entry.time_association.is_some() {
            //     return Err(crate::Error::NotImplemented("TimeAssociation in Entry"));
            // }

            // if param_entry.ancillary_data_set.is_some() {
            //     return Err(crate::Error::NotImplemented("AncillaryDataSet in Entry"));
            // }

            Ok(Entry {
                kind: EntryKind::ParameterRefEntry(ParameterRef(param_entry.parameter_ref.clone())),
                repeat,
                include_condition: param_entry.include_condition.clone(),
                location,
            })
        }
        X::ContainerRefEntry(container_entry) => {
            let repeat = container_entry
                .repeat_entry
                .as_ref()
                .map(convert_repeat)
                .transpose()?;

            let location = container_entry
                .location_in_container_in_bits
                .as_ref()
                .map(convert_location_in_container_in_bits)
                .transpose()?
                .unwrap_or_else(|| LocationInContainerInBits {
                    reference: ReferenceLocation::PreviousEntry,
                    location: IntegerValue {
                        value: crate::IntegerValueKind::FixedValue(0),
                        linear_adjustment: None,
                    },
                });

            // if container_entry.time_association.is_some() {
            //     return Err(crate::Error::NotImplemented("TimeAssociation in Entry"));
            // }

            // if container_entry.ancillary_data_set.is_some() {
            //     return Err(crate::Error::NotImplemented("AncillaryDataSet in Entry"));
            // }

            Ok(Entry {
                kind: EntryKind::ContainerRefEntry(ContainerRef(
                    container_entry.container_ref.clone(),
                )),
                repeat,
                include_condition: container_entry.include_condition.clone(),
                location,
            })
        }
        X::ParameterSegmentRefEntry(_) => {
            Err(crate::Error::NotImplemented("ParameterSegmentRefEntry"))
        }
        X::ContainerSegmentRefEntry(_) => {
            Err(crate::Error::NotImplemented("ContainerSegmentRefEntry"))
        }
        X::StreamSegmentEntry(_) => Err(crate::Error::NotImplemented("StreamSegmentEntry")),
        X::IndirectParameterRefEntry(_) => {
            Err(crate::Error::NotImplemented("IndirectParameterRefEntry"))
        }
        X::ArrayParameterRefEntry(_) => Err(crate::Error::NotImplemented("ArrayParameterRefEntry")),
    }
}

fn convert_location_in_container_in_bits(
    xml: &hermes_xtce::LocationInContainerInBitsType,
) -> crate::Result<LocationInContainerInBits> {
    use hermes_xtce::{LocationInContainerInBitsTypeContent as C, ReferenceLocationType as R};

    let reference = match xml.reference_location {
        R::ContainerStart => ReferenceLocation::ContainerStart,
        R::PreviousEntry => ReferenceLocation::PreviousEntry,
        R::ContainerEnd => {
            return Err(crate::Error::NotImplemented(
                "ReferenceLocation::ContainerEnd",
            ));
        }
        R::NextEntry => {
            return Err(crate::Error::NotImplemented("ReferenceLocation::NextEntry"));
        }
    };

    let location = match &xml.content {
        C::FixedValue(val) => IntegerValue {
            value: crate::IntegerValueKind::FixedValue(*val),
            linear_adjustment: None,
        },
        C::DynamicValue(dyn_val) => {
            let parameter = convert_parameter_instance_ref(&dyn_val.parameter_instance_ref)?;
            let linear_adjustment =
                dyn_val
                    .linear_adjustment
                    .as_ref()
                    .map(|adj| crate::LinearAdjustment {
                        slope: adj.slope,
                        intercept: adj.intercept,
                    });

            IntegerValue {
                value: crate::IntegerValueKind::DynamicValueParameter(parameter),
                linear_adjustment,
            }
        }
        C::DiscreteLookupList(_) => {
            return Err(crate::Error::NotImplemented(
                "DiscreteLookupList in LocationInContainerInBits",
            ));
        }
    };

    Ok(LocationInContainerInBits {
        reference,
        location,
    })
}

fn convert_repeat(xml: &hermes_xtce::RepeatType) -> crate::Result<Repeat> {
    let count = convert_integer_value(&xml.count)?;
    let offset = xml
        .offset
        .as_ref()
        .map(convert_integer_value)
        .transpose()?
        .unwrap_or_else(|| IntegerValue {
            value: crate::IntegerValueKind::FixedValue(0),
            linear_adjustment: None,
        });

    Ok(Repeat { count, offset })
}

fn convert_integer_value(xml: &hermes_xtce::IntegerValueType) -> crate::Result<IntegerValue> {
    use hermes_xtce::IntegerValueType as X;

    match xml {
        X::FixedValue(val) => Ok(IntegerValue {
            value: crate::IntegerValueKind::FixedValue(*val),
            linear_adjustment: None,
        }),
        X::DynamicValue(dyn_val) => {
            let parameter = convert_parameter_instance_ref(&dyn_val.parameter_instance_ref)?;
            let linear_adjustment =
                dyn_val
                    .linear_adjustment
                    .as_ref()
                    .map(|adj| crate::LinearAdjustment {
                        slope: adj.slope,
                        intercept: adj.intercept,
                    });

            Ok(IntegerValue {
                value: crate::IntegerValueKind::DynamicValueParameter(parameter),
                linear_adjustment,
            })
        }
        X::DiscreteLookupList(_) => Err(crate::Error::NotImplemented(
            "DiscreteLookupList in IntegerValue",
        )),
    }
}

fn convert_parameter_instance_ref(
    xml: &hermes_xtce::ParameterInstanceRefType,
) -> crate::Result<ParameterInstanceRef> {
    Ok(ParameterInstanceRef {
        parameter: ParameterRef(xml.parameter_ref.clone()),
        use_calibrated_value: xml.use_calibrated_value,
    })
}
