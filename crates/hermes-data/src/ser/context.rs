use crate::{
    ArgumentRef, Error, IntegerValue, LinearAdjustment, ParameterInstanceRef, Result, Value,
};
use std::collections::HashMap;

/// Serialization context for resolving dynamic values during serialization
pub struct SerializationContext {
    /// Argument values provided at command time
    argument_values: HashMap<String, Value>,
    /// Parameter values from telemetry (for dynamic references)
    parameter_values: HashMap<String, Value>,
}

impl SerializationContext {
    /// Create a new serialization context
    pub fn new() -> Self {
        SerializationContext {
            argument_values: HashMap::new(),
            parameter_values: HashMap::new(),
        }
    }

    /// Create a context from a map of argument values
    pub fn from_arguments(arguments: HashMap<String, Value>) -> Self {
        SerializationContext {
            argument_values: arguments,
            parameter_values: HashMap::new(),
        }
    }

    /// Add an argument value
    pub fn add_argument(&mut self, name: String, value: Value) {
        self.argument_values.insert(name, value);
    }

    /// Add a parameter value
    pub fn add_parameter(&mut self, name: String, value: Value) {
        self.parameter_values.insert(name, value);
    }

    /// Resolve an argument reference
    pub fn resolve_argument(&self, arg_ref: &ArgumentRef) -> Result<&Value> {
        self.argument_values
            .get(&arg_ref.0)
            .ok_or_else(|| Error::UnresolvedReference(arg_ref.0.clone()))
    }

    /// Resolve a parameter reference
    pub fn resolve_parameter(&self, param_ref: &ParameterInstanceRef) -> Result<&Value> {
        self.parameter_values
            .get(&param_ref.parameter.name)
            .ok_or_else(|| Error::UnresolvedReference(param_ref.parameter.name.clone()))
    }

    /// Resolve an IntegerValue (which may be fixed or dynamic)
    pub fn resolve_integer_value(&self, int_val: &IntegerValue) -> Result<i64> {
        match int_val {
            IntegerValue::FixedValue(v) => Ok(*v),
            IntegerValue::DynamicValueArgument {
                ref_,
                linear_adjustment,
            } => {
                let value = self.resolve_argument(ref_)?;
                let int_value = self.value_to_i64(value)?;
                Ok(Self::apply_linear_adjustment(
                    int_value,
                    linear_adjustment.as_ref(),
                ))
            }
            IntegerValue::DynamicValueParameter {
                ref_,
                linear_adjustment,
            } => {
                let value = self.resolve_parameter(ref_)?;
                let int_value = self.value_to_i64(value)?;
                Ok(Self::apply_linear_adjustment(
                    int_value,
                    linear_adjustment.as_ref(),
                ))
            }
        }
    }

    /// Convert a Value to i64 for integer resolution
    fn value_to_i64(&self, value: &Value) -> Result<i64> {
        match value {
            Value::SignedInteger(i) => Ok(*i),
            Value::UnsignedInteger(u) => {
                if *u > i64::MAX as u64 {
                    Err(Error::InvalidValue(format!(
                        "Unsigned value {} too large for i64",
                        u
                    )))
                } else {
                    Ok(*u as i64)
                }
            }
            _ => Err(Error::TypeValueMismatch),
        }
    }

    /// Apply linear adjustment (slope and intercept) to a value
    fn apply_linear_adjustment(value: i64, adjustment: Option<&LinearAdjustment>) -> i64 {
        if let Some(adj) = adjustment {
            ((value as f64) * adj.slope + adj.intercept) as i64
        } else {
            value
        }
    }
}

impl Default for SerializationContext {
    fn default() -> Self {
        Self::new()
    }
}
