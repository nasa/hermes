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

/// Width of the length prefix F Prime serializes in front of strings.
///
/// Read from the dictionary's `FwSizeStoreType` alias. Older dictionaries
/// that don't define it use the historical 16-bit prefix.
pub fn string_length_kind(
    type_defs: Option<&[crate::fprime::TypeDefinition]>,
) -> Result<UIntKind, DictionaryError> {
    use crate::fprime::{TypeDefinition, TypeKind};

    let underlying = type_defs.and_then(|defs| {
        defs.iter().find_map(|d| match d {
            TypeDefinition::Alias {
                qualified_name,
                underlying_type,
                ..
            } if qualified_name == "FwSizeStoreType" => Some(underlying_type),
            _ => None,
        })
    });

    let Some(t) = underlying else {
        return Ok(UIntKind::UintU16);
    };
    if !matches!(t.kind, TypeKind::Integer) || t.signed == Some(true) {
        return Err(DictionaryError::InvalidStringLengthType(t.name.clone()));
    }
    match t.size.map(|s| s as i32) {
        Some(8) => Ok(UIntKind::UintU8),
        Some(16) => Ok(UIntKind::UintU16),
        Some(32) => Ok(UIntKind::UintU32),
        Some(64) => Ok(UIntKind::UintU64),
        _ => Err(DictionaryError::InvalidStringLengthType(t.name.clone())),
    }
}

/// Recursively set the length prefix kind of every string in `t`.
pub fn set_string_length_kind(t: &mut Type, kind: UIntKind) {
    use hermes_pb::r#type::Value;
    match &mut t.value {
        Some(Value::String(s)) => s.length_type = kind as i32,
        Some(Value::Array(a)) => {
            if let Some(el) = a.el_type.as_mut() {
                set_string_length_kind(el, kind);
            }
        }
        Some(Value::Object(o)) => {
            for f in &mut o.fields {
                if let Some(ft) = f.r#type.as_mut() {
                    set_string_length_kind(ft, kind);
                }
            }
        }
        _ => {}
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

    fn alias_defs(json: &str) -> Vec<crate::fprime::TypeDefinition> {
        serde_json::from_str(json).unwrap()
    }

    fn size_store(name: &str, size: u32) -> Vec<crate::fprime::TypeDefinition> {
        alias_defs(&format!(
            r#"[{{"kind":"alias","qualifiedName":"FwSizeStoreType",
                "type":{{"name":"FwSizeType","kind":"qualifiedIdentifier"}},
                "underlyingType":{{"name":"{name}","kind":"integer","size":{size},"signed":false}}}}]"#
        ))
    }

    #[test]
    fn test_string_length_kind_fallback() {
        // Older dictionaries without FwSizeStoreType keep the 16-bit prefix
        assert_eq!(string_length_kind(None).unwrap(), UIntKind::UintU16);
        assert_eq!(string_length_kind(Some(&[])).unwrap(), UIntKind::UintU16);
    }

    #[test]
    fn test_string_length_kind_from_dictionary() {
        assert_eq!(
            string_length_kind(Some(&size_store("U16", 16))).unwrap(),
            UIntKind::UintU16
        );
        assert_eq!(
            string_length_kind(Some(&size_store("U32", 32))).unwrap(),
            UIntKind::UintU32
        );
        assert_eq!(
            string_length_kind(Some(&size_store("U64", 64))).unwrap(),
            UIntKind::UintU64
        );
        assert!(string_length_kind(Some(&size_store("U128", 128))).is_err());
    }
}
