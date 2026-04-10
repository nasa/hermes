use crate::de::Context;
use crate::de::ParameterRefOrValue;
use crate::error::InvalidComparison;
use crate::{Error, ParameterInstanceRef, Value};
use tracing::warn;

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

///A simple ParameterInstanceRef to value comparison.  The string supplied in the value attribute needs to be converted to a type matching the Parameter being compared to.  For integer types it is base 10 form.  Floating point types may be specified in normal (100.0) or scientific (1.0e2) form.  The value is truncated  to use the least significant bits that match the bit size of the Parameter being compared to.
#[derive(Clone, Debug)]
pub struct Comparison {
    pub parameter_ref: ParameterInstanceRef,
    ///Operator to use for the comparison with the common equality operator as the default.
    pub comparison_operator: hermes_xtce::ComparisonOperatorsType,
    pub value: Value,
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
) -> crate::Result<bool> {
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
        (_, _) => Err(Error::InvalidComparison(Box::new(InvalidComparison {
            op: op.clone(),
            left: left.clone(),
            right: right.clone(),
        }))), // (Value::Array(l), Value::Array(r)) => {
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
    pub(crate) fn evaluate(&self, ctx: &Context) -> crate::Result<bool> {
        let left = ctx.get_parameter_instance(&self.parameter_ref)?;
        comparison(&self.comparison_operator, &left, &self.value)
    }
}

impl ComparisonCheck {
    pub(crate) fn evaluate(&self, ctx: &Context) -> crate::Result<bool> {
        let left = ctx.get_parameter_instance(&self.left)?;

        let right = match &self.right {
            ParameterRefOrValue::ParameterInstanceRef(parameter_instance_ref) => {
                ctx.get_parameter_instance(parameter_instance_ref)?
            }
            ParameterRefOrValue::Value(value) => value.clone(),
        };

        comparison(&self.operator, &left, &right)
    }
}

impl BooleanExpression {
    pub(crate) fn evaluate(&self, ctx: &Context) -> crate::Result<bool> {
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
    pub(crate) fn evaluate(&self, ctx: &Context) -> bool {
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
