mod common;

use hermes_data::{MissionDatabase, Value};

/// Helper to create a simple XTCE document with a container and parameters
/// Parameter names in entries must match the parameter names exactly (case-sensitive)
fn create_test_xtce(
    parameter_types: &str,
    parameters: &str,
    container_entries: &str,
) -> hermes_xtce::SpaceSystem {
    let xml_content = format!(
        r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      {parameter_types}
    </ParameterTypeSet>
    <ParameterSet>
      {parameters}
    </ParameterSet>
    <ContainerSet>
      <SequenceContainer name="TestPacket">
        <EntryList>
          {container_entries}
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#
    );

    hermes_xtce::from_str(&xml_content).expect("Failed to parse test XTCE")
}

#[test_log::test]
fn test_deserialize_unsigned_integers() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<IntegerParameterType name="U8" signed="false" sizeInBits="8">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="8" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="U16" signed="false" sizeInBits="16">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="16" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="U32" signed="false" sizeInBits="32">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="32" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>"#,
        r#"<Parameter name="Field1" parameterTypeRef="U8" />
           <Parameter name="Field2" parameterTypeRef="U16" />
           <Parameter name="Field3" parameterTypeRef="U32" />"#,
        r#"<ParameterRefEntry parameterRef="Field1" />
           <ParameterRefEntry parameterRef="Field2" />
           <ParameterRefEntry parameterRef="Field3" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: U8=0x42, U16=0x1234, U32=0x12345678
    let data = vec![0x42, 0x12, 0x34, 0x12, 0x34, 0x56, 0x78];

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Field1 (U8)
    let field1 = packet
        .parameters
        .get("/TestSystem/Field1")
        .expect("Field1 not found");
    assert_eq!(field1.len(), 1);
    match &field1[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x42),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Field2 (U16)
    let field2 = packet
        .parameters
        .get("/TestSystem/Field2")
        .expect("Field2 not found");
    assert_eq!(field2.len(), 1);
    match &field2[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x1234),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Field3 (U32)
    let field3 = packet
        .parameters
        .get("/TestSystem/Field3")
        .expect("Field3 not found");
    assert_eq!(field3.len(), 1);
    match &field3[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x12345678),
        _ => panic!("Expected UnsignedInteger"),
    }
}

#[test_log::test]
fn test_deserialize_signed_integers_twos_complement() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<IntegerParameterType name="I8" signed="true" sizeInBits="8">
            <IntegerDataEncoding encoding="twosComplement" sizeInBits="8" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="I16" signed="true" sizeInBits="16">
            <IntegerDataEncoding encoding="twosComplement" sizeInBits="16" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="I32" signed="true" sizeInBits="32">
            <IntegerDataEncoding encoding="twosComplement" sizeInBits="32" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>"#,
        r#"<Parameter name="Positive" parameterTypeRef="I8" />
           <Parameter name="Negative" parameterTypeRef="I8" />
           <Parameter name="LargeNeg" parameterTypeRef="I16" />"#,
        r#"<ParameterRefEntry parameterRef="Positive" />
           <ParameterRefEntry parameterRef="Negative" />
           <ParameterRefEntry parameterRef="LargeNeg" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: I8=42, I8=-10, I16=-1000
    let data = vec![42, 0xF6, 0xFC, 0x18]; // -10 = 0xF6, -1000 = 0xFC18

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Positive
    let positive = packet
        .parameters
        .get("/TestSystem/Positive")
        .expect("Positive not found");
    match &positive[0].raw_value {
        Value::SignedInteger(v) => assert_eq!(*v, 42),
        _ => panic!("Expected SignedInteger"),
    }

    // Verify Negative
    let negative = packet
        .parameters
        .get("/TestSystem/Negative")
        .expect("Negative not found");
    match &negative[0].raw_value {
        Value::SignedInteger(v) => assert_eq!(*v, -10),
        _ => panic!("Expected SignedInteger"),
    }

    // Verify LargeNeg
    let large_neg = packet
        .parameters
        .get("/TestSystem/LargeNeg")
        .expect("LargeNeg not found");
    match &large_neg[0].raw_value {
        Value::SignedInteger(v) => assert_eq!(*v, -1000),
        _ => panic!("Expected SignedInteger"),
    }
}

#[test_log::test]
fn test_deserialize_floats() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<FloatParameterType name="F32" sizeInBits="32">
            <FloatDataEncoding sizeInBits="32" encoding="IEEE754_1985" byteOrder="mostSignificantByteFirst" />
           </FloatParameterType>
           <FloatParameterType name="F64" sizeInBits="64">
            <FloatDataEncoding sizeInBits="64" encoding="IEEE754_1985" byteOrder="mostSignificantByteFirst" />
           </FloatParameterType>"#,
        r#"<Parameter name="Temperature" parameterTypeRef="F32" />
           <Parameter name="Pressure" parameterTypeRef="F64" />"#,
        r#"<ParameterRefEntry parameterRef="Temperature" />
           <ParameterRefEntry parameterRef="Pressure" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: F32=3.14159, F64=2.718281828
    let temp_f32: f32 = 3.14159;
    let pressure_f64: f64 = 2.718281828;

    let data = [
        temp_f32.to_be_bytes().as_slice(),
        pressure_f64.to_be_bytes().as_slice(),
    ]
    .concat();

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Temperature
    let temperature = packet
        .parameters
        .get("/TestSystem/Temperature")
        .expect("Temperature not found");
    match &temperature[0].raw_value {
        Value::Float(v) => assert!((*v - 3.14159).abs() < 0.0001),
        _ => panic!("Expected Float"),
    }

    // Verify Pressure
    let pressure = packet
        .parameters
        .get("/TestSystem/Pressure")
        .expect("Pressure not found");
    match &pressure[0].raw_value {
        Value::Float(v) => assert!((*v - 2.718281828).abs() < 0.0000001),
        _ => panic!("Expected Float"),
    }
}

#[test_log::test]
fn test_deserialize_boolean_integer_encoding() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<BooleanParameterType name="bool" oneStringValue="True" zeroStringValue="False">
            <IntegerDataEncoding sizeInBits="8" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
           </BooleanParameterType>"#,
        r#"<Parameter name="Flag1" parameterTypeRef="bool" />
           <Parameter name="Flag2" parameterTypeRef="bool" />"#,
        r#"<ParameterRefEntry parameterRef="Flag1" />
           <ParameterRefEntry parameterRef="Flag2" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: Flag1=true (1), Flag2=false (0)
    let data = vec![1, 0];

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Flag1
    let flag1 = packet
        .parameters
        .get("/TestSystem/Flag1")
        .expect("Flag1 not found");
    match &flag1[0].raw_value {
        Value::Boolean(v) => assert_eq!(*v, true),
        _ => panic!("Expected Boolean"),
    }

    // Verify Flag2
    let flag2 = packet
        .parameters
        .get("/TestSystem/Flag2")
        .expect("Flag2 not found");
    match &flag2[0].raw_value {
        Value::Boolean(v) => assert_eq!(*v, false),
        _ => panic!("Expected Boolean"),
    }
}

#[test_log::test]
fn test_deserialize_string_fixed_size() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<StringParameterType name="FixedString">
            <StringDataEncoding encoding="UTF-8">
              <SizeInBits>
                <Fixed>
                  <FixedValue>64</FixedValue>
                </Fixed>
              </SizeInBits>
            </StringDataEncoding>
           </StringParameterType>"#,
        r#"<Parameter name="Message" parameterTypeRef="FixedString" />"#,
        r#"<ParameterRefEntry parameterRef="Message" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: "Hello" padded to 8 bytes
    let data = b"Hello\0\0\0".to_vec();

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Message
    let message = packet
        .parameters
        .get("/TestSystem/Message")
        .expect("Message not found");
    match &message[0].raw_value {
        Value::String(s) => {
            assert!(s.starts_with("Hello"));
        }
        _ => panic!("Expected String"),
    }
}

#[test_log::test]
fn test_deserialize_string_leading_size() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<StringParameterType name="VarString">
            <StringDataEncoding encoding="UTF-8">
              <Variable maxSizeInBits="256">
                <LeadingSize sizeInBitsOfSizeTag="16" />
              </Variable>
            </StringDataEncoding>
           </StringParameterType>"#,
        r#"<Parameter name="DynamicMessage" parameterTypeRef="VarString" />"#,
        r#"<ParameterRefEntry parameterRef="DynamicMessage" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: 16-bit length (5) followed by "World"
    let mut data = vec![0x00, 0x05]; // length = 5 bytes
    data.extend_from_slice(b"World");

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify DynamicMessage
    let message = packet
        .parameters
        .get("/TestSystem/DynamicMessage")
        .expect("DynamicMessage not found");
    match &message[0].raw_value {
        Value::String(s) => assert_eq!(s, "World"),
        _ => panic!("Expected String"),
    }
}

#[test_log::test]
fn test_deserialize_string_termination_char() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<StringParameterType name="NullTermString">
            <StringDataEncoding encoding="UTF-8">
              <Variable maxSizeInBits="256">
                <TerminationChar>00</TerminationChar>
              </Variable>
            </StringDataEncoding>
           </StringParameterType>"#,
        r#"<Parameter name="CString" parameterTypeRef="NullTermString" />"#,
        r#"<ParameterRefEntry parameterRef="CString" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: "Test\0" (null-terminated)
    let data = b"Test\0".to_vec();

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify CString
    let cstring = packet
        .parameters
        .get("/TestSystem/CString")
        .expect("CString not found");
    match &cstring[0].raw_value {
        Value::String(s) => assert_eq!(s, "Test"),
        _ => panic!("Expected String"),
    }
}

#[test_log::test]
fn test_deserialize_binary_fixed_size() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<BinaryParameterType name="Binary8">
            <BinaryDataEncoding>
              <SizeInBits>
                <FixedValue>64</FixedValue>
              </SizeInBits>
            </BinaryDataEncoding>
           </BinaryParameterType>"#,
        r#"<Parameter name="RawData" parameterTypeRef="Binary8" />"#,
        r#"<ParameterRefEntry parameterRef="RawData" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: 8 bytes of binary data
    let data = vec![0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08];

    let packet = mdb.deserialize(data.clone()).expect("Failed to deserialize");

    // Verify RawData
    let raw_data = packet
        .parameters
        .get("/TestSystem/RawData")
        .expect("RawData not found");
    match &raw_data[0].raw_value {
        Value::Binary(b) => assert_eq!(b, &data),
        _ => panic!("Expected Binary"),
    }
}

#[test_log::test]
fn test_deserialize_little_endian() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<IntegerParameterType name="U16LE" signed="false" sizeInBits="16">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="16" byteOrder="leastSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="U32LE" signed="false" sizeInBits="32">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="32" byteOrder="leastSignificantByteFirst" />
           </IntegerParameterType>"#,
        r#"<Parameter name="Value16" parameterTypeRef="U16LE" />
           <Parameter name="Value32" parameterTypeRef="U32LE" />"#,
        r#"<ParameterRefEntry parameterRef="Value16" />
           <ParameterRefEntry parameterRef="Value32" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: U16=0x1234 (LE), U32=0x12345678 (LE)
    let data = vec![0x34, 0x12, 0x78, 0x56, 0x34, 0x12];

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Value16
    let value16 = packet
        .parameters
        .get("/TestSystem/Value16")
        .expect("Value16 not found");
    match &value16[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x1234),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Value32
    let value32 = packet
        .parameters
        .get("/TestSystem/Value32")
        .expect("Value32 not found");
    match &value32[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x12345678),
        _ => panic!("Expected UnsignedInteger"),
    }
}

#[test_log::test]
fn test_deserialize_bit_fields() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<IntegerParameterType name="Bits3" signed="false">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="3" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="Bits5" signed="false">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="5" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="Bits4" signed="false">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="4" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>
           <IntegerParameterType name="Bits4_2" signed="false">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="4" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>"#,
        r#"<Parameter name="Field1" parameterTypeRef="Bits3" />
           <Parameter name="Field2" parameterTypeRef="Bits5" />
           <Parameter name="Field3" parameterTypeRef="Bits4" />
           <Parameter name="Field4" parameterTypeRef="Bits4_2" />"#,
        r#"<ParameterRefEntry parameterRef="Field1" />
           <ParameterRefEntry parameterRef="Field2" />
           <ParameterRefEntry parameterRef="Field3" />
           <ParameterRefEntry parameterRef="Field4" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: 3 bits (0b101) + 5 bits (0b11010) + 4 bits (0b1100) + 4 bits (0b0011)
    // Binary: 101 11010 1100 0011 = 10111010 11000011 = 0xBA 0xC3
    let data = vec![0b10111010, 0b11000011];

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Field1 (3 bits = 0b101 = 5)
    let field1 = packet
        .parameters
        .get("/TestSystem/Field1")
        .expect("Field1 not found");
    match &field1[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0b101),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Field2 (5 bits = 0b11010 = 26)
    let field2 = packet
        .parameters
        .get("/TestSystem/Field2")
        .expect("Field2 not found");
    match &field2[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0b11010),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Field3 (4 bits = 0b1100 = 12)
    let field3 = packet
        .parameters
        .get("/TestSystem/Field3")
        .expect("Field3 not found");
    match &field3[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0b1100),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Field4 (4 bits = 0b0011 = 3)
    let field4 = packet
        .parameters
        .get("/TestSystem/Field4")
        .expect("Field4 not found");
    match &field4[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0b0011),
        _ => panic!("Expected UnsignedInteger"),
    }
}

#[test_log::test]
fn test_deserialize_with_calibration() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<IntegerParameterType name="RawTemp" signed="false" sizeInBits="16">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="16" byteOrder="mostSignificantByteFirst">
              <DefaultCalibrator>
                <PolynomialCalibrator>
                  <Term coefficient="0.1" exponent="1" />
                  <Term coefficient="-50.0" exponent="0" />
                </PolynomialCalibrator>
              </DefaultCalibrator>
            </IntegerDataEncoding>
           </IntegerParameterType>"#,
        r#"<Parameter name="Temperature" parameterTypeRef="RawTemp" />"#,
        r#"<ParameterRefEntry parameterRef="Temperature" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create test data: raw value = 1000, calibrated should be 1000 * 0.1 - 50 = 50.0
    let data = vec![0x03, 0xE8]; // 1000 in big endian

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Temperature
    let temperature = packet
        .parameters
        .get("/TestSystem/Temperature")
        .expect("Temperature not found");
    match &temperature[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 1000),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify calibrated value
    assert!(temperature[0].calibrated_value.is_some());
    let calibrated = temperature[0].calibrated_value.unwrap();
    assert!((calibrated - 50.0).abs() < 0.001);
}

// Tests for containers with restriction criteria using aggregate member references
// are now supported and tested below

#[test_log::test]
fn test_deserialize_repeat_entry() {
    let _guard = common::assert_no_warnings();

    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="U8" signed="false" sizeInBits="8">
        <IntegerDataEncoding encoding="unsigned" sizeInBits="8" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
      <IntegerParameterType name="U16" signed="false" sizeInBits="16">
        <IntegerDataEncoding encoding="unsigned" sizeInBits="16" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
    </ParameterTypeSet>
    <ParameterSet>
      <Parameter name="Count" parameterTypeRef="U8" />
      <Parameter name="Value" parameterTypeRef="U16" />
    </ParameterSet>
    <ContainerSet>
      <SequenceContainer name="RepeatedPacket">
        <EntryList>
          <ParameterRefEntry parameterRef="Count" />
          <ParameterRefEntry parameterRef="Value">
            <RepeatEntry>
              <Count>
                <DynamicValue>
                  <ParameterInstanceRef parameterRef="Count" />
                </DynamicValue>
              </Count>
              <Offset>
                <FixedValue>0</FixedValue>
              </Offset>
            </RepeatEntry>
          </ParameterRefEntry>
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system = hermes_xtce::from_str(xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // Create test data: Count=3, then three U16 values: 0x1111, 0x2222, 0x3333
    let data = vec![0x03, 0x11, 0x11, 0x22, 0x22, 0x33, 0x33];

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Count
    let count = packet
        .parameters
        .get("/TestSystem/Count")
        .expect("Count not found");
    assert_eq!(count.len(), 1);
    match &count[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 3),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify Value (should have 3 instances)
    let values = packet
        .parameters
        .get("/TestSystem/Value")
        .expect("Value not found");
    assert_eq!(values.len(), 3, "Should have 3 repeated values");

    match &values[0].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x1111),
        _ => panic!("Expected UnsignedInteger"),
    }

    match &values[1].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x2222),
        _ => panic!("Expected UnsignedInteger"),
    }

    match &values[2].raw_value {
        Value::UnsignedInteger(v) => assert_eq!(*v, 0x3333),
        _ => panic!("Expected UnsignedInteger"),
    }
}

#[test_log::test]
fn test_deserialize_parameter_bit_positions() {
    let _guard = common::assert_no_warnings();

    let space_system = create_test_xtce(
        r#"<IntegerParameterType name="U8" signed="false" sizeInBits="8">
            <IntegerDataEncoding encoding="unsigned" sizeInBits="8" byteOrder="mostSignificantByteFirst" />
           </IntegerParameterType>"#,
        r#"<Parameter name="Field1" parameterTypeRef="U8" />
           <Parameter name="Field2" parameterTypeRef="U8" />"#,
        r#"<ParameterRefEntry parameterRef="Field1" />
           <ParameterRefEntry parameterRef="Field2" />"#,
    );

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    let data = vec![0x12, 0x34];

    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify Field1 bit positions
    let field1 = packet
        .parameters
        .get("/TestSystem/Field1")
        .expect("Field1 not found");
    assert_eq!(field1[0].start_bit, 0);
    assert_eq!(field1[0].end_bit, 8);

    // Verify Field2 bit positions
    let field2 = packet
        .parameters
        .get("/TestSystem/Field2")
        .expect("Field2 not found");
    assert_eq!(field2[0].start_bit, 8);
    assert_eq!(field2[0].end_bit, 16);
}
