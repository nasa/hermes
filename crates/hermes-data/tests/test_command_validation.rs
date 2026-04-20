use hermes_data::{
    ByteOrder, Calibrator, EnumeratedType, EnumerationEntry, FloatSize, FloatType, IntegerType,
    StringType, Value, VariableSize,
};

#[test]
fn test_validate_unsigned_integer_in_range() {
    let int_ty = IntegerType {
        size_in_bits: 8,
        signed: false,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    let value = Value::UnsignedInteger(100);
    assert!(value.validate(&hermes_data::Type::Integer(int_ty)).is_ok());
}

#[test]
fn test_validate_unsigned_integer_out_of_range() {
    let int_ty = IntegerType {
        size_in_bits: 8,
        signed: false,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    // 256 is out of range for 8-bit unsigned
    let value = Value::UnsignedInteger(256);
    assert!(value.validate(&hermes_data::Type::Integer(int_ty)).is_err());
}

#[test]
fn test_validate_signed_integer_in_range() {
    let int_ty = IntegerType {
        size_in_bits: 8,
        signed: true,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    let value = Value::SignedInteger(-50);
    assert!(value.validate(&hermes_data::Type::Integer(int_ty)).is_ok());
}

#[test]
fn test_validate_signed_integer_out_of_range() {
    let int_ty = IntegerType {
        size_in_bits: 8,
        signed: true,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    // 128 is out of range for 8-bit signed (max is 127)
    let value = Value::SignedInteger(128);
    assert!(value.validate(&hermes_data::Type::Integer(int_ty)).is_err());

    // -129 is out of range for 8-bit signed (min is -128)
    let value = Value::SignedInteger(-129);
    let int_ty = IntegerType {
        size_in_bits: 8,
        signed: true,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };
    assert!(value.validate(&hermes_data::Type::Integer(int_ty)).is_err());
}

#[test]
fn test_validate_float_nan() {
    let float_ty = FloatType {
        size_in_bits: FloatSize::F32,
        byte_order: ByteOrder::BigEndian,
        calibrator: Calibrator::None,
    };

    let value = Value::Float(f64::NAN);
    assert!(value.validate(&hermes_data::Type::Float(float_ty)).is_err());
}

#[test]
fn test_validate_float_infinity() {
    let float_ty = FloatType {
        size_in_bits: FloatSize::F64,
        byte_order: ByteOrder::BigEndian,
        calibrator: Calibrator::None,
    };

    let value = Value::Float(f64::INFINITY);
    assert!(value.validate(&hermes_data::Type::Float(float_ty)).is_err());
}

#[test]
fn test_validate_float_valid() {
    let float_ty = FloatType {
        size_in_bits: FloatSize::F64,
        byte_order: ByteOrder::BigEndian,
        calibrator: Calibrator::None,
    };

    let value = Value::Float(3.14159);
    assert!(value.validate(&hermes_data::Type::Float(float_ty)).is_ok());
}

#[test]
fn test_validate_string_fixed_size() {
    let str_ty = StringType {
        encoding: hermes_data::StringEncoding::Utf8,
        size: VariableSize::Fixed(32), // 4 bytes
    };

    // Correct size
    let value = Value::String("TEST".to_string());
    assert!(
        value
            .validate(&hermes_data::Type::String(str_ty.clone()))
            .is_ok()
    );

    // Wrong size
    let value = Value::String("TOOLONG".to_string());
    assert!(value.validate(&hermes_data::Type::String(str_ty)).is_err());
}

#[test]
fn test_validate_string_max_size() {
    let str_ty = StringType {
        encoding: hermes_data::StringEncoding::Utf8,
        size: VariableSize::LeadingSize {
            kind: IntegerType {
                size_in_bits: 8,
                signed: false,
                byte_order: ByteOrder::BigEndian,
                encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                calibrator: Calibrator::None,
            },
            max_size_in_bits: 64, // 8 bytes max
        },
    };

    // Within size
    let value = Value::String("SHORT".to_string());
    assert!(
        value
            .validate(&hermes_data::Type::String(str_ty.clone()))
            .is_ok()
    );

    // Exceeds max size
    let value = Value::String("VERYLONGSTRING".to_string());
    assert!(value.validate(&hermes_data::Type::String(str_ty)).is_err());
}

#[test]
fn test_validate_string_termination_char() {
    let str_ty = StringType {
        encoding: hermes_data::StringEncoding::Utf8,
        size: VariableSize::TerminationChar {
            chr: 0,
            max_size_in_bits: 256,
        },
    };

    // Valid string (no null byte)
    let value = Value::String("HELLO".to_string());
    assert!(
        value
            .validate(&hermes_data::Type::String(str_ty.clone()))
            .is_ok()
    );

    // Invalid string (contains null byte)
    let value = Value::String("HEL\0LO".to_string());
    assert!(value.validate(&hermes_data::Type::String(str_ty)).is_err());
}

#[test]
fn test_validate_enum_valid() {
    let enum_ty = EnumeratedType {
        encoding: IntegerType {
            size_in_bits: 8,
            signed: false,
            byte_order: ByteOrder::BigEndian,
            encoding: hermes_xtce::IntegerEncodingType::Unsigned,
            calibrator: Calibrator::None,
        },
        enumeration_list: vec![
            EnumerationEntry {
                label: "OFF".to_string(),
                value: 0,
                short_description: None,
            },
            EnumerationEntry {
                label: "ON".to_string(),
                value: 1,
                short_description: None,
            },
        ],
    };

    let value = Value::Enumerated(hermes_data::EnumerationValue {
        label: "ON".to_string(),
        value: 1,
    });

    assert!(
        value
            .validate(&hermes_data::Type::Enumerated(enum_ty))
            .is_ok()
    );
}

#[test]
fn test_validate_enum_invalid() {
    let enum_ty = EnumeratedType {
        encoding: IntegerType {
            size_in_bits: 8,
            signed: false,
            byte_order: ByteOrder::BigEndian,
            encoding: hermes_xtce::IntegerEncodingType::Unsigned,
            calibrator: Calibrator::None,
        },
        enumeration_list: vec![
            EnumerationEntry {
                label: "OFF".to_string(),
                value: 0,
                short_description: None,
            },
            EnumerationEntry {
                label: "ON".to_string(),
                value: 1,
                short_description: None,
            },
        ],
    };

    // Value not in enumeration list
    let value = Value::Enumerated(hermes_data::EnumerationValue {
        label: "UNKNOWN".to_string(),
        value: 99,
    });

    assert!(
        value
            .validate(&hermes_data::Type::Enumerated(enum_ty))
            .is_err()
    );
}

#[test]
fn test_validate_aggregate_valid() {
    use hermes_data::{AggregateType, AggregateValue, Member};

    let agg_ty = AggregateType {
        members: vec![
            Member {
                name: "field1".to_string(),
                type_: hermes_data::Type::Integer(IntegerType {
                    size_in_bits: 8,
                    signed: false,
                    byte_order: ByteOrder::BigEndian,
                    encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                    calibrator: Calibrator::None,
                }),
            },
            Member {
                name: "field2".to_string(),
                type_: hermes_data::Type::Integer(IntegerType {
                    size_in_bits: 16,
                    signed: false,
                    byte_order: ByteOrder::BigEndian,
                    encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                    calibrator: Calibrator::None,
                }),
            },
        ],
    };

    let value = Value::Aggregate(AggregateValue::new(vec![
        ("field1".to_string(), Value::UnsignedInteger(100)),
        ("field2".to_string(), Value::UnsignedInteger(200)),
    ]));

    assert!(
        value
            .validate(&hermes_data::Type::Aggregate(agg_ty))
            .is_ok()
    );
}

#[test]
fn test_validate_aggregate_missing_member() {
    use hermes_data::{AggregateType, AggregateValue, Member};

    let agg_ty = AggregateType {
        members: vec![
            Member {
                name: "field1".to_string(),
                type_: hermes_data::Type::Integer(IntegerType {
                    size_in_bits: 8,
                    signed: false,
                    byte_order: ByteOrder::BigEndian,
                    encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                    calibrator: Calibrator::None,
                }),
            },
            Member {
                name: "field2".to_string(),
                type_: hermes_data::Type::Integer(IntegerType {
                    size_in_bits: 16,
                    signed: false,
                    byte_order: ByteOrder::BigEndian,
                    encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                    calibrator: Calibrator::None,
                }),
            },
        ],
    };

    // Missing field2
    let value = Value::Aggregate(AggregateValue::new(vec![(
        "field1".to_string(),
        Value::UnsignedInteger(100),
    )]));

    assert!(
        value
            .validate(&hermes_data::Type::Aggregate(agg_ty))
            .is_err()
    );
}

#[test]
fn test_validate_aggregate_extra_member() {
    use hermes_data::{AggregateType, AggregateValue, Member};

    let agg_ty = AggregateType {
        members: vec![Member {
            name: "field1".to_string(),
            type_: hermes_data::Type::Integer(IntegerType {
                size_in_bits: 8,
                signed: false,
                byte_order: ByteOrder::BigEndian,
                encoding: hermes_xtce::IntegerEncodingType::Unsigned,
                calibrator: Calibrator::None,
            }),
        }],
    };

    // Extra field (field2) not in type
    let value = Value::Aggregate(AggregateValue::new(vec![
        ("field1".to_string(), Value::UnsignedInteger(100)),
        ("field2".to_string(), Value::UnsignedInteger(200)),
    ]));

    assert!(
        value
            .validate(&hermes_data::Type::Aggregate(agg_ty))
            .is_err()
    );
}
