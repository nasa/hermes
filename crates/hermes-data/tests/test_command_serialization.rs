use hermes_data::{
    ByteOrder, Calibrator, EnumeratedType, EnumerationEntry, FloatSize, FloatType, IntegerType,
    MissionDatabase, Result, StringType, Value, VariableSize, ser::Serializer,
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

#[test]
fn test_command_container_parsing() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/command_with_container.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Get the TestCommand
    let cmd = mdb
        .get_command("/TestCmd/TestCommand")
        .expect("Command should exist");

    println!("Command: {}", cmd.head.name);
    println!("  Arguments: {}", cmd.args.len());

    // Verify command has a container
    assert!(
        cmd.command_container.is_some(),
        "Command should have a container"
    );

    let container = cmd.command_container.as_ref().unwrap();
    println!("  Container name: {}", container.name);
    println!("  Container entries: {}", container.entries.len());

    // Should have 3 entries: FixedValue (sync word), ArgumentRef (CmdId), ArgumentRef (Value)
    assert_eq!(
        container.entries.len(),
        3,
        "Container should have 3 entries"
    );

    // Check entry types
    match &container.entries[0] {
        hermes_data::SequenceEntry::FixedValue { value, type_ } => {
            println!("  Entry 0: FixedValue");
            // Should be the sync word 0xDEAD
            if let Value::Binary(bytes) = value {
                assert_eq!(bytes, &vec![0xDE, 0xAD], "Sync word should be 0xDEAD");
            } else {
                panic!("Expected Binary value for FixedValue");
            }
        }
        _ => panic!("Expected FixedValue entry at position 0"),
    }

    match &container.entries[1] {
        hermes_data::SequenceEntry::ArgumentRef(arg) => {
            println!("  Entry 1: ArgumentRef({})", arg.head.name);
            assert_eq!(arg.head.name, "CmdId", "Second entry should be CmdId");
        }
        _ => panic!("Expected ArgumentRef entry at position 1"),
    }

    match &container.entries[2] {
        hermes_data::SequenceEntry::ArgumentRef(arg) => {
            println!("  Entry 2: ArgumentRef({})", arg.head.name);
            assert_eq!(arg.head.name, "Value", "Third entry should be Value");
        }
        _ => panic!("Expected ArgumentRef entry at position 2"),
    }

    Ok(())
}

#[test]
fn test_command_structure_for_serialization() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/command_with_container.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let cmd = mdb
        .get_command("/TestCmd/TestCommand")
        .expect("Command should exist");

    // Verify command structure for serialization
    assert_eq!(cmd.args.len(), 2, "Should have 2 arguments");

    let container = cmd
        .command_container
        .as_ref()
        .expect("Command should have container");

    // Verify container can be used for binary encoding
    // The container entries define the binary layout:
    // 1. FixedValue: 0xDEAD (2 bytes)
    // 2. ArgumentRef: CmdId (1 byte, U8)
    // 3. ArgumentRef: Value (2 bytes, U16)
    // Total: 5 bytes

    // Count total bits
    let mut total_bits = 0;

    for entry in &container.entries {
        match entry {
            hermes_data::SequenceEntry::FixedValue { type_, .. } => {
                // Binary type with fixed size
                if let hermes_data::Type::Binary(bin_ty) = type_.as_ref() {
                    if let hermes_data::VariableSize::Fixed(bits) = bin_ty.size {
                        total_bits += bits;
                        println!("  FixedValue: {} bits", bits);
                    }
                }
            }
            hermes_data::SequenceEntry::ArgumentRef(arg)
            | hermes_data::SequenceEntry::ParameterRef(arg) => {
                // Get argument type size
                if let hermes_data::Type::Integer(int_ty) = arg.type_.as_ref() {
                    total_bits += int_ty.size_in_bits as usize;
                    println!("  Argument {}: {} bits", arg.head.name, int_ty.size_in_bits);
                }
            }
            _ => {}
        }
    }

    println!("Total command size: {} bits ({} bytes)", total_bits, total_bits / 8);
    assert_eq!(total_bits, 40, "Command should be 40 bits (5 bytes)");

    Ok(())
}

#[test]
fn test_command_without_container() -> Result<()> {
    // Load minimal command that has no CommandContainer
    let xtce = include_str!("../../hermes-xtce/tests/data/minimal_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let cmd = mdb
        .get_command("/Minimal/SetMode")
        .expect("Command should exist");

    // Command should have no container (CommandContainer is optional in XTCE)
    assert!(
        cmd.command_container.is_none(),
        "Minimal command should not have a container"
    );

    // But it should still have arguments
    assert_eq!(cmd.args.len(), 1, "Should have 1 argument");

    Ok(())
}

#[test]
fn test_serialize_command_with_container() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/command_with_container.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let cmd = mdb
        .get_command("/TestCmd/TestCommand")
        .expect("Command should exist");

    let container = cmd
        .command_container
        .as_ref()
        .expect("Command should have container");

    // Simulate serializing a command with argument values:
    // CmdId = 0x05, Value = 0xABCD
    // Expected output: 0xDEAD (sync), 0x05 (CmdId), 0xABCD (Value)
    // Total: [0xDE, 0xAD, 0x05, 0xAB, 0xCD]

    let mut serializer = Serializer::new();

    // Serialize each entry in the container
    for entry in &container.entries {
        match entry {
            hermes_data::SequenceEntry::FixedValue { value, type_ } => {
                // Serialize fixed value
                serializer.serialize_value(type_, value)?;
            }
            hermes_data::SequenceEntry::ArgumentRef(arg) => {
                // In a real implementation, these would come from user input
                // For testing, we'll provide sample values
                let test_value = if arg.head.name == "CmdId" {
                    Value::UnsignedInteger(0x05)
                } else if arg.head.name == "Value" {
                    Value::UnsignedInteger(0xABCD)
                } else {
                    panic!("Unexpected argument: {}", arg.head.name);
                };

                serializer.serialize_value(&arg.type_, &test_value)?;
            }
            _ => {}
        }
    }

    let bytes = serializer.into_bytes();
    println!("Serialized command: {:02X?}", bytes);

    // Verify serialization
    assert_eq!(
        bytes,
        vec![0xDE, 0xAD, 0x05, 0xAB, 0xCD],
        "Command should serialize to sync word + arguments"
    );

    Ok(())
}
