mod common;

use hermes_data::MissionDatabase;

/// Verify that the deserialization context stores and looks up parameters
/// using fully qualified names, not simple names.
#[test_log::test]
fn test_deserialization_uses_fully_qualified_names() {
    let _guard = common::assert_no_warnings();

    // Create a simple XTCE with two parameters that have similar names
    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="U8" signed="false">
        <IntegerDataEncoding sizeInBits="8" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
    </ParameterTypeSet>

    <ParameterSet>
      <Parameter name="ValueA" parameterTypeRef="U8" />
      <Parameter name="ValueB" parameterTypeRef="U8" />
    </ParameterSet>

    <ContainerSet>
      <SequenceContainer name="Root">
        <EntryList>
          <ParameterRefEntry parameterRef="ValueA" />
          <ParameterRefEntry parameterRef="ValueB" />
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Deserialize data: ValueA=0x10, ValueB=0x20
    let data = vec![0x10, 0x20];
    let packet = mdb.deserialize(data).expect("Failed to deserialize");

    // Verify that both parameters are stored with their fully qualified names

    // Check ValueA
    let value_a = packet
        .parameters
        .get("/TestSystem/ValueA")
        .expect("ValueA not found - deserialization should use fully qualified names");

    assert_eq!(value_a.len(), 1);
    match &value_a[0].raw_value {
        hermes_data::Value::UnsignedInteger(v) => assert_eq!(*v, 0x10),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Check ValueB
    let value_b = packet
        .parameters
        .get("/TestSystem/ValueB")
        .expect("ValueB not found - deserialization should use fully qualified names");

    assert_eq!(value_b.len(), 1);
    match &value_b[0].raw_value {
        hermes_data::Value::UnsignedInteger(v) => assert_eq!(*v, 0x20),
        _ => panic!("Expected UnsignedInteger"),
    }

    // Verify that we have exactly 2 parameters
    assert_eq!(
        packet.parameters.len(),
        2,
        "Should have 2 distinct parameters with different fully qualified names"
    );

    // Verify that simple name lookups would fail (should not be present)
    assert!(
        packet.parameters.get("ValueA").is_none(),
        "Simple name 'ValueA' should not be present - only fully qualified names should be used"
    );
    assert!(
        packet.parameters.get("ValueB").is_none(),
        "Simple name 'ValueB' should not be present - only fully qualified names should be used"
    );
}
