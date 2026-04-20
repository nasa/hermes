use hermes_data::{
    ByteOrder, Calibrator, EnumeratedType, EnumerationEntry, FloatSize, FloatType, IntegerType, Result,
    StringType, Value, VariableSize, ser::Serializer,
};

#[test]
fn test_serialize_unsigned_integer_big_endian() -> Result<()> {
    let mut serializer = Serializer::new();

    let int_ty = IntegerType {
        size_in_bits: 16,
        signed: false,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    let value = Value::UnsignedInteger(0x1234);
    serializer.serialize_value(&hermes_data::Type::Integer(int_ty), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, vec![0x12, 0x34]);

    Ok(())
}

#[test]
fn test_serialize_unsigned_integer_little_endian() -> Result<()> {
    let mut serializer = Serializer::new();

    let int_ty = IntegerType {
        size_in_bits: 16,
        signed: false,
        byte_order: ByteOrder::LittleEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    let value = Value::UnsignedInteger(0x1234);
    serializer.serialize_value(&hermes_data::Type::Integer(int_ty), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, vec![0x34, 0x12]);

    Ok(())
}

#[test]
fn test_serialize_signed_integer() -> Result<()> {
    let mut serializer = Serializer::new();

    let int_ty = IntegerType {
        size_in_bits: 16,
        signed: true,
        byte_order: ByteOrder::BigEndian,
        encoding: hermes_xtce::IntegerEncodingType::Unsigned,
        calibrator: Calibrator::None,
    };

    // Test positive value
    let value = Value::SignedInteger(0x1234);
    serializer.serialize_value(&hermes_data::Type::Integer(int_ty.clone()), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, vec![0x12, 0x34]);

    // Test negative value
    let mut serializer = Serializer::new();
    let value = Value::SignedInteger(-1);
    serializer.serialize_value(&hermes_data::Type::Integer(int_ty), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, vec![0xFF, 0xFF]);

    Ok(())
}

#[test]
fn test_serialize_float32() -> Result<()> {
    let mut serializer = Serializer::new();

    let float_ty = FloatType {
        size_in_bits: FloatSize::F32,
        byte_order: ByteOrder::BigEndian,
        calibrator: Calibrator::None,
    };

    let value = Value::Float(1.5);
    serializer.serialize_value(&hermes_data::Type::Float(float_ty), &value)?;

    let bytes = serializer.into_bytes();
    let expected = 1.5f32.to_be_bytes();
    assert_eq!(bytes, expected);

    Ok(())
}

#[test]
fn test_serialize_float64() -> Result<()> {
    let mut serializer = Serializer::new();

    let float_ty = FloatType {
        size_in_bits: FloatSize::F64,
        byte_order: ByteOrder::BigEndian,
        calibrator: Calibrator::None,
    };

    let value = Value::Float(3.14159);
    serializer.serialize_value(&hermes_data::Type::Float(float_ty), &value)?;

    let bytes = serializer.into_bytes();
    let expected = 3.14159f64.to_be_bytes();
    assert_eq!(bytes, expected);

    Ok(())
}

#[test]
fn test_serialize_string_fixed() -> Result<()> {
    let mut serializer = Serializer::new();

    let str_ty = StringType {
        encoding: hermes_data::StringEncoding::Utf8,
        size: VariableSize::Fixed(32), // 4 bytes
    };

    let value = Value::String("TEST".to_string());
    serializer.serialize_value(&hermes_data::Type::String(str_ty), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, b"TEST");

    Ok(())
}

#[test]
fn test_serialize_string_with_leading_size() -> Result<()> {
    let mut serializer = Serializer::new();

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
            max_size_in_bits: 1024,
        },
    };

    let value = Value::String("HELLO".to_string());
    serializer.serialize_value(&hermes_data::Type::String(str_ty), &value)?;

    let bytes = serializer.into_bytes();
    // Length prefix (5) followed by "HELLO"
    assert_eq!(bytes, vec![5, b'H', b'E', b'L', b'L', b'O']);

    Ok(())
}

#[test]
fn test_serialize_enum() -> Result<()> {
    let mut serializer = Serializer::new();

    let enum_ty = EnumeratedType {
        encoding: IntegerType {
            size_in_bits: 16,
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

    serializer.serialize_value(&hermes_data::Type::Enumerated(enum_ty), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, vec![0x00, 0x01]);

    Ok(())
}

#[test]
fn test_serialize_aggregate() -> Result<()> {
    use hermes_data::{AggregateType, AggregateValue, Member};

    let mut serializer = Serializer::new();

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
        ("field1".to_string(), Value::UnsignedInteger(0x42)),
        ("field2".to_string(), Value::UnsignedInteger(0x1234)),
    ]));

    serializer.serialize_value(&hermes_data::Type::Aggregate(agg_ty), &value)?;

    let bytes = serializer.into_bytes();
    assert_eq!(bytes, vec![0x42, 0x12, 0x34]);

    Ok(())
}
