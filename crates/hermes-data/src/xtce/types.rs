use crate::util::parse_hex_binary;
use crate::{AbsoluteTimeType, AggregateType, ArrayType, BinaryType, BooleanEncoding, BooleanType, ByteOrder, Calibrator, Dimension, EnumeratedType, EnumerationEntry, Error, FloatType, IntegerType, IntegerValue, Member, Parameter, RelativeTimeType, Result, StringType, TimeEncoding, TimeSystem, Type, VariableSize};

pub(crate) fn convert_parameter_type_set(xml: &hermes_xtce::ParameterTypeSetType) -> Result<Type> {
    match xml {
        hermes_xtce::ParameterTypeSetType::IntegerParameterType(t) => {
            Ok(Type::Integer(convert_integer_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::FloatParameterType(t) => {
            Ok(Type::Float(convert_float_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::StringParameterType(t) => {
            Ok(Type::String(convert_string_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::BooleanParameterType(t) => {
            Ok(Type::Boolean(convert_boolean_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::EnumeratedParameterType(t) => {
            Ok(Type::Enumerated(convert_enumerated_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::AbsoluteTimeParameterType(t) => {
            Ok(Type::AbsoluteTime(convert_absolute_time_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::RelativeTimeParameterType(t) => {
            Ok(Type::RelativeTime(convert_relative_time_parameter_type(t)?))
        }
        hermes_xtce::ParameterTypeSetType::BinaryParameterType(_) => {
            panic!(
                "Binary types cannot be converted by 'convert_parameter_type_set' - use convert_parameter_type_set_with_parameters"
            )
        }
        hermes_xtce::ParameterTypeSetType::ArrayParameterType(_) => {
            panic!(
                "Array types cannot be converted by 'convert_parameter_type_set' - use convert_parameter_type_set_with_parameters"
            )
        }
        hermes_xtce::ParameterTypeSetType::AggregateParameterType(_) => {
            panic!(
                "Aggregate types cannot be converted by 'convert_parameter_type_set' - use convert_parameter_type_set_with_context"
            )
        }
    }
}

/// Convert parameter type with context for resolving type references (used for Aggregate types)
pub(crate) fn convert_parameter_type_set_with_context(
    xml: &hermes_xtce::ParameterTypeSetType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::sync::Arc<Type>>,
) -> Result<Type> {
    match xml {
        hermes_xtce::ParameterTypeSetType::AggregateParameterType(t) => Ok(Type::Aggregate(
            convert_aggregate_parameter_type(t, space_system_path, available_types)?,
        )),
        // For other types, use the simple converter (shouldn't happen in normal flow)
        _ => convert_parameter_type_set(xml),
    }
}

/// Convert parameter type with context for resolving type and parameter references
/// (used for Binary and Array types that can reference parameters)
pub(crate) fn convert_parameter_type_set_with_parameters(
    xml: &hermes_xtce::ParameterTypeSetType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::sync::Arc<Type>>,
    parameters: &std::collections::HashMap<String, std::sync::Arc<Parameter>>,
) -> Result<Type> {
    match xml {
        hermes_xtce::ParameterTypeSetType::BinaryParameterType(t) => Ok(Type::Binary(
            convert_binary_parameter_type(t, space_system_path, parameters)?,
        )),
        hermes_xtce::ParameterTypeSetType::ArrayParameterType(t) => Ok(Type::Array(
            convert_array_parameter_type(t, space_system_path, available_types, parameters)?,
        )),
        // For other types, shouldn't happen
        _ => convert_parameter_type_set(xml),
    }
}

fn convert_integer_parameter_type(xml: &hermes_xtce::IntegerParameterType) -> Result<IntegerType> {
    // Extract encoding information from content
    let encoding_opt = xml.content.iter().find_map(|item| match item {
        hermes_xtce::IntegerParameterTypeContent::IntegerDataEncoding(enc) => Some(enc),
        _ => None,
    });

    // If no encoding is present, this type may use baseType inheritance
    // For now, create a default encoding based on the size and signedness
    let (size_in_bits, byte_order, encoding, calibrator) = if let Some(enc) = encoding_opt {
        let calibrator = if let Some(default_calibrator) = &enc.default_calibrator {
            Calibrator::new(default_calibrator.clone())?
        } else {
            Calibrator::None
        };
        (
            enc.size_in_bits,
            enc.byte_order.clone().try_into()?,
            enc.encoding.clone(),
            calibrator,
        )
    } else {
        // Use default encoding based on type attributes
        // This handles types that inherit from baseType without their own encoding
        (
            xml.size_in_bits,
            ByteOrder::BigEndian,
            if xml.signed {
                hermes_xtce::IntegerEncodingType::TwosComplement
            } else {
                hermes_xtce::IntegerEncodingType::Unsigned
            },
            Calibrator::None,
        )
    };

    // Validate that bit size is within supported range
    if size_in_bits <= 0 || size_in_bits > 64 {
        return Err(Error::InvalidXtce(format!(
            "Integer type '{}' has invalid size_in_bits: {}. Must be between 1 and 64 bits.",
            xml.name, size_in_bits
        )));
    }

    Ok(IntegerType {
        size_in_bits,
        signed: xml.signed,
        byte_order,
        encoding,
        calibrator,
    })
}

fn convert_float_parameter_type(xml: &hermes_xtce::FloatParameterType) -> Result<FloatType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::FloatParameterTypeContent::FloatDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("FloatParameterType missing FloatDataEncoding".to_string())
        })?;

    // Get calibrator if present
    let calibrator = if let Some(default_calibrator) = &encoding.default_calibrator {
        Calibrator::new(default_calibrator.clone())?
    } else {
        Calibrator::None
    };

    Ok(FloatType {
        size_in_bits: xml.size_in_bits.clone().try_into()?,
        byte_order: encoding.byte_order.clone().try_into()?,
        calibrator,
    })
}

fn convert_string_parameter_type(xml: &hermes_xtce::StringParameterType) -> Result<StringType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::StringParameterTypeContent::StringDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("StringParameterType missing StringDataEncoding".to_string())
        })?;

    // Validate and convert string encoding
    let string_encoding = encoding.encoding.clone().try_into()?;

    // Determine size (fixed, leading, or termination char)
    let byte_order = encoding.byte_order.clone().try_into()?;
    let size = convert_string_size(&encoding.content, byte_order)?;

    Ok(StringType {
        encoding: string_encoding,
        size,
    })
}

fn parse_termination_char(hex: &str) -> Result<u8> {
    // HexBinaryType is a String containing hex digits
    let bytes = parse_hex_binary(hex)?;

    if bytes.len() != 1 {
        return Err(Error::InvalidXtce(format!(
            "Termination char must be a single byte, got {} bytes",
            bytes.len()
        )));
    }

    Ok(bytes[0])
}

/// Helper to create an IntegerType for a leading size tag
fn create_leading_size_integer_type(
    size_in_bits: i64,
    byte_order: ByteOrder,
) -> Result<IntegerType> {
    // Validate bit size
    if size_in_bits <= 0 || size_in_bits > 64 {
        return Err(Error::InvalidXtce(format!(
            "Leading size tag has invalid size_in_bits: {}. Must be between 1 and 64 bits.",
            size_in_bits
        )));
    }

    Ok(IntegerType {
        size_in_bits,
        signed: false,
        byte_order,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    })
}

/// Helper to convert string data encoding content to VariableSize
fn convert_string_size(
    content: &[hermes_xtce::StringDataEncodingTypeContent],
    byte_order: ByteOrder,
) -> Result<VariableSize> {
    content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::StringDataEncodingTypeContent::SizeInBits(size) => {
                if let Some(leading_size) = &size.leading_size {
                    Some(
                        create_leading_size_integer_type(
                            leading_size.size_in_bits_of_size_tag,
                            byte_order,
                        )
                        .map(|kind| VariableSize::LeadingSize {
                            kind,
                            max_size_in_bits: size.fixed.fixed_value as usize,
                        }),
                    )
                } else if let Some(term_char) = &size.termination_char {
                    Some(parse_termination_char(term_char).map(|chr| {
                        VariableSize::TerminationChar {
                            chr,
                            max_size_in_bits: size.fixed.fixed_value as usize,
                        }
                    }))
                } else {
                    Some(Ok(VariableSize::Fixed(
                        (size.fixed.fixed_value / 8) as usize,
                    )))
                }
            }
            hermes_xtce::StringDataEncodingTypeContent::Variable(var) => var
                .content
                .iter()
                .find_map(|var_content| match var_content {
                    hermes_xtce::VariableStringTypeContent::LeadingSize(leading_size) => Some(
                        create_leading_size_integer_type(
                            leading_size.size_in_bits_of_size_tag,
                            byte_order,
                        )
                        .map(|kind| VariableSize::LeadingSize {
                            kind,
                            max_size_in_bits: var.max_size_in_bits as usize,
                        }),
                    ),
                    hermes_xtce::VariableStringTypeContent::TerminationChar(term_char) => {
                        Some(parse_termination_char(term_char).map(|chr| {
                            VariableSize::TerminationChar {
                                chr,
                                max_size_in_bits: var.max_size_in_bits as usize,
                            }
                        }))
                    }
                    _ => None,
                }),
            _ => None,
        })
        .transpose()?
        .ok_or_else(|| {
            Error::InvalidXtce(
                "StringDataEncoding missing size specification (Fixed or Variable)".to_string(),
            )
        })
}

fn convert_boolean_parameter_type(xml: &hermes_xtce::BooleanParameterType) -> Result<BooleanType> {
    // Extract encoding information from content (can be either Integer or String)
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::BooleanParameterTypeContent::IntegerDataEncoding(enc) => {
                // Validate bit size for integer encoding
                if enc.size_in_bits <= 0 || enc.size_in_bits > 64 {
                    return None; // Will be caught by ok_or_else below
                }
                Some(BooleanEncoding::Integer(IntegerType {
                    size_in_bits: enc.size_in_bits,
                    signed: false,
                    byte_order: enc.byte_order.clone().try_into().ok()?,
                    encoding: enc.encoding.clone(),
                    calibrator: Calibrator::None,
                }))
            }
            hermes_xtce::BooleanParameterTypeContent::StringDataEncoding(enc) => {
                let byte_order = enc.byte_order.clone().try_into().ok()?;
                let size = convert_string_size(&enc.content, byte_order).ok()?;
                let string_encoding = enc.encoding.clone().try_into().ok()?;
                Some(BooleanEncoding::String(StringType {
                    encoding: string_encoding,
                    size,
                }))
            }
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce(
                "BooleanParameterType missing IntegerDataEncoding or StringDataEncoding"
                    .to_string(),
            )
        })?;

    // Additional validation for integer encoding bit size
    if let BooleanEncoding::Integer(ref int_type) = encoding {
        if int_type.size_in_bits <= 0 || int_type.size_in_bits > 64 {
            return Err(Error::InvalidXtce(format!(
                "Boolean type '{}' has invalid size_in_bits: {}. Must be between 1 and 64 bits.",
                xml.name, int_type.size_in_bits
            )));
        }
    }

    Ok(BooleanType {
        encoding,
        one_string_value: xml.one_string_value.clone(),
        zero_string_value: xml.zero_string_value.clone(),
    })
}

fn convert_enumerated_parameter_type(
    xml: &hermes_xtce::EnumeratedParameterType,
) -> Result<EnumeratedType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::EnumeratedParameterTypeContent::IntegerDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("EnumeratedParameterType missing IntegerDataEncoding".to_string())
        })?;

    // Extract enumeration list from content
    let enumeration_list = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::EnumeratedParameterTypeContent::EnumerationList(list) => Some(list),
            _ => None,
        })
        .map(|list| {
            list.enumeration
                .iter()
                .map(|e| EnumerationEntry {
                    label: e.label.clone(),
                    value: e.value,
                    short_description: e.short_description.clone(),
                })
                .collect()
        })
        .unwrap_or_default();

    // Validate that bit size is within supported range
    if encoding.size_in_bits <= 0 || encoding.size_in_bits > 64 {
        return Err(Error::InvalidXtce(format!(
            "Enumerated type '{}' has invalid size_in_bits: {}. Must be between 1 and 64 bits.",
            xml.name, encoding.size_in_bits
        )));
    }

    // Create IntegerType for the encoding
    let integer_type = IntegerType {
        size_in_bits: encoding.size_in_bits,
        signed: true,
        byte_order: encoding.byte_order.clone().try_into()?,
        encoding: encoding.encoding.clone(),
        calibrator: Calibrator::None,
    };

    Ok(EnumeratedType {
        encoding: integer_type,
        enumeration_list,
    })
}

fn convert_binary_parameter_type(
    xml: &hermes_xtce::BinaryParameterType,
    space_system_path: &str,
    parameters: &std::collections::HashMap<String, std::sync::Arc<Parameter>>,
) -> Result<BinaryType> {
    // Extract encoding information from content
    let encoding = xml
        .content
        .iter()
        .find_map(|item| match item {
            hermes_xtce::BinaryParameterTypeContent::BinaryDataEncoding(enc) => Some(enc),
            _ => None,
        })
        .ok_or_else(|| {
            Error::InvalidXtce("BinaryParameterType missing BinaryDataEncoding".to_string())
        })?;

    // Convert size (IntegerValueType can be fixed or dynamic)
    // Resolve parameter references to fully qualified names
    let size_integer_value =
        crate::xtce::convert_integer_value(&encoding.size_in_bits, space_system_path, parameters)?;

    // Convert IntegerValue to VariableSize
    let size = match size_integer_value {
        IntegerValue::FixedValue(bits) => {
            // Convert bits to bytes
            VariableSize::Fixed((bits / 8) as usize)
        }
        IntegerValue::DynamicValueParameter {
            ref_,
            linear_adjustment,
        } => {
            if linear_adjustment.is_some() {
                return Err(Error::NotImplemented(
                    "Linear adjustment for binary size not supported",
                ));
            }
            VariableSize::DynamicParameterRef(ref_)
        }
        IntegerValue::DynamicValueArgument { .. } => {
            return Err(Error::NotImplemented(
                "Argument reference for binary size not supported",
            ));
        }
    };

    Ok(BinaryType { size })
}

fn convert_absolute_time_parameter_type(
    xml: &hermes_xtce::AbsoluteTimeParameterType,
) -> Result<AbsoluteTimeType> {
    // Extract encoding information (it's a direct field, not in content)
    let encoding_xml = xml.encoding.as_ref().ok_or_else(|| {
        Error::InvalidXtce("AbsoluteTimeParameterType missing Encoding".to_string())
    })?;

    // Convert encoding (can be Integer or String)
    let encoding = match &encoding_xml.content {
        hermes_xtce::EncodingTypeContent::IntegerDataEncoding(enc) => {
            // Validate bit size for integer encoding
            if enc.size_in_bits <= 0 || enc.size_in_bits > 64 {
                return Err(Error::InvalidXtce(format!(
                    "AbsoluteTime type '{}' has invalid size_in_bits: {}. Must be between 1 and 64 bits.",
                    xml.name, enc.size_in_bits
                )));
            }
            TimeEncoding::Integer(IntegerType {
                size_in_bits: enc.size_in_bits,
                signed: false, // Time is typically unsigned
                byte_order: enc.byte_order.clone().try_into()?,
                encoding: enc.encoding.clone(),
                calibrator: Calibrator::None,
            })
        }
        hermes_xtce::EncodingTypeContent::StringDataEncoding(enc) => {
            let byte_order = enc.byte_order.clone().try_into()?;
            let size =
                convert_string_size(&enc.content, byte_order).unwrap_or(VariableSize::Fixed(0)); // Default for time strings
            let string_encoding = enc.encoding.clone().try_into()?;
            TimeEncoding::String(StringType {
                encoding: string_encoding,
                size,
            })
        }
        _ => {
            return Err(Error::InvalidXtce(
                "AbsoluteTimeParameterType has unsupported encoding type".to_string(),
            ));
        }
    };

    // For now, use a default epoch time system
    // TODO: Parse reference_time to determine the actual epoch
    let time_system = TimeSystem::Epoch(std::time::SystemTime::UNIX_EPOCH);

    Ok(AbsoluteTimeType {
        encoding,
        time_system,
    })
}

fn convert_relative_time_parameter_type(
    xml: &hermes_xtce::RelativeTimeParameterType,
) -> Result<RelativeTimeType> {
    // Extract encoding information (it's a direct field, not in content)
    let encoding_xml = xml.encoding.as_ref().ok_or_else(|| {
        Error::InvalidXtce("RelativeTimeParameterType missing Encoding".to_string())
    })?;

    // Convert encoding (typically Integer for duration counts)
    let encoding = match &encoding_xml.content {
        hermes_xtce::EncodingTypeContent::IntegerDataEncoding(enc) => {
            // Validate bit size for integer encoding
            if enc.size_in_bits <= 0 || enc.size_in_bits > 64 {
                return Err(Error::InvalidXtce(format!(
                    "RelativeTime type '{}' has invalid size_in_bits: {}. Must be between 1 and 64 bits.",
                    xml.name, enc.size_in_bits
                )));
            }
            TimeEncoding::Integer(IntegerType {
                size_in_bits: enc.size_in_bits,
                signed: false,
                byte_order: enc.byte_order.clone().try_into()?,
                encoding: enc.encoding.clone(),
                calibrator: Calibrator::None,
            })
        }
        hermes_xtce::EncodingTypeContent::StringDataEncoding(enc) => {
            let byte_order = enc.byte_order.clone().try_into()?;
            let size =
                convert_string_size(&enc.content, byte_order).unwrap_or(VariableSize::Fixed(0)); // Default for time strings
            let string_encoding = enc.encoding.clone().try_into()?;
            TimeEncoding::String(StringType {
                encoding: string_encoding,
                size,
            })
        }
        _ => {
            return Err(Error::InvalidXtce(
                "RelativeTimeParameterType has unsupported encoding type".to_string(),
            ));
        }
    };

    Ok(RelativeTimeType {
        encoding,
        offset: None, // TODO: Parse offset from XTCE if present
    })
}

fn convert_array_parameter_type(
    xml: &hermes_xtce::ArrayParameterType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::sync::Arc<Type>>,
    parameters: &std::collections::HashMap<String, std::sync::Arc<Parameter>>,
) -> Result<ArrayType> {
    // Resolve the element type reference
    let resolved_type_name = crate::xtce::resolve_parameter_type_name(
        space_system_path,
        &xml.array_type_ref,
        available_types,
    )?;

    let element_type_rc = available_types.get(&resolved_type_name).ok_or_else(|| {
        Error::InvalidXtce(format!(
            "Array element type '{}' not found in available types",
            resolved_type_name
        ))
    })?;

    // Clone the Type from the Rc (arrays need owned types, not references)
    let element_type = (**element_type_rc).clone();

    // Convert dimensions - resolve parameter references to fully qualified names
    let dimensions: Result<Vec<Dimension>> = xml
        .dimension_list
        .dimension
        .iter()
        .map(|dim| {
            Ok(Dimension {
                starting_index: crate::xtce::convert_integer_value(
                    &dim.starting_index,
                    space_system_path,
                    parameters,
                )?,
                ending_index: crate::xtce::convert_integer_value(
                    &dim.ending_index,
                    space_system_path,
                    parameters,
                )?,
            })
        })
        .collect();

    Ok(ArrayType {
        element_type: Box::new(element_type),
        dimensions: dimensions?,
    })
}

fn convert_aggregate_parameter_type(
    xml: &hermes_xtce::AggregateParameterType,
    space_system_path: &str,
    available_types: &std::collections::HashMap<String, std::sync::Arc<Type>>,
) -> Result<AggregateType> {
    // Convert all members
    let members: Result<Vec<Member>> = xml
        .member_list
        .member
        .iter()
        .map(|member_xml| {
            // Resolve the member type reference
            let resolved_type_name = crate::xtce::resolve_parameter_type_name(
                space_system_path,
                &member_xml.type_ref,
                available_types,
            )?;

            let member_type_rc = available_types.get(&resolved_type_name).ok_or_else(|| {
                Error::InvalidXtce(format!(
                    "Aggregate member type '{}' not found in available types",
                    resolved_type_name
                ))
            })?;

            // Clone the Type from the Rc
            let member_type = (**member_type_rc).clone();

            Ok(Member {
                name: member_xml.name.clone(),
                type_: member_type,
            })
        })
        .collect();

    Ok(AggregateType { members: members? })
}
