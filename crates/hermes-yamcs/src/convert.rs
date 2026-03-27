use chrono::{DateTime, Utc};
use hermes_pb::*;
use prost_types::Timestamp;
use std::collections::HashMap;
use tonic::Status;

/// Convert Hermes CommandValue to YAMCS IssueCommandOptions
pub fn command_value_to_yamcs(
    cmd_value: &CommandValue,
    cmd_def: &CommandDef,
) -> Result<yamcs_http::types::monitoring::IssueCommandOptions, Status> {
    let mut args = HashMap::new();

    // Convert each argument
    for (i, arg_value) in cmd_value.args.iter().enumerate() {
        if i >= cmd_def.arguments.len() {
            return Err(Status::invalid_argument(format!(
                "Too many arguments: expected {}, got {}",
                cmd_def.arguments.len(),
                cmd_value.args.len()
            )));
        }

        let arg_def = &cmd_def.arguments[i];
        let json_value = hermes_value_to_json(arg_value)?;
        args.insert(arg_def.name.clone(), json_value);
    }

    let mut options = yamcs_http::types::monitoring::IssueCommandOptions {
        args: Some(args),
        ..Default::default()
    };

    // Copy metadata fields
    if let Some(origin) = cmd_value.metadata.get("origin") {
        options.origin = Some(origin.clone());
    }
    if let Some(comment) = cmd_value.metadata.get("comment") {
        options.comment = Some(comment.clone());
    }

    Ok(options)
}

/// Convert Hermes Value to JSON value
fn hermes_value_to_json(value: &Value) -> Result<serde_json::Value, Status> {
    if let Some(ref v) = value.value {
        match v {
            value::Value::I(i) => Ok(serde_json::Value::Number((*i).into())),
            value::Value::U(u) => Ok(serde_json::Value::Number((*u).into())),
            value::Value::F(f) => serde_json::Number::from_f64(*f)
                .map(serde_json::Value::Number)
                .ok_or_else(|| Status::invalid_argument("Invalid float value")),
            value::Value::B(b) => Ok(serde_json::Value::Bool(*b)),
            value::Value::S(s) => Ok(serde_json::Value::String(s.clone())),
            value::Value::E(e) => {
                // For enums, use the raw value
                Ok(serde_json::Value::Number(e.raw.into()))
            }
            value::Value::O(obj) => {
                let mut map = serde_json::Map::new();
                for (key, val) in &obj.o {
                    map.insert(key.clone(), hermes_value_to_json(val)?);
                }
                Ok(serde_json::Value::Object(map))
            }
            value::Value::A(arr) => {
                let values: Result<Vec<_>, _> =
                    arr.value.iter().map(hermes_value_to_json).collect();
                Ok(serde_json::Value::Array(values?))
            }
            value::Value::R(_bytes) => {
                // For bytes, convert to base64 string
                Err(Status::unimplemented(
                    "Bytes conversion not yet implemented",
                ))
            }
        }
    } else {
        Ok(serde_json::Value::Null)
    }
}

/// Convert YAMCS Event to Hermes SourcedEvent
pub fn yamcs_event_to_hermes(
    yamcs_event: &yamcs_http::types::events::Event,
    filter: &BusFilter,
) -> Result<Option<SourcedEvent>, Status> {
    // Apply source filter
    if !filter.source.is_empty() && filter.source != yamcs_event.source {
        return Ok(None);
    }

    // Apply name filter (match against event type)
    if !filter.names.is_empty() && !filter.names.contains(&yamcs_event.event_type) {
        return Ok(None);
    }

    // Parse generation time
    let time = parse_yamcs_time(&yamcs_event.generation_time)?;

    // Map YAMCS severity to Hermes severity
    let severity = match yamcs_event.severity {
        yamcs_http::types::events::EventSeverity::Info => EvrSeverity::EvrActivityLow,
        yamcs_http::types::events::EventSeverity::Watch => EvrSeverity::EvrActivityHigh,
        yamcs_http::types::events::EventSeverity::Warning => EvrSeverity::EvrWarningLow,
        yamcs_http::types::events::EventSeverity::Distress => EvrSeverity::EvrWarningHigh,
        yamcs_http::types::events::EventSeverity::Critical => EvrSeverity::EvrCommand,
        yamcs_http::types::events::EventSeverity::Severe => EvrSeverity::EvrFatal,
        yamcs_http::types::events::EventSeverity::Error => EvrSeverity::EvrFatal,
    };

    // Build event reference
    let event_ref = EventRef {
        id: yamcs_event.seq_number as i32,
        name: yamcs_event.event_type.clone(),
        component: yamcs_event.source.clone(),
        severity: severity as i32,
        arguments: vec![],
        dictionary: String::new(),
    };

    // Convert extra fields to tags
    let mut tags = HashMap::new();
    if let Some(ref extra) = yamcs_event.extra {
        for (key, val) in extra {
            tags.insert(
                key.clone(),
                Value {
                    value: Some(value::Value::S(val.clone())),
                },
            );
        }
    }

    let event = Event {
        r#ref: Some(event_ref),
        time: Some(time),
        message: yamcs_event.message.clone(),
        args: vec![],
        tags,
    };

    let sourced_event = SourcedEvent {
        event: Some(event),
        source: yamcs_event.source.clone(),
        context: SourceContext::Realtime as i32,
    };

    Ok(Some(sourced_event))
}

/// Convert YAMCS ParameterValue to Hermes SourcedTelemetry
pub fn yamcs_param_to_hermes(
    param: &yamcs_http::types::monitoring::ParameterValue,
    filter: &BusFilter,
) -> Result<Option<SourcedTelemetry>, Status> {
    // Build full parameter name
    let param_name = param.id.name.clone();

    // Apply name filter
    if !filter.names.is_empty()
        && !filter.names.contains(&param_name)
        && !filter.names.contains(&"*".to_string())
    {
        return Ok(None);
    }

    // Parse generation time
    let time = parse_yamcs_time(&param.generation_time)?;

    // Convert YAMCS value to Hermes value
    let value = yamcs_value_to_hermes(&param.eng_value)?;

    // Build telemetry reference
    let telem_ref = TelemetryRef {
        id: param.numeric_id as i32,
        name: param_name.clone(),
        component: param.id.namespace.clone().unwrap_or_default(),
        dictionary: String::new(),
    };

    let telemetry = Telemetry {
        r#ref: Some(telem_ref),
        time: Some(time),
        value: Some(value),
        labels: HashMap::default(),
    };

    let sourced_telemetry = SourcedTelemetry {
        telemetry: Some(telemetry),
        source: filter.source.clone(),
        context: SourceContext::Realtime as i32,
    };

    Ok(Some(sourced_telemetry))
}

/// Convert YAMCS Value to Hermes Value
fn yamcs_value_to_hermes(yamcs_value: &yamcs_http::Value) -> Result<Value, Status> {
    match yamcs_value {
        yamcs_http::Value::Float { float_value } => Ok(Value {
            value: Some(value::Value::F(*float_value as f64)),
        }),
        yamcs_http::Value::Double { double_value } => Ok(Value {
            value: Some(value::Value::F(*double_value)),
        }),
        yamcs_http::Value::Uint32 { uint32_value } => Ok(Value {
            value: Some(value::Value::U(*uint32_value as u64)),
        }),
        yamcs_http::Value::Sint32 { sint32_value } => Ok(Value {
            value: Some(value::Value::I(*sint32_value as i64)),
        }),
        yamcs_http::Value::Uint64 { uint64_value } => Ok(Value {
            value: Some(value::Value::U(*uint64_value)),
        }),
        yamcs_http::Value::Sint64 { sint64_value } => Ok(Value {
            value: Some(value::Value::I(*sint64_value)),
        }),
        yamcs_http::Value::Boolean { boolean_value } => Ok(Value {
            value: Some(value::Value::B(*boolean_value)),
        }),
        yamcs_http::Value::String { string_value } => Ok(Value {
            value: Some(value::Value::S(string_value.clone())),
        }),
        yamcs_http::Value::Binary { binary_value } => {
            // Binary is base64 encoded, decode it
            let decoded =
                base64::Engine::decode(&base64::engine::general_purpose::STANDARD, binary_value)
                    .map_err(|e| Status::invalid_argument(format!("Invalid base64: {}", e)))?;
            Ok(Value {
                value: Some(value::Value::R(BytesValue {
                    kind: NumberKind::NumberU8 as i32,
                    big_endian: false,
                    value: decoded,
                })),
            })
        }
        yamcs_http::Value::Timestamp { timestamp_value } => {
            // Convert timestamp to string
            Ok(Value {
                value: Some(value::Value::S(format!("{}", timestamp_value))),
            })
        }
        yamcs_http::Value::Aggregate { aggregate_value } => {
            // Convert aggregate to object
            let mut obj = HashMap::new();
            for (i, name) in aggregate_value.name.iter().enumerate() {
                if let Some(val) = aggregate_value.value.get(i) {
                    obj.insert(name.clone(), yamcs_value_to_hermes(val)?);
                }
            }
            Ok(Value {
                value: Some(value::Value::O(ObjectValue { o: obj })),
            })
        }
        yamcs_http::Value::Array { array_value } => {
            let values: Result<Vec<_>, _> = array_value.iter().map(yamcs_value_to_hermes).collect();
            Ok(Value {
                value: Some(value::Value::A(ArrayValue { value: values? })),
            })
        }
        yamcs_http::Value::Enumerated { string_value } => {
            // Enumerated values are represented as strings
            Ok(Value {
                value: Some(value::Value::S(string_value.clone())),
            })
        }
        yamcs_http::Value::None => {
            // No value
            Ok(Value { value: None })
        }
    }
}

/// Parse YAMCS timestamp string to Hermes Time
fn parse_yamcs_time(time_str: &str) -> Result<Time, Status> {
    // Parse ISO8601 timestamp
    let dt = DateTime::parse_from_rfc3339(time_str)
        .map_err(|e| Status::invalid_argument(format!("Invalid timestamp: {}", e)))?;

    let utc: DateTime<Utc> = dt.into();

    Ok(Time {
        unix: Some(Timestamp {
            seconds: utc.timestamp(),
            nanos: utc.timestamp_subsec_nanos() as i32,
        }),
        sclk: 0.0,
    })
}

/// Convert YAMCS Instance to Hermes Fsw
pub fn yamcs_instance_to_fsw(instance: &yamcs_http::types::system::Instance) -> Fsw {
    // YAMCS instances support commanding
    let capabilities = vec![FswCapability::Command as i32];

    Fsw {
        id: instance.name.clone(),
        r#type: "yamcs".to_string(),
        profile_id: String::new(), // YAMCS instances aren't managed profiles
        forwards: vec![],
        capabilities,
        dictionary: String::new(), // Could be set based on instance metadata
    }
}
