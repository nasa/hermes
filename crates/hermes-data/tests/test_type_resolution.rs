mod common;

use hermes_data::{IntegerValue, MissionDatabase, Type, VariableSize};

#[test_log::test]
fn test_binary_type_with_dynamic_size_has_resolved_parameter_ref() {
    let _guard = common::assert_no_warnings();

    // Create an XTCE document with a Binary type that references a parameter for size
    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="U32" signed="false">
        <IntegerDataEncoding sizeInBits="32" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>

      <BinaryParameterType name="DynamicBinaryType">
        <BinaryDataEncoding>
          <SizeInBits>
            <DynamicValue>
              <ParameterInstanceRef parameterRef="Size" />
            </DynamicValue>
          </SizeInBits>
        </BinaryDataEncoding>
      </BinaryParameterType>
    </ParameterTypeSet>

    <ParameterSet>
      <Parameter name="Size" parameterTypeRef="U32" />
      <Parameter name="Data" parameterTypeRef="DynamicBinaryType" />
    </ParameterSet>

    <ContainerSet>
      <SequenceContainer name="TestContainer">
        <EntryList>
          <ParameterRefEntry parameterRef="Size" />
          <ParameterRefEntry parameterRef="Data" />
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Get the Data parameter and check its type
    let data_param = mdb
        .get_telemetry("/TestSystem/Data")
        .expect("Data parameter not found");

    // Verify it's a Binary type
    if let Type::Binary(binary_type) = &*data_param.type_ {
        // Verify the size is dynamic and references a parameter
        if let VariableSize::DynamicParameterRef(param_ref) = &binary_type.size {
            // The parameter reference should be fully qualified!
            assert_eq!(
                param_ref.parameter.name, "/TestSystem/Size",
                "Parameter reference should be fully qualified"
            );
        } else {
            panic!("Expected DynamicParameterRef for binary size");
        }
    } else {
        panic!("Expected Binary type for Data parameter");
    }
}

#[test_log::test]
fn test_array_type_with_dynamic_dimension_has_resolved_parameter_ref() {
    let _guard = common::assert_no_warnings();

    // Create an XTCE document with an Array type that references a parameter for dimension
    let xml_content = r#"<?xml version='1.0' encoding='utf-8'?>
<SpaceSystem xmlns="http://www.omg.org/spec/XTCE/20180204" name="TestSystem">
  <TelemetryMetaData>
    <ParameterTypeSet>
      <IntegerParameterType name="U8" signed="false">
        <IntegerDataEncoding sizeInBits="8" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>

      <IntegerParameterType name="U32" signed="false">
        <IntegerDataEncoding sizeInBits="32" encoding="unsigned" byteOrder="mostSignificantByteFirst" />
      </IntegerParameterType>

      <ArrayParameterType name="DynamicArrayType" arrayTypeRef="U8">
        <DimensionList>
          <Dimension>
            <StartingIndex>
              <FixedValue>0</FixedValue>
            </StartingIndex>
            <EndingIndex>
              <DynamicValue>
                <ParameterInstanceRef parameterRef="ArraySize" />
              </DynamicValue>
            </EndingIndex>
          </Dimension>
        </DimensionList>
      </ArrayParameterType>
    </ParameterTypeSet>

    <ParameterSet>
      <Parameter name="ArraySize" parameterTypeRef="U32" />
      <Parameter name="DataArray" parameterTypeRef="DynamicArrayType" />
    </ParameterSet>

    <ContainerSet>
      <SequenceContainer name="TestContainer">
        <EntryList>
          <ParameterRefEntry parameterRef="ArraySize" />
          <ParameterRefEntry parameterRef="DataArray" />
        </EntryList>
      </SequenceContainer>
    </ContainerSet>
  </TelemetryMetaData>
</SpaceSystem>"#;

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to create MissionDatabase");

    // Get the DataArray parameter and check its type
    let array_param = mdb
        .get_telemetry("/TestSystem/DataArray")
        .expect("DataArray parameter not found");

    // Verify it's an Array type
    if let Type::Array(array_type) = &*array_param.type_ {
        // Check the ending index of the first dimension
        let dimension = &array_type.dimensions[0];

        if let IntegerValue::DynamicValueParameter { ref_, .. } = &dimension.ending_index {
            // The parameter reference should be fully qualified!
            assert_eq!(
                ref_.parameter.name, "/TestSystem/ArraySize",
                "Parameter reference in array dimension should be fully qualified"
            );
        } else {
            panic!("Expected DynamicValueParameter for array dimension ending index");
        }
    } else {
        panic!("Expected Array type for DataArray parameter");
    }
}
