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
    let fprime_telemetry = mdb.get_telemetry_container(&format!("{}/FPrimeTelemetryPacket", root_name));
    assert!(
        fprime_telemetry.is_some(),
        "FPrimeTelemetryPacket should be loaded"
    );

    let fprime_container = fprime_telemetry.unwrap();
    assert!(
        fprime_container.base.is_some(),
        "FPrimeTelemetryPacket should have a base container"
    );

    let base = fprime_container.base.as_ref().unwrap();
    assert_eq!(
        base.parent.head.name, "CCSDSSpacePacket",
        "FPrimeTelemetryPacket should extend CCSDSSpacePacket"
    );

    // Verify grandchild: SystemRes1 extends FPrimeTelemetryPacket
    let system_res1 = mdb.get_telemetry_container(&format!("{}/SystemRes1", root_name));
    assert!(system_res1.is_some(), "SystemRes1 should be loaded");

    let system_res1_container = system_res1.unwrap();
    assert!(
        system_res1_container.base.is_some(),
        "SystemRes1 should have a base container"
    );

    let base = system_res1_container.base.as_ref().unwrap();
    assert_eq!(
        base.parent.head.name, "FPrimeTelemetryPacket",
        "SystemRes1 should extend FPrimeTelemetryPacket"
    );
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
