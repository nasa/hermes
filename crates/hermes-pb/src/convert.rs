//! Conversions from hermes-data types to protobuf types

use std::collections::HashMap;

impl From<&hermes_data::MetaCommand> for crate::CommandDef {
    fn from(cmd: &hermes_data::MetaCommand) -> Self {
        Self {
            def: Some((&cmd.head).into()),
            r#abstract: cmd.abstract_,
            arguments: cmd.args.iter().map(|arg| arg.as_ref().into()).collect(),
            transmission_constraints: cmd
                .collect_constraints()
                .iter()
                .map(Into::into)
                .collect(),
        }
    }
}

impl From<&hermes_data::Item> for crate::XtceDef {
    fn from(item: &hermes_data::Item) -> Self {
        Self {
            name: item.name.clone(),
            qualified_name: item.qualified_name.clone(),
            short_description: item.short_description.clone(),
            long_description: item.long_description.clone(),
            ancillary_data: extract_ancillary_data(&item.ancillary_data_set),
        }
    }
}

impl From<&hermes_data::Argument> for crate::ArgumentDef {
    fn from(arg: &hermes_data::Argument) -> Self {
        Self {
            def: Some((&arg.head).into()),
            r#type: Some((&arg.type_).into()),
            initial_value: arg.initial_value.as_ref().map(Into::into),
        }
    }
}

impl From<&std::sync::Arc<hermes_data::Type>> for crate::Type {
    fn from(type_: &std::sync::Arc<hermes_data::Type>) -> Self {
        use hermes_data::Type;

        let value = match type_.as_ref() {
            Type::Integer(int_ty) => {
                let kind = match (int_ty.signed, int_ty.size_in_bits) {
                    (false, 8) => crate::IntKind::IntU8,
                    (true, 8) => crate::IntKind::IntI8,
                    (false, 16) => crate::IntKind::IntU16,
                    (true, 16) => crate::IntKind::IntI16,
                    (false, 32) => crate::IntKind::IntU32,
                    (true, 32) => crate::IntKind::IntI32,
                    (false, 64) => crate::IntKind::IntU64,
                    (true, 64) => crate::IntKind::IntI64,
                    // Default to appropriate width for non-standard sizes
                    (false, _) if int_ty.size_in_bits <= 8 => crate::IntKind::IntU8,
                    (true, _) if int_ty.size_in_bits <= 8 => crate::IntKind::IntI8,
                    (false, _) if int_ty.size_in_bits <= 16 => crate::IntKind::IntU16,
                    (true, _) if int_ty.size_in_bits <= 16 => crate::IntKind::IntI16,
                    (false, _) if int_ty.size_in_bits <= 32 => crate::IntKind::IntU32,
                    (true, _) if int_ty.size_in_bits <= 32 => crate::IntKind::IntI32,
                    (false, _) => crate::IntKind::IntU64,
                    (true, _) => crate::IntKind::IntI64,
                };

                // Calculate valid range based on size
                let (min, max) = if int_ty.signed {
                    let bits = int_ty.size_in_bits.min(64);
                    if bits >= 64 {
                        (i64::MIN, i64::MAX)
                    } else {
                        let max_val = (1i64 << (bits - 1)) - 1;
                        let min_val = -(1i64 << (bits - 1));
                        (min_val, max_val)
                    }
                } else {
                    let bits = int_ty.size_in_bits.min(64);
                    let max_val = if bits >= 64 {
                        i64::MAX // Can't represent full u64 range in i64
                    } else {
                        ((1u64 << bits) - 1) as i64
                    };
                    (0, max_val)
                };

                crate::r#type::Value::Int(crate::IntType {
                    kind: kind as i32,
                    min,
                    max,
                })
            }

            Type::Float(float_ty) => {
                use hermes_data::FloatSize;
                let kind = match float_ty.size_in_bits {
                    FloatSize::F32 => crate::FloatKind::FF32,
                    FloatSize::F64 => crate::FloatKind::FF64,
                };

                crate::r#type::Value::Float(crate::FloatType {
                    kind: kind as i32,
                    min: f64::MIN,
                    max: f64::MAX,
                })
            }

            Type::String(str_ty) => {
                use hermes_data::VariableSize;

                // Determine max length from size constraint
                let max_length = match &str_ty.size {
                    VariableSize::Fixed(bits) => (*bits / 8) as u32,
                    VariableSize::LeadingSize {
                        max_size_in_bits, ..
                    } => (*max_size_in_bits / 8) as u32,
                    VariableSize::TerminationChar {
                        max_size_in_bits, ..
                    } => (*max_size_in_bits / 8) as u32,
                    VariableSize::DynamicParameterRef(_) => 0, // Unknown max
                };

                crate::r#type::Value::String(crate::StringType {
                    length_type: crate::UIntKind::UintU32 as i32, // Default to U32 for string length
                    max_length,
                })
            }

            Type::Boolean(bool_ty) => {
                use hermes_data::BooleanEncoding;

                let encode_type = match &bool_ty.encoding {
                    BooleanEncoding::Integer(int_ty) => match int_ty.size_in_bits {
                        8 => crate::UIntKind::UintU8,
                        16 => crate::UIntKind::UintU16,
                        32 => crate::UIntKind::UintU32,
                        _ => crate::UIntKind::UintU8, // Default to U8
                    },
                    BooleanEncoding::String(_) => crate::UIntKind::UintU8, // String booleans encode as U8 in protobuf
                };

                crate::r#type::Value::Bool(crate::BooleanType {
                    encode_type: encode_type as i32,
                })
            }

            Type::Binary(bin_ty) => {
                use hermes_data::VariableSize;

                let (size, length_type) = match &bin_ty.size {
                    VariableSize::Fixed(bits) => {
                        let bytes = (*bits / 8) as u32;
                        (
                            Some(crate::bytes_type::Size::Static(bytes)),
                            crate::UIntKind::UintU32,
                        )
                    }
                    VariableSize::LeadingSize {
                        max_size_in_bits, ..
                    } => {
                        let max_bytes = (*max_size_in_bits / 8) as u32;
                        (
                            Some(crate::bytes_type::Size::Dynamic(crate::BoundedArraySize {
                                min: 0,
                                max: max_bytes,
                            })),
                            crate::UIntKind::UintU32,
                        )
                    }
                    _ => (None, crate::UIntKind::UintU32),
                };

                crate::r#type::Value::Bytes(crate::BytesType {
                    name: String::new(),
                    kind: crate::NumberKind::NumberU8 as i32, // Binary is array of bytes
                    size,
                    length_type: length_type as i32,
                })
            }

            Type::Enumerated(enum_ty) => {
                let items = enum_ty
                    .enumeration_list
                    .iter()
                    .map(|entry| crate::EnumItem {
                        value: entry.value as i32,
                        name: entry.label.clone(),
                        metadata: entry.short_description.clone().unwrap_or_default(),
                    })
                    .collect();

                let encode_type = match (enum_ty.encoding.signed, enum_ty.encoding.size_in_bits) {
                    (false, 8) => crate::IntKind::IntU8,
                    (true, 8) => crate::IntKind::IntI8,
                    (false, 16) => crate::IntKind::IntU16,
                    (true, 16) => crate::IntKind::IntI16,
                    (false, 32) => crate::IntKind::IntU32,
                    (true, 32) => crate::IntKind::IntI32,
                    _ => crate::IntKind::IntI32, // Default
                };

                crate::r#type::Value::Enum(crate::EnumType {
                    name: String::new(),
                    encode_type: encode_type as i32,
                    items,
                })
            }

            Type::Array(arr_ty) => {
                // Convert Box<Type> to Arc<Type> for recursion
                let element_arc = std::sync::Arc::new(arr_ty.element_type.as_ref().clone());
                let el_type: crate::Type = (&element_arc).into();

                // For now, treat all arrays as dynamic with unbounded size
                // TODO: Handle fixed-size arrays from dimension constraints
                let size = Some(crate::array_type::Size::Dynamic(
                    crate::BoundedArraySize {
                        min: 0,
                        max: u32::MAX,
                    },
                ));

                crate::r#type::Value::Array(Box::new(crate::ArrayType {
                    name: String::new(),
                    el_type: Some(Box::new(el_type)),
                    size,
                    length_type: crate::UIntKind::UintU32 as i32,
                }))
            }

            Type::Aggregate(agg_ty) => {
                let fields = agg_ty
                    .members
                    .iter()
                    .map(|member| {
                        let member_type_arc = std::sync::Arc::new(member.type_.clone());
                        crate::Field {
                            name: member.name.clone(),
                            r#type: Some((&member_type_arc).into()),
                            metadata: String::new(),
                            value: None,
                        }
                    })
                    .collect();

                crate::r#type::Value::Object(crate::ObjectType {
                    name: String::new(),
                    fields,
                })
            }

            Type::AbsoluteTime(_) => {
                // Encode absolute time as U64 nanoseconds since epoch
                crate::r#type::Value::Int(crate::IntType {
                    kind: crate::IntKind::IntU64 as i32,
                    min: 0,
                    max: i64::MAX,
                })
            }

            Type::RelativeTime(_) => {
                // Encode relative time as I64 nanoseconds (can be negative)
                crate::r#type::Value::Int(crate::IntType {
                    kind: crate::IntKind::IntI64 as i32,
                    min: i64::MIN,
                    max: i64::MAX,
                })
            }
        };

        Self {
            value: Some(value),
            metadata: String::new(),
        }
    }
}

impl From<&hermes_data::Value> for crate::Value {
    fn from(value: &hermes_data::Value) -> Self {
        use hermes_data::Value;

        let proto_value = match value {
            Value::UnsignedInteger(u) => crate::value::Value::U(*u),
            Value::SignedInteger(i) => crate::value::Value::I(*i),
            Value::Float(f) => crate::value::Value::F(*f),
            Value::String(s) => crate::value::Value::S(s.clone()),
            Value::Boolean(b) => crate::value::Value::B(*b),

            Value::Binary(bytes) => crate::value::Value::R(crate::BytesValue {
                kind: crate::NumberKind::NumberU8 as i32,
                big_endian: false, // Binary data is raw bytes, no endianness
                value: bytes.clone(),
            }),

            Value::Enumerated(enum_val) => crate::value::Value::E(crate::EnumValue {
                raw: enum_val.value,
                formatted: enum_val.label.clone(),
            }),

            Value::Array(arr) => {
                let values = arr.iter().map(Into::into).collect();
                crate::value::Value::A(crate::ArrayValue { value: values })
            }

            Value::Aggregate(agg) => {
                let mut map = HashMap::new();
                for (name, val) in agg.iter() {
                    map.insert(name.clone(), val.into());
                }
                crate::value::Value::O(crate::ObjectValue { o: map })
            }

            Value::AbsoluteTime(time) => {
                // Encode as U64 nanoseconds
                crate::value::Value::U(time.ns)
            }

            Value::RelativeTime(rel_time) => {
                use hermes_data::RelativeTime;
                // Encode as I64 nanoseconds (positive or negative)
                let ns = match rel_time {
                    RelativeTime::Forward(dur) => dur.as_nanos() as i64,
                    RelativeTime::Backward(dur) => -(dur.as_nanos() as i64),
                };
                crate::value::Value::I(ns)
            }
        };

        Self {
            value: Some(proto_value),
        }
    }
}

impl From<&hermes_data::TransmissionConstraint> for crate::TransmissionConstraint {
    fn from(constraint: &hermes_data::TransmissionConstraint) -> Self {
        Self {
            description: constraint.description.clone(),
            constraint: None, // TODO: Convert structured constraint when implemented
        }
    }
}

/// Extract ancillary data from XTCE AncillaryDataSetType
fn extract_ancillary_data(
    ancillary: &Option<hermes_xtce::AncillaryDataSetType>,
) -> HashMap<String, String> {
    let mut map = HashMap::new();
    if let Some(ad_set) = ancillary {
        for ad in &ad_set.ancillary_data {
            map.insert(ad.name.clone(), ad.content.clone());
        }
    }
    map
}
