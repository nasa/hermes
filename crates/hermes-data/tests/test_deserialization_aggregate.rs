mod common;

use hermes_data::MissionDatabase;

#[test_log::test]
fn test_deserialize_with_aggregate_member_restriction() {
    let _guard = common::assert_no_warnings();

    // Create an XTCE document with an aggregate type and restriction criteria
    // that reference aggregate members (like CCSDS_Packet_ID/Version)
    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <!-- Define component types for the aggregate -->
      <IntegerParameterType name="VersionType" signed="false">
        <IntegerDataEncoding sizeInBits="3" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
      <IntegerParameterType name="TypeType" signed="false">
        <IntegerDataEncoding sizeInBits="1" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
      <IntegerParameterType name="APIDType" signed="false">
        <IntegerDataEncoding sizeInBits="11" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>

      <!-- Define aggregate type for packet ID -->
      <AggregateParameterType name="PacketIDType">
        <MemberList>
          <Member name="Version" typeRef="VersionType" />
          <Member name="Type" typeRef="TypeType" />
          <Member name="APID" typeRef="APIDType" />
        </MemberList>
      </AggregateParameterType>

      <!-- Define a simple data type -->
      <IntegerParameterType name="U32" signed="false">
        <IntegerDataEncoding sizeInBits="32" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
    </ParameterTypeSet>

    <ParameterSet>
      <Parameter name="Packet_ID" parameterTypeRef="PacketIDType" />
      <Parameter name="Counter" parameterTypeRef="U32" />
    </ParameterSet>

    <ContainerSet>
      <!-- Base container with packet ID (abstract, so it will check children) -->
      <SequenceContainer name="BasePacket" abstract="true">
        <EntryList>
          <ParameterRefEntry parameterRef="Packet_ID" />
        </EntryList>
      </SequenceContainer>

      <!-- Child container that matches when Version=0 and APID=42 -->
      <SequenceContainer name="TelemetryPacket">
        <BaseContainer containerRef="BasePacket">
          <RestrictionCriteria>
            <ComparisonList>
              <Comparison parameterRef="Packet_ID/Version" value="0" comparisonOperator="==" />
              <Comparison parameterRef="Packet_ID/APID" value="42" comparisonOperator="==" />
            </ComparisonList>
          </RestrictionCriteria>
        </BaseContainer>
        <EntryList>
          <ParameterRefEntry parameterRef="Counter" />
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create packet data that matches the restriction criteria
    // Packet_ID aggregate (15 bits):
    //   Version=0 (3 bits):  0b000
    //   Type=0 (1 bit):      0b0
    //   APID=42 (11 bits):   0b00000101010
    // Counter (32 bits): 0x12345678
    //
    // Combined bits: 000_0_00000101010 + 00010010001101000101011001111000 (47 bits total)
    // Packed into bytes (big-endian):
    //   0x00, 0x54, 0x24, 0x68, 0xAC, 0xF0

    let data = vec![0x00, 0x54, 0x24, 0x68, 0xAC, 0xF0];

    let packet = mdb.deserialize(&data).expect("Failed to deserialize");

    // Verify the aggregate parameter was deserialized
    let packet_id = packet
        .parameters
        .get("/TestSystem/Packet_ID")
        .expect("Packet_ID not found");

    assert_eq!(packet_id.len(), 1, "Should have one instance of Packet_ID");

    // Verify the aggregate value structure
    if let hermes_data::Value::Aggregate(agg) = &packet_id[0].raw_value {
        // Check Version member
        let version = agg.get("Version").expect("Version member not found");
        assert_eq!(
            *version,
            hermes_data::Value::UnsignedInteger(0),
            "Version should be 0"
        );

        // Check Type member
        let type_val = agg.get("Type").expect("Type member not found");
        assert_eq!(
            *type_val,
            hermes_data::Value::UnsignedInteger(0),
            "Type should be 0"
        );

        // Check APID member
        let apid = agg.get("APID").expect("APID member not found");
        assert_eq!(
            *apid,
            hermes_data::Value::UnsignedInteger(42),
            "APID should be 42"
        );
    } else {
        panic!("Packet_ID should be an aggregate value");
    }

    // Verify the counter was deserialized
    let counter = packet
        .parameters
        .get("/TestSystem/Counter")
        .expect("Counter not found");

    assert_eq!(counter.len(), 1, "Should have one instance of Counter");
    assert_eq!(
        counter[0].raw_value,
        hermes_data::Value::UnsignedInteger(0x12345678),
        "Counter should be 0x12345678"
    );
}

#[test_log::test]
fn test_deserialize_with_aggregate_and_condition() {
    let _guard = common::assert_no_warnings();

    // Test using ComparisonList (AND) with conditions on aggregate members
    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="U3" signed="false">
        <IntegerDataEncoding sizeInBits="3" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
      <IntegerParameterType name="U5" signed="false">
        <IntegerDataEncoding sizeInBits="5" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>

      <AggregateParameterType name="HeaderType">
        <MemberList>
          <Member name="Version" typeRef="U3" />
          <Member name="Type" typeRef="U5" />
        </MemberList>
      </AggregateParameterType>

      <IntegerParameterType name="U8" signed="false">
        <IntegerDataEncoding sizeInBits="8" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>
    </ParameterTypeSet>

    <ParameterSet>
      <Parameter name="Header" parameterTypeRef="HeaderType" />
      <Parameter name="Data" parameterTypeRef="U8" />
    </ParameterSet>

    <ContainerSet>
      <SequenceContainer name="BasePacket" abstract="true">
        <EntryList>
          <ParameterRefEntry parameterRef="Header" />
        </EntryList>
      </SequenceContainer>

      <!-- Child that matches when Version=1 AND Type=5 -->
      <SequenceContainer name="SpecialPacket">
        <BaseContainer containerRef="BasePacket">
          <RestrictionCriteria>
            <ComparisonList>
              <Comparison parameterRef="Header/Version" value="1" comparisonOperator="==" />
              <Comparison parameterRef="Header/Type" value="5" comparisonOperator="==" />
            </ComparisonList>
          </RestrictionCriteria>
        </BaseContainer>
        <EntryList>
          <ParameterRefEntry parameterRef="Data" />
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create packet with Version=1, Type=5 (should match via AND condition)
    // Header: Version=1 (001), Type=5 (00101) = 0b001_00101 = 0x25
    let data = vec![0x25, 0xAB]; // Header + Data

    let packet = mdb.deserialize(&data).expect("Failed to deserialize packet");

    let header = packet
        .parameters
        .get("/TestSystem/Header")
        .expect("Header not found in packet");

    if let hermes_data::Value::Aggregate(agg) = &header[0].raw_value {
        assert_eq!(
            *agg.get("Version").unwrap(),
            hermes_data::Value::UnsignedInteger(1)
        );
        assert_eq!(
            *agg.get("Type").unwrap(),
            hermes_data::Value::UnsignedInteger(5)
        );
    }

    // Verify Data field was deserialized (proving the restriction matched)
    let data_param = packet.parameters.get("/TestSystem/Data");
    assert!(
        data_param.is_some(),
        "Data should be present when restriction matches"
    );
    assert_eq!(
        data_param.unwrap()[0].raw_value,
        hermes_data::Value::UnsignedInteger(0xAB)
    );
}

#[test_log::test]
fn test_deserialize_aggregate_nested_members() {
    let _guard = common::assert_no_warnings();

    // Test deeply nested aggregate structures
    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="U8" signed="false">
        <IntegerDataEncoding sizeInBits="8" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>

      <!-- Inner aggregate -->
      <AggregateParameterType name="InnerType">
        <MemberList>
          <Member name="X" typeRef="U8" />
          <Member name="Y" typeRef="U8" />
        </MemberList>
      </AggregateParameterType>

      <!-- Outer aggregate containing inner aggregate -->
      <AggregateParameterType name="OuterType">
        <MemberList>
          <Member name="ID" typeRef="U8" />
          <Member name="Inner" typeRef="InnerType" />
        </MemberList>
      </AggregateParameterType>
    </ParameterTypeSet>

    <ParameterSet>
      <Parameter name="Outer" parameterTypeRef="OuterType" />
    </ParameterSet>

    <ContainerSet>
      <SequenceContainer name="NestedPacket">
        <EntryList>
          <ParameterRefEntry parameterRef="Outer" />
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Create packet data: ID=0x01, Inner.X=0x02, Inner.Y=0x03
    let data = vec![0x01, 0x02, 0x03];

    let packet = mdb.deserialize(&data).expect("Failed to deserialize");

    let outer = packet
        .parameters
        .get("/TestSystem/Outer")
        .expect("Outer not found");

    if let hermes_data::Value::Aggregate(outer_agg) = &outer[0].raw_value {
        // Check ID
        assert_eq!(
            *outer_agg.get("ID").unwrap(),
            hermes_data::Value::UnsignedInteger(1)
        );

        // Check nested aggregate
        if let hermes_data::Value::Aggregate(inner_agg) = outer_agg.get("Inner").unwrap() {
            assert_eq!(
                *inner_agg.get("X").unwrap(),
                hermes_data::Value::UnsignedInteger(2)
            );
            assert_eq!(
                *inner_agg.get("Y").unwrap(),
                hermes_data::Value::UnsignedInteger(3)
            );
        } else {
            panic!("Inner should be an aggregate value");
        }
    } else {
        panic!("Outer should be an aggregate value");
    }
}
