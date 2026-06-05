use serde::{Deserialize, Deserializer, Serialize};
use serde_with::skip_serializing_none;
use std::str::FromStr;

/// A qualified name with optional namespace
#[skip_serializing_none]
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct NamedObjectId {
    /// Optional namespace
    pub namespace: Option<String>,
    /// Object name
    pub name: String,
}

impl NamedObjectId {
    /// Create a new NamedObjectId with just a name
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            namespace: None,
            name: name.into(),
        }
    }

    /// Create a new NamedObjectId with namespace and name
    pub fn with_namespace(namespace: impl Into<String>, name: impl Into<String>) -> Self {
        Self {
            namespace: Some(namespace.into()),
            name: name.into(),
        }
    }
}

/// A value type that can hold different kinds of data
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Value {
    /// Aggregate (struct-like) value
    #[serde(rename_all = "camelCase")]
    Aggregate { aggregate_value: AggregateValue },
    /// Array of values
    #[serde(rename_all = "camelCase")]
    Array { array_value: Vec<Value> },
    /// Binary data (base64 encoded)
    #[serde(rename_all = "camelCase")]
    Binary { binary_value: String },
    /// Boolean value
    #[serde(rename_all = "camelCase")]
    Boolean { boolean_value: bool },
    /// 64-bit floating point
    #[serde(rename_all = "camelCase")]
    Double { double_value: f64 },
    /// Enumerated value (string label)
    #[serde(rename_all = "camelCase")]
    Enumerated { string_value: String },
    /// 32-bit floating point
    #[serde(rename_all = "camelCase")]
    Float { float_value: f32 },
    /// No value
    None,
    /// Signed 32-bit integer
    #[serde(rename_all = "camelCase")]
    Sint32 { sint32_value: i32 },
    /// Signed 64-bit integer
    #[serde(rename_all = "camelCase")]
    Sint64 {
        #[serde(deserialize_with = "deserialize_string_or_number")]
        sint64_value: i64,
    },
    /// String value
    #[serde(rename_all = "camelCase")]
    String { string_value: String },
    /// Timestamp (microseconds since Unix epoch)
    #[serde(rename_all = "camelCase")]
    Timestamp {
        #[serde(deserialize_with = "deserialize_string_or_number")]
        timestamp_value: i64,
    },
    /// Unsigned 32-bit integer
    #[serde(rename_all = "camelCase")]
    Uint32 { uint32_value: u32 },
    /// Unsigned 64-bit integer
    #[serde(rename_all = "camelCase")]
    Uint64 { uint64_value: u64 },
}

/// Aggregate (struct-like) value containing named fields
#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AggregateValue {
    /// Field names
    pub name: Vec<String>,
    /// Field values
    pub value: Vec<Value>,
}

/// Monitoring result/alarm level for a parameter
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum MonitoringResult {
    #[serde(rename = "DISABLED")]
    Disabled,
    #[serde(rename = "IN_LIMITS")]
    InLimits,
    #[serde(rename = "WATCH")]
    Watch,
    #[serde(rename = "WARNING")]
    Warning,
    #[serde(rename = "DISTRESS")]
    Distress,
    #[serde(rename = "CRITICAL")]
    Critical,
    #[serde(rename = "SEVERE")]
    Severe,
}

impl Value {
    /// Create a boolean value
    pub fn boolean(value: bool) -> Self {
        Value::Boolean {
            boolean_value: value,
        }
    }

    /// Create a string value
    pub fn string(value: impl Into<String>) -> Self {
        Value::String {
            string_value: value.into(),
        }
    }

    /// Create a double value
    pub fn double(value: f64) -> Self {
        Value::Double {
            double_value: value,
        }
    }

    /// Create a float value
    pub fn float(value: f32) -> Self {
        Value::Float { float_value: value }
    }

    /// Create a signed 32-bit integer value
    pub fn sint32(value: i32) -> Self {
        Value::Sint32 {
            sint32_value: value,
        }
    }

    /// Create a signed 64-bit integer value
    pub fn sint64(value: i64) -> Self {
        Value::Sint64 {
            sint64_value: value,
        }
    }

    /// Create an unsigned 32-bit integer value
    pub fn uint32(value: u32) -> Self {
        Value::Uint32 {
            uint32_value: value,
        }
    }

    /// Create an unsigned 64-bit integer value
    pub fn uint64(value: u64) -> Self {
        Value::Uint64 {
            uint64_value: value,
        }
    }

    /// Create a timestamp value
    pub fn timestamp(value: i64) -> Self {
        Value::Timestamp {
            timestamp_value: value,
        }
    }

    /// Create a binary value (base64 encoded)
    pub fn binary(value: impl Into<String>) -> Self {
        Value::Binary {
            binary_value: value.into(),
        }
    }

    /// Create an array value
    pub fn array(values: Vec<Value>) -> Self {
        Value::Array {
            array_value: values,
        }
    }
}

/// Deserialize a value that can be either a string or a number into T
pub fn deserialize_string_or_number<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: Deserializer<'de>,
    T: FromStr + Deserialize<'de>,
    T::Err: std::fmt::Display,
{
    #[derive(Deserialize)]
    #[serde(untagged)]
    enum StringOrNumber<T> {
        String(String),
        Number(T),
    }

    match StringOrNumber::<T>::deserialize(deserializer)? {
        StringOrNumber::String(s) => T::from_str(&s).map_err(serde::de::Error::custom),
        StringOrNumber::Number(n) => Ok(n),
    }
}

/// Deserialize an optional value that can be either a string or a number into Option<T>
pub fn deserialize_optional_string_or_number<'de, D, T>(
    deserializer: D,
) -> Result<Option<T>, D::Error>
where
    D: Deserializer<'de>,
    T: FromStr + Deserialize<'de>,
    T::Err: std::fmt::Display,
{
    #[derive(Deserialize)]
    #[serde(untagged)]
    enum StringOrNumber<T> {
        String(String),
        Number(T),
    }

    match Option::<StringOrNumber<T>>::deserialize(deserializer)? {
        Some(StringOrNumber::String(s)) => {
            T::from_str(&s).map(Some).map_err(serde::de::Error::custom)
        }
        Some(StringOrNumber::Number(n)) => Ok(Some(n)),
        None => Ok(None),
    }
}
