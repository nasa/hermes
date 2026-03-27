use crate::error::DictionaryError;
use crate::fprime::TypeDescriptor;
use hermes_pb::*;

/// Convert size and signedness to IntKind
pub fn integer_kind(size: Option<f64>, signed: Option<bool>) -> Result<IntKind, DictionaryError> {
    let size = size.unwrap_or(32.0) as i32;
    let signed = signed.unwrap_or(false);

    match (size, signed) {
        (8, false) => Ok(IntKind::IntU8),
        (8, true) => Ok(IntKind::IntI8),
        (16, false) => Ok(IntKind::IntU16),
        (16, true) => Ok(IntKind::IntI16),
        (32, false) => Ok(IntKind::IntU32),
        (32, true) => Ok(IntKind::IntI32),
        (64, false) => Ok(IntKind::IntU64),
        (64, true) => Ok(IntKind::IntI64),
        _ => Err(DictionaryError::InvalidIntegerSize(size)),
    }
}

/// Convert size to FloatKind
pub fn float_kind(size: Option<f64>) -> Result<FloatKind, DictionaryError> {
    let size = size.unwrap_or(32.0) as i32;

    match size {
        32 => Ok(FloatKind::FF32),
        64 => Ok(FloatKind::FF64),
        _ => Err(DictionaryError::InvalidFloatSize(size)),
    }
}

/// Convert TypeDescriptor to protobuf Type
pub fn parse_type(type_desc: &TypeDescriptor) -> Result<Type, DictionaryError> {
    use crate::fprime::TypeKind;

    let value = match type_desc.kind {
        TypeKind::String => Some(hermes_pb::r#type::Value::String(StringType {
            length_type: UIntKind::UintU16 as i32,
            max_length: type_desc.size.map(|s| s as u32).unwrap_or(0),
        })),
        TypeKind::Integer => Some(hermes_pb::r#type::Value::Int(IntType {
            kind: integer_kind(type_desc.size, type_desc.signed)? as i32,
            min: 0,
            max: 0,
        })),
        TypeKind::Float => Some(hermes_pb::r#type::Value::Float(FloatType {
            kind: float_kind(type_desc.size)? as i32,
            min: 0.0,
            max: 0.0,
        })),
        TypeKind::Bool => Some(hermes_pb::r#type::Value::Bool(BooleanType {
            encode_type: UIntKind::UintU8 as i32,
        })),
        TypeKind::QualifiedIdentifier => Some(hermes_pb::r#type::Value::Ref(ReferenceType {
            name: type_desc.name.clone(),
            kind: ReferenceKind::RefEnum as i32,
        })),
    };

    Ok(Type {
        value,
        metadata: String::new(),
    })
}

/// Parse a qualified name into component and name parts
pub fn parse_name(s: &str) -> Result<(String, String), DictionaryError> {
    let last_dot = s
        .rfind('.')
        .ok_or_else(|| DictionaryError::InvalidName(s.to_string()))?;

    Ok((s[..last_dot].to_string(), s[last_dot + 1..].to_string()))
}

/// Create a key from a qualified name
pub fn name_key(s: &str) -> Result<String, DictionaryError> {
    let (component, name) = parse_name(s)?;
    Ok(format!("{}.{}", component, name))
}

/// Convert an optional annotation to JSON metadata format
/// Returns a JSON string like {"description":"..."} or empty string if None
pub fn annotation_to_metadata(annotation: &Option<String>) -> String {
    annotation.as_ref().map_or_else(
        || "{}".to_string(),
        |desc| {
            serde_json::json!({
                "description": desc
            })
            .to_string()
        },
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_integer_kind() {
        assert_eq!(
            integer_kind(Some(8.0), Some(false)).unwrap(),
            IntKind::IntU8
        );
        assert_eq!(integer_kind(Some(8.0), Some(true)).unwrap(), IntKind::IntI8);
        assert_eq!(
            integer_kind(Some(16.0), Some(false)).unwrap(),
            IntKind::IntU16
        );
        assert_eq!(
            integer_kind(Some(32.0), Some(true)).unwrap(),
            IntKind::IntI32
        );
        assert!(integer_kind(Some(128.0), Some(false)).is_err());
    }

    #[test]
    fn test_float_kind() {
        assert_eq!(float_kind(Some(32.0)).unwrap(), FloatKind::FF32);
        assert_eq!(float_kind(Some(64.0)).unwrap(), FloatKind::FF64);
        assert!(float_kind(Some(128.0)).is_err());
    }

    #[test]
    fn test_parse_name() {
        let (component, name) = parse_name("Component.SubComponent.Name").unwrap();
        assert_eq!(component, "Component.SubComponent");
        assert_eq!(name, "Name");

        assert!(parse_name("NoDotsHere").is_err());
    }
}
