mod common;

use hermes_data::MissionDatabase;
use std::fs;

#[test_log::test]
fn test_load_fprime_containers() {
    let _guard = common::assert_no_warnings();

    // Load the test XTCE file
    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    // Create mission database with multi-pass container loading
    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // Verify containers were loaded
    let root_name = format!("/{}", space_system.name);

    // Check that base container exists
    let ccsds_packet = mdb.get_telemetry_container(&format!("{}/CCSDSSpacePacket", root_name));
    assert!(ccsds_packet.is_some(), "CCSDSSpacePacket should be loaded");

    // Check that child container exists
    let fprime_telemetry =
        mdb.get_telemetry_container(&format!("{}/FPrimeTelemetryPacket", root_name));
    assert!(
        fprime_telemetry.is_some(),
        "FPrimeTelemetryPacket should be loaded"
    );

    // With the new pattern, parents track their children
    // Verify that CCSDSSpacePacket has FPrimeTelemetryPacket as a child
    let ccsds_container = ccsds_packet.unwrap();
    let fprime_child = ccsds_container
        .children
        .iter()
        .find(|(_, child)| child.head.name == "FPrimeTelemetryPacket");
    assert!(
        fprime_child.is_some(),
        "CCSDSSpacePacket should have FPrimeTelemetryPacket as a child"
    );

    // Verify that FPrimeTelemetryPacket has SystemRes1 as a child
    let fprime_container = fprime_telemetry.unwrap();
    let system_res1_child = fprime_container
        .children
        .iter()
        .find(|(_, child)| child.head.name == "SystemRes1");
    assert!(
        system_res1_child.is_some(),
        "FPrimeTelemetryPacket should have SystemRes1 as a child"
    );

    // Verify SystemRes1 exists
    let system_res1 = mdb.get_telemetry_container(&format!("{}/SystemRes1", root_name));
    assert!(system_res1.is_some(), "SystemRes1 should be loaded");
}

#[test_log::test]
fn test_container_names_are_fully_qualified() {
    let _guard = common::assert_no_warnings();

    let xml_content = fs::read_to_string("../hermes-xtce/tests/data/fprime.xtce.xml")
        .expect("Failed to read test file");

    let space_system = hermes_xtce::from_str(&xml_content).expect("Failed to parse XTCE");

    let mdb = MissionDatabase::new(&space_system).expect("Failed to build mission database");

    // All container names should be fully qualified (start with /)
    for (name, container) in mdb.all_telemetry_containers().iter() {
        assert!(
            name.starts_with('/'),
            "Container name '{}' should be fully qualified",
            name
        );
        assert_eq!(
            &container.head.qualified_name, name,
            "Container qualified_name should match map key"
        );
    }
}
