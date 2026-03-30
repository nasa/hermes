use hermes_xtce::SpaceSystem;

/// Test loading the fprime.xtce.xml file using the serde definitions.
#[test]
fn test_load_fprime_xtce_full() {
    let xml_content = std::fs::read_to_string("tests/data/fprime.xtce.xml")
        .expect("Failed to read fprime.xtce.xml");

    let mut de = quick_xml::de::Deserializer::from_str(&xml_content);

    let space_system: SpaceSystem = match serde_path_to_error::deserialize(&mut de) {
        Ok(system) => system,
        Err(e) => {
            panic!("Deserialization failed: {e}");
        }
    };

    // Basic assertions to verify the structure was loaded correctly
    assert_eq!(space_system.name, "FprimeYamcsReference_YamcsDeployment");

    // Verify telemetry metadata exists
    assert!(
        space_system.telemetry_meta_data.is_some(),
        "TelemetryMetaData should be present"
    );

    println!("Successfully loaded XTCE document: {}", space_system.name);
    if let Some(ref tm) = space_system.telemetry_meta_data {
        if let Some(ref param_types) = tm.parameter_type_set {
            println!(
                "  - Found {} parameter types in the type set",
                param_types.content.len(),
            );
        }

        println!(
            "  - Found {} containers",
            tm.container_set.as_ref().unwrap().content.len()
        )
    }
}
