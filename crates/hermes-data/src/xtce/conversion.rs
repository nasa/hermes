/// Functions for converting XTCE XML structures to internal data types
use std::collections::HashMap;
use std::sync::Arc;

use crate::Parameter;
use crate::de::{
    BooleanExpression, Comparison, ComparisonCheck, ParameterRefOrValue, RestrictionCriteria,
};

use crate::{Error, ParameterInstanceRef, ParameterRef, Result, Value};

use super::resolution::resolve_parameter_ref;

/// Get the type at the end of a member path within an aggregate parameter.
/// If member_path is None, returns the parameter's type.
/// If member_path is Some, navigates through the aggregate structure and returns the member's type.
fn get_member_type<'a>(
    parameter: &'a Parameter,
    member_path: &Option<Vec<String>>,
) -> Result<&'a crate::Type> {
    match member_path {
        None => Ok(&*parameter.type_),
        Some(path) => {
            let mut current_type = &*parameter.type_;

            for member_name in path {
                match current_type {
                    crate::Type::Aggregate(agg) => {
                        let member = agg
                            .members
                            .iter()
                            .find(|m| &m.name == member_name)
                            .ok_or_else(|| {
                                Error::InvalidXtce(format!(
                                    "Member '{}' not found in aggregate parameter '{}'",
                                    member_name, parameter.head.qualified_name
                                ))
                            })?;
                        current_type = &member.type_;
                    }
                    _ => {
                        return Err(Error::InvalidXtce(format!(
                            "Cannot access member '{}' on non-aggregate type",
                            member_name
                        )));
                    }
                }
            }

            Ok(current_type)
        }
    }
}

pub(crate) fn convert_restriction_criteria(
    xml: &hermes_xtce::RestrictionCriteriaType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<RestrictionCriteria> {
    use hermes_xtce::RestrictionCriteriaType as X;
    match xml {
        X::Comparison(comp) => Ok(RestrictionCriteria::Comparison(convert_comparison(
            comp,
            space_system_path,
            parameters,
        )?)),
        X::ComparisonList(list) => {
            let comparisons = list
                .comparison
                .iter()
                .map(|c| convert_comparison(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(RestrictionCriteria::ComparisonList(comparisons))
        }
        X::BooleanExpression(expr) => Ok(RestrictionCriteria::BooleanExpression(
            convert_boolean_expression(expr, space_system_path, parameters)?,
        )),
        X::CustomAlgorithm(_) => Err(Error::NotImplemented(
            "CustomAlgorithm in RestrictionCriteria",
        )),
        X::NextContainer(_) => Err(Error::NotImplemented(
            "NextContainer in RestrictionCriteria",
        )),
    }
}

fn convert_comparison_check(
    xml: &hermes_xtce::ComparisonCheckType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<ComparisonCheck> {
    use hermes_xtce::ComparisonCheckTypeContent as C;

    // The content array has exactly 3 elements:
    // [0]: ParameterInstanceRef (left side)
    // [1]: ComparisonOperator
    // [2]: Value or ParameterInstanceRef (right side)

    let left_param_ref_xml = match &xml.content[0] {
        C::ParameterInstanceRef(param_ref) => param_ref,
        _ => {
            return Err(Error::InvalidXtce(
                "ComparisonCheck first element must be ParameterInstanceRef".to_string(),
            ));
        }
    };

    // Resolve the left parameter reference
    let (resolved_left_ref, left_member_path) = resolve_parameter_ref(
        space_system_path,
        &left_param_ref_xml.parameter_ref,
        parameters,
    )?;

    let left = ParameterInstanceRef {
        parameter: ParameterRef {
            name: resolved_left_ref.clone(),
            member_path: left_member_path.clone(),
        },
        use_calibrated_value: left_param_ref_xml.use_calibrated_value,
    };

    let operator = match &xml.content[1] {
        C::ComparisonOperator(op) => op.clone(),
        _ => {
            return Err(Error::InvalidXtce(
                "ComparisonCheck second element must be ComparisonOperator".to_string(),
            ));
        }
    };

    let right = match &xml.content[2] {
        C::ParameterInstanceRef(param_ref) => {
            let (resolved_right_ref, right_member_path) =
                resolve_parameter_ref(space_system_path, &param_ref.parameter_ref, parameters)?;
            ParameterRefOrValue::ParameterInstanceRef(ParameterInstanceRef {
                parameter: ParameterRef {
                    name: resolved_right_ref,
                    member_path: right_member_path,
                },
                use_calibrated_value: param_ref.use_calibrated_value,
            })
        }
        C::Value(val) => {
            // Parse the value based on the left parameter's type (possibly with member path)
            let left_parameter = parameters.get(&resolved_left_ref).ok_or_else(|| {
                Error::InvalidXtce(format!(
                    "Parameter '{}' referenced in comparison check not found",
                    resolved_left_ref
                ))
            })?;

            // Get the type at the end of the member path
            let comparison_type = get_member_type(left_parameter, &left_member_path)?;

            let value = Value::parse(comparison_type, val)?;
            ParameterRefOrValue::Value(value)
        }
        _ => {
            return Err(Error::InvalidXtce(
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

/// Convert an ANDed condition from XTCE to BooleanExpression.
/// Each element in AnDedConditions can be either a Condition or nested ORedConditions.
fn convert_anded_condition(
    xml: &hermes_xtce::AnDedConditionsType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<BooleanExpression> {
    use hermes_xtce::AnDedConditionsType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
            space_system_path,
            parameters,
        )?)),
        X::ORedConditions(ors) => {
            let conditions = ors
                .iter()
                .map(|c| convert_ored_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::OrConditions(conditions))
        }
    }
}

/// Convert an ORed condition from XTCE to BooleanExpression.
/// Each element in ORedConditions can be either a Condition or nested AnDedConditions.
fn convert_ored_condition(
    xml: &hermes_xtce::ORedConditionsType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<BooleanExpression> {
    use hermes_xtce::ORedConditionsType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
            space_system_path,
            parameters,
        )?)),
        X::AnDedConditions(ands) => {
            let conditions = ands
                .iter()
                .map(|c| convert_anded_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::AndConditions(conditions))
        }
    }
}

fn convert_boolean_expression(
    xml: &hermes_xtce::BooleanExpressionType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<BooleanExpression> {
    use hermes_xtce::BooleanExpressionType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
            space_system_path,
            parameters,
        )?)),
        X::AnDedConditions(ands) => {
            let conditions = ands
                .iter()
                .map(|c| convert_anded_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::AndConditions(conditions))
        }
        X::ORedConditions(ors) => {
            let conditions = ors
                .iter()
                .map(|c| convert_ored_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::OrConditions(conditions))
        }
    }
}

fn convert_comparison(
    xml: &hermes_xtce::ComparisonType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<Comparison> {
    // Resolve the parameter reference to a fully qualified name
    let (resolved_param_ref, member_path) =
        resolve_parameter_ref(space_system_path, &xml.parameter_ref, parameters)?;

    let param_ref = ParameterInstanceRef {
        parameter: ParameterRef {
            name: resolved_param_ref.clone(),
            member_path: member_path.clone(),
        },
        use_calibrated_value: xml.use_calibrated_value,
    };

    // Look up the parameter to get its type
    let parameter = parameters.get(&resolved_param_ref).ok_or_else(|| {
        Error::InvalidXtce(format!(
            "Parameter '{}' (resolved to '{}') referenced in comparison not found",
            xml.parameter_ref, resolved_param_ref
        ))
    })?;

    // Get the type at the end of the member path
    let comparison_type = get_member_type(parameter, &member_path)?;

    // Parse the value based on the comparison type
    let value = Value::parse(comparison_type, &xml.value)?;

    Ok(Comparison {
        parameter_ref: param_ref,
        comparison_operator: xml.comparison_operator.clone(),
        value,
    })
}

/// Convert IntegerValue with resolved parameter references.
/// Used during container construction when parameters are available.
pub(crate) fn convert_integer_value(
    xml: &hermes_xtce::IntegerValueType,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<crate::IntegerValue> {
    use hermes_xtce::IntegerValueType as X;

    match xml {
        X::FixedValue(val) => Ok(crate::IntegerValue::FixedValue(*val)),
        X::DynamicValue(dyn_val) => {
            // Resolve the parameter reference to fully qualified name
            let (resolved_param_ref, member_path) = resolve_parameter_ref(
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

            Ok(crate::IntegerValue::DynamicValueParameter {
                ref_: parameter,
                linear_adjustment,
            })
        }
        X::DiscreteLookupList(_) => {
            Err(Error::NotImplemented("DiscreteLookupList in IntegerValue"))
        }
    }
}
