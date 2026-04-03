mod common;

use hermes_data::MissionDatabase;
use std::fs;

#[test_log::test]
fn test_load_fprime_parameter_types() {
    let _guard = common::assert_no_warnings();

    // Load the test XTCE file
    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system: hermes_xtce::SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    // Create mission database with parameter loading
    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // Verify parameter types were loaded
    let root_name = format!("/{}", space_system.name);

    // Check that basic parameter types exist
    let u8_type = mdb.get_telemetry_parameter_type(&format!("{}/U8", root_name));
    assert!(u8_type.is_some(), "U8 parameter type should be loaded");

    let u16_type = mdb.get_telemetry_parameter_type(&format!("{}/U16", root_name));
    assert!(u16_type.is_some(), "U16 parameter type should be loaded");

    let u32_type = mdb.get_telemetry_parameter_type(&format!("{}/U32", root_name));
    assert!(u32_type.is_some(), "U32 parameter type should be loaded");

    let bool_type = mdb.get_telemetry_parameter_type(&format!("{}/bool", root_name));
    assert!(bool_type.is_some(), "bool parameter type should be loaded");

    let f32_type = mdb.get_telemetry_parameter_type(&format!("{}/F32", root_name));
    assert!(f32_type.is_some(), "F32 parameter type should be loaded");

    let f64_type = mdb.get_telemetry_parameter_type(&format!("{}/F64", root_name));
    assert!(f64_type.is_some(), "F64 parameter type should be loaded");
}

#[test_log::test]
fn test_load_fprime_parameters() {
    let _guard = common::assert_no_warnings();

    // Load the test XTCE file
    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    // Create mission database with parameter loading
    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // Verify parameters were loaded
    let root_name = format!("/{}", space_system.name);

    // Check that parameters exist (excluding ones with aggregate types)
    let fprime_packet_id = mdb.get_telemetry(&format!("{}/FPrimePacketId", root_name));
    assert!(
        fprime_packet_id.is_some(),
        "FPrimePacketId parameter should be loaded"
    );

    let fprime_event_id = mdb.get_telemetry(&format!("{}/FPrimeEventId", root_name));
    assert!(
        fprime_event_id.is_some(),
        "FPrimeEventId parameter should be loaded"
    );

    let fprime_channel_id = mdb.get_telemetry(&format!("{}/FPrimeChannelId", root_name));
    assert!(
        fprime_channel_id.is_some(),
        "FPrimeChannelId parameter should be loaded"
    );

    // Note: CCSDS_Packet_ID is skipped because it uses an aggregate type
    // which is not yet implemented

    // Verify that at least some parameters were loaded
    assert!(
        !mdb.all_telemetry().is_empty(),
        "Should have loaded some parameters"
    );
}

#[test_log::test]
fn test_parameter_has_correct_type() {
    let _guard = common::assert_no_warnings();

    // Load the test XTCE file
    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    // Create mission database
    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    let root_name = format!("/{}", space_system.name);

    // Get parameter and verify it has the correct type
    let fprime_event_id = mdb
        .get_telemetry(&format!("{}/FPrimeEventId", root_name))
        .expect("FPrimeEventId parameter should exist");

    // Verify the parameter references U32 type
    // We can't directly compare Rc pointers, but we can verify the type exists
    let u32_type = mdb
        .get_telemetry_parameter_type(&format!("{}/U32", root_name))
        .expect("U32 type should exist");

    // Both should exist and be valid
    assert!(matches!(
        *fprime_event_id.type_,
        hermes_data::Type::Integer(_)
    ));
    assert!(matches!(**u32_type, hermes_data::Type::Integer(_)));
}

#[test_log::test]
fn test_parameter_names_are_fully_qualified() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // All parameter names should be fully qualified (start with /)
    for (name, parameter) in mdb.all_telemetry().iter() {
        assert!(
            name.starts_with('/'),
            "Parameter name '{}' should be fully qualified",
            name
        );
        assert_eq!(
            &parameter.head.qualified_name, name,
            "Parameter qualified_name should match map key"
        );
    }
}

#[test_log::test]
fn test_parameter_type_names_are_fully_qualified() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // All parameter type names should be fully qualified (start with /)
    for name in mdb.all_telemetry_parameter_types().keys() {
        assert!(
            name.starts_with('/'),
            "Parameter type name '{}' should be fully qualified",
            name
        );
    }
}

#[test_log::test]
fn test_enumerated_parameter_type() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    let root_name = format!("/{}", space_system.name);

    // Find an enumerated type
    let group_flags_type = mdb.get_telemetry_parameter_type(&format!("{}/CCSDS_Group_Flags_Type", root_name));
    assert!(
        group_flags_type.is_some(),
        "CCSDS_Group_Flags_Type should be loaded"
    );

    if let Some(type_) = group_flags_type {
        match &**type_ {
            hermes_data::Type::Enumerated(enum_type) => {
                // Verify enumeration list is populated
                assert!(
                    !enum_type.enumeration_list.is_empty(),
                    "Enumeration list should not be empty"
                );

                // Check for specific values
                let continuation = enum_type
                    .enumeration_list
                    .iter()
                    .find(|e| e.label == "Continuation");
                assert!(
                    continuation.is_some(),
                    "Should have Continuation enumeration"
                );
                assert_eq!(continuation.unwrap().value, 0);

                let standalone = enum_type
                    .enumeration_list
                    .iter()
                    .find(|e| e.label == "Standalone");
                assert!(standalone.is_some(), "Should have Standalone enumeration");
                assert_eq!(standalone.unwrap().value, 3);
            }
            _ => panic!("CCSDS_Group_Flags_Type should be an Enumerated type"),
        }
    }
}

#[test_log::test]
fn test_parameters_from_nested_space_systems() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // Check for parameters in nested SpaceSystems (e.g., CdhCore/cmdDisp)
    // These should have fully qualified names like /FPrime/CdhCore/cmdDisp/CommandsDispatched
    let nested_params: Vec<_> = mdb
        .all_telemetry()
        .keys()
        .filter(|name| name.contains("CdhCore"))
        .collect();

    assert!(
        !nested_params.is_empty(),
        "Should have parameters from nested SpaceSystems"
    );

    // Verify one specific nested parameter
    let commands_dispatched_exists = mdb
        .all_telemetry()
        .keys()
        .any(|name| name.ends_with("CommandsDispatched"));
    assert!(
        commands_dispatched_exists,
        "Should have CommandsDispatched parameter from nested SpaceSystem"
    );
}

#[test_log::test]
fn test_aggregate_parameter_type() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    let root_name = format!("/{}", space_system.name);

    // Find an aggregate type (CCSDS_Packet_ID_Type)
    let packet_id_type = mdb.get_telemetry_parameter_type(&format!("{}/CCSDS_Packet_ID_Type", root_name));
    assert!(
        packet_id_type.is_some(),
        "CCSDS_Packet_ID_Type should be loaded"
    );

    if let Some(type_) = packet_id_type {
        match &**type_ {
            hermes_data::Type::Aggregate(agg_type) => {
                // Verify members are populated
                assert!(
                    !agg_type.members.is_empty(),
                    "Aggregate should have members"
                );

                // Check for specific members (based on fprime.xtce.xml)
                let apid_member = agg_type.members.iter().find(|m| m.name == "APID");
                assert!(apid_member.is_some(), "Should have 'APID' member");

                let type_member = agg_type.members.iter().find(|m| m.name == "Type");
                assert!(type_member.is_some(), "Should have 'Type' member");
            }
            _ => panic!("CCSDS_Packet_ID_Type should be an Aggregate type"),
        }
    }
}

#[test_log::test]
fn test_array_parameter_type() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // Find an array type (there should be some in nested SpaceSystems like ComQueueDepth)
    let array_types: Vec<_> = mdb
        .all_telemetry_parameter_types()
        .iter()
        .filter_map(|(name, type_)| match &**type_ {
            hermes_data::Type::Array(_) => Some(name.clone()),
            _ => None,
        })
        .collect();

    assert!(
        !array_types.is_empty(),
        "Should have at least one array parameter type"
    );

    // Check a specific array type if we found any
    if let Some(array_type_name) = array_types.first() {
        let array_type = mdb.get_telemetry_parameter_type(array_type_name).unwrap();
        match &**array_type {
            hermes_data::Type::Array(arr_type) => {
                // Verify it has dimensions
                assert!(
                    !arr_type.dimensions.is_empty(),
                    "Array should have at least one dimension"
                );

                // Verify element type exists
                assert!(
                    matches!(*arr_type.element_type, hermes_data::Type::Integer(_)),
                    "Array element should be a valid type"
                );
            }
            _ => panic!("Should be an Array type"),
        }
    }
}
