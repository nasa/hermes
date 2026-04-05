use hermes_data::{Error, MissionDatabase};

/// Test that integer types with invalid bit sizes are rejected during XTCE loading
#[test]
fn test_integer_type_size_validation() {
    let xtce_xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="Test">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="InvalidIntegerType" signed="false" sizeInBits="128">
        <IntegerDataEncoding sizeInBits="128" encoding="unsigned" byteOrder="mostSignificantByteFirst"/>
      </IntegerParameterType>
    </ParameterTypeSet>
    <ParameterSet>
      <Parameter name="InvalidParam" parameterTypeRef="InvalidIntegerType"/>
    </ParameterSet>
    <ContainerSet>
      <SequenceContainer name="TestPacket">
        <EntryList>
          <ParameterRefEntry parameterRef="InvalidParam"/>
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    // Parse XTCE
    let space_system: hermes_xtce::SpaceSystem = hermes_xtce::from_str(xtce_xml).unwrap();

    // Try to load the database - should fail with InvalidXtce error during type conversion
    let result = MissionDatabase::new(&space_system);
    assert!(result.is_err());

    if let Err(Error::InvalidXtce(msg)) = result {
        assert!(
            msg.contains("128"),
            "Error message should contain '128': {}",
            msg
        );
        assert!(
            msg.contains("64"),
            "Error message should contain '64': {}",
            msg
        );
    } else {
        panic!("Expected InvalidXtce error");
    }
}

/// Test that integer types at the boundary (64 bits) are accepted
#[test]
fn test_integer_type_size_boundary() {
    let xtce_xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="Test">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="ValidIntegerType" signed="false" sizeInBits="64">
        <IntegerDataEncoding sizeInBits="64" encoding="unsigned" byteOrder="mostSignificantByteFirst"/>
      </IntegerParameterType>
    </ParameterTypeSet>
    <ParameterSet>
      <Parameter name="ValidParam" parameterTypeRef="ValidIntegerType"/>
    </ParameterSet>
    <ContainerSet>
      <SequenceContainer name="TestPacket">
        <EntryList>
          <ParameterRefEntry parameterRef="ValidParam"/>
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    // Parse XTCE
    let space_system: hermes_xtce::SpaceSystem = hermes_xtce::from_str(xtce_xml).unwrap();

    // Should succeed
    let result = MissionDatabase::new(&space_system);
    if let Err(e) = &result {
        eprintln!("Error: {:?}", e);
    }
    assert!(result.is_ok());
}

/// Test that zero or negative bit sizes are rejected
#[test]
fn test_integer_type_zero_bits() {
    let xtce_xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="Test">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="ZeroBitsType" signed="false" sizeInBits="0">
        <IntegerDataEncoding sizeInBits="0" encoding="unsigned" byteOrder="mostSignificantByteFirst"/>
      </IntegerParameterType>
    </ParameterTypeSet>
    <ParameterSet>
      <Parameter name="ZeroParam" parameterTypeRef="ZeroBitsType"/>
    </ParameterSet>
    <ContainerSet>
      <SequenceContainer name="TestPacket">
        <EntryList>
          <ParameterRefEntry parameterRef="ZeroParam"/>
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    // Parse XTCE
    let space_system: hermes_xtce::SpaceSystem = hermes_xtce::from_str(xtce_xml).unwrap();

    // Try to load the database - should fail
    let result = MissionDatabase::new(&space_system);
    assert!(result.is_err());

    if let Err(Error::InvalidXtce(msg)) = result {
        assert!(
            msg.contains("0"),
            "Error message should contain '0': {}",
            msg
        );
        assert!(
            msg.contains("between 1 and 64"),
            "Error message should contain 'between 1 and 64': {}",
            msg
        );
    } else {
        panic!("Expected InvalidXtce error");
    }
}

/// Test that enumerated types with invalid bit sizes are rejected
#[test]
fn test_enumerated_type_size_validation() {
    let xtce_xml = r#"<?xml version="1.0" encoding="UTF-8"?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="Test">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <EnumeratedParameterType name="InvalidEnumType">
        <IntegerDataEncoding sizeInBits="128" encoding="unsigned" byteOrder="mostSignificantByteFirst"/>
        <EnumerationList>
          <Enumeration label="VALUE_A" value="0"/>
          <Enumeration label="VALUE_B" value="1"/>
        </EnumerationList>
      </EnumeratedParameterType>
    </ParameterTypeSet>
    <ParameterSet>
      <Parameter name="InvalidEnumParam" parameterTypeRef="InvalidEnumType"/>
    </ParameterSet>
    <ContainerSet>
      <SequenceContainer name="TestPacket">
        <EntryList>
          <ParameterRefEntry parameterRef="InvalidEnumParam"/>
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    // Parse XTCE
    let space_system: hermes_xtce::SpaceSystem = hermes_xtce::from_str(xtce_xml).unwrap();

    // Try to load the database - should fail
    let result = MissionDatabase::new(&space_system);
    assert!(result.is_err());

    if let Err(Error::InvalidXtce(msg)) = result {
        assert!(
            msg.contains("128"),
            "Error message should contain '128': {}",
            msg
        );
        assert!(
            msg.contains("64"),
            "Error message should contain '64': {}",
            msg
        );
    } else {
        panic!("Expected InvalidXtce error");
    }
}
