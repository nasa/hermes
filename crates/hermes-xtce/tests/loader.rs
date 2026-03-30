use hermes_xtce::SpaceSystem;

/// Test loading the fprime.xtce.xml file using the serde definitions.
///
/// Note: This test currently demonstrates a limitation with quick-xml's deserialization
/// of complex XTCE documents. The XTCE schema uses deeply nested enum types (like
/// `RestrictionCriteriaType` containing `ComparisonList`) that quick-xml struggles to
/// deserialize correctly.
///
/// This is a known limitation when using serde-based XML deserialization with complex
/// schemas. Alternative approaches for full XTCE support might include:
/// - Using a different XML parser with better enum support
/// - Implementing custom Deserialize logic for problematic types
/// - Using DOM-based parsing with manual type construction
/// - Preprocessing the XML to simplify nested structures
#[test]
fn test_load_fprime_xtce_full() {
    let xml_content = std::fs::read_to_string("tests/data/fprime.xtce.xml")
        .expect("Failed to read fprime.xtce.xml");

    let space_system: SpaceSystem = match quick_xml::de::from_str(&xml_content) {
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

    println!("✓ Successfully loaded XTCE document: {}", space_system.name);
    if let Some(ref tm) = space_system.telemetry_meta_data {
        if let Some(ref param_types) = tm.parameter_type_set {
            println!(
                "  - Found {} parameter types in the type set",
                param_types.content.len()
            );
        }
    }
}
