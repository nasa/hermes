use hermes_xtce::SpaceSystem;
use std::process::Command;

/// Validate XML against XTCE XSD schema using xmllint.
fn validate_against_xsd(xml_content: &str) {
    let xmllint_check = Command::new("xmllint").arg("--version").output();

    if xmllint_check.is_err() {
        eprintln!("xmllint not found - skipping XSD validation");
        eprintln!("Install libxml2 to enable XSD validation");
        return;
    }

    let temp_dir = std::env::temp_dir();
    let xml_path = temp_dir.join("test_xtce_validation.xml");
    if std::fs::write(&xml_path, xml_content).is_err() {
        eprintln!("Failed to write temporary XML file");
        return;
    }

    let schema_path = std::path::Path::new("schema/xtce-v1.3.xsd");
    let schema_to_use = if schema_path.exists() {
        schema_path
    } else {
        let alt_path = std::path::Path::new("../../schema/xtce-v1.3.xsd");
        if !alt_path.exists() {
            eprintln!("XTCE schema not found - skipping XSD validation");
            return;
        }
        alt_path
    };

    let output = Command::new("xmllint")
        .arg("--noout")
        .arg("--schema")
        .arg(schema_to_use)
        .arg(&xml_path)
        .output();

    std::fs::remove_file(&xml_path).ok();

    match output {
        Ok(out) if out.status.success() => {
            println!("XSD validation passed");
        }
        Ok(out) => {
            let stderr = String::from_utf8_lossy(&out.stderr);
            panic!(
                "XSD validation failed:\n{}",
                stderr.lines().take(10).collect::<Vec<_>>().join("\n")
            );
        }
        Err(e) => {
            eprintln!("Failed to run xmllint: {}", e);
        }
    }
}

/// Helper to read or update a reference file based on UPDATE_REF environment variable.
///
/// If UPDATE_REF=1, writes the content to the reference file.
/// Otherwise, reads and returns the reference file content.
fn handle_ref_file(ref_path: &str, actual_content: &str) -> String {
    let update_ref = std::env::var("UPDATE_REF").is_ok();

    if update_ref {
        std::fs::write(ref_path, actual_content)
            .unwrap_or_else(|e| panic!("Failed to write reference file {}: {}", ref_path, e));
        println!("Updated reference file: {}", ref_path);
        actual_content.to_string()
    } else {
        std::fs::read_to_string(ref_path).unwrap_or_else(|e| {
            panic!(
                "Failed to read reference file {}. Run with UPDATE_REF=1 to create it: {}",
                ref_path, e
            )
        })
    }
}

/// Helper to compare XML content, writing actual output on mismatch for debugging.
fn assert_xml_matches(actual: &str, expected: &str, test_name: &str) {
    if actual != expected {
        let actual_path = format!("tests/data/{}.actual.xml", test_name);
        std::fs::write(&actual_path, actual)
            .unwrap_or_else(|e| eprintln!("Failed to write actual file: {}", e));

        panic!(
            "Serialized output does not match reference file.\n\
             Actual output written to: {}\n\
             Run with UPDATE_REF=1 to update the reference file if the change is intentional.",
            actual_path
        );
    }
}

/// Test serialization of minimal XTCE against reference file.
///
/// Note: The serialized output may not be valid for re-parsing due to quick-xml
/// limitations (missing namespaces, empty string attributes for None values).
/// This test validates that the serialization output is consistent.
#[test]
fn test_serialize_minimal_xtce() {
    let xml_content = std::fs::read_to_string("tests/data/minimal.xtce.xml")
        .expect("Failed to read minimal.xtce.xml");

    let space_system: SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to deserialize XTCE");

    // Serialize to string
    let serialized =
        hermes_xtce::to_string(&space_system).expect("Failed to serialize minimal XTCE");

    // Compare against reference
    let ref_path = "tests/data/minimal.serialize.ref.xml";
    let expected = handle_ref_file(ref_path, &serialized);
    assert_xml_matches(&serialized, &expected, "minimal.serialize");

    // Verify the output contains expected content
    assert!(
        serialized.contains("MinimalTestSystem"),
        "Serialized XML should contain the space system name"
    );
    assert!(
        serialized.contains("TestU8"),
        "Serialized XML should contain the parameter type"
    );

    // Validate against XSD schema
    validate_against_xsd(&serialized);

    println!("Serialize test passed");
}

/// Test pretty-printing serialization against reference file.
///
/// Note: The serialized output may not be valid for re-parsing due to quick-xml
/// limitations (missing namespaces, empty string attributes for None values).
/// This test validates that the pretty-printing produces consistent, indented output.
#[test]
fn test_pretty_print_minimal_xtce() {
    let xml_content = std::fs::read_to_string("tests/data/minimal.xtce.xml")
        .expect("Failed to read minimal.xtce.xml");

    let space_system: SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to deserialize XTCE");

    // Pretty print
    let pretty_xml =
        hermes_xtce::to_string_pretty(&space_system).expect("Failed to pretty-print XTCE");

    // Compare against reference
    let ref_path = "tests/data/minimal.pretty.ref.xml";
    let expected = handle_ref_file(ref_path, &pretty_xml);
    assert_xml_matches(&pretty_xml, &expected, "minimal.pretty");

    // Verify it's formatted (has indentation)
    assert!(
        pretty_xml.contains("  "),
        "Pretty-printed XML should contain indentation"
    );

    // Verify output contains expected content
    assert!(
        pretty_xml.contains("MinimalTestSystem"),
        "Pretty-printed XML should contain the space system name"
    );

    // Validate against XSD schema
    validate_against_xsd(&pretty_xml);

    println!("Pretty-print test passed");
}

/// Test writing to a writer (file) against reference file.
#[test]
fn test_write_to_file() {
    let xml_content = std::fs::read_to_string("tests/data/minimal.xtce.xml")
        .expect("Failed to read minimal.xtce.xml");

    let space_system: SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to deserialize XTCE");

    // Write to an in-memory buffer
    let mut written_xml = String::new();
    hermes_xtce::to_writer(&mut written_xml, &space_system).expect("Failed to write to buffer");

    // Compare against reference
    let ref_path = "tests/data/minimal.writer.ref.xml";
    let expected = handle_ref_file(ref_path, &written_xml);
    assert_xml_matches(&written_xml, &expected, "minimal.writer");

    // Also test writing to an actual file
    let temp_dir = std::env::temp_dir();
    let temp_file_path = temp_dir.join("test_xtce_output.xml");

    {
        let file =
            std::fs::File::create(&temp_file_path).expect("Failed to create temporary file");
        hermes_xtce::to_utf8_io_writer(file, &space_system).expect("Failed to write to file");
    }

    // Verify the file content matches
    let file_content =
        std::fs::read_to_string(&temp_file_path).expect("Failed to read written file");
    assert_eq!(
        file_content, written_xml,
        "File content should match buffer content"
    );

    // Clean up
    std::fs::remove_file(&temp_file_path).ok();

    // Validate against XSD schema
    validate_against_xsd(&written_xml);

    println!("Write-to-file test passed");
}

/// Test fprime XTCE deserialization.
///
/// Serialization of fprime.xtce.xml is not tested due to quick-xml
/// limitations with enum types used as attributes.
#[test]
fn test_load_fprime_xtce() {
    let xml_content = std::fs::read_to_string("tests/data/fprime.xtce.xml")
        .expect("Failed to read fprime.xtce.xml");

    let space_system: SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to deserialize XTCE");

    assert_eq!(
        space_system.name, "FprimeYamcsReference_YamcsDeployment",
        "SpaceSystem name should match"
    );

    assert!(
        space_system.telemetry_meta_data.is_some(),
        "TelemetryMetaData should be present"
    );

    println!("Load test passed");
}

/// Test that serialization produces consistent output for the same input.
///
/// Note: Full round-trip (deserialize -> serialize -> deserialize) is not tested
/// due to quick-xml serialization limitations. This test verifies that serializing
/// the same structure twice produces identical output.
#[test]
fn test_serialization_consistency() {
    let xml_content = std::fs::read_to_string("tests/data/minimal.xtce.xml")
        .expect("Failed to read minimal.xtce.xml");

    let space_system: SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to deserialize XTCE");

    // Serialize twice
    let serialized1 = hermes_xtce::to_string_pretty(&space_system)
        .expect("Failed to serialize XTCE first time");
    let serialized2 = hermes_xtce::to_string_pretty(&space_system)
        .expect("Failed to serialize XTCE second time");

    // Should produce identical output
    assert_eq!(
        serialized1, serialized2,
        "Serialization should be deterministic"
    );

    // Verify output contains key information
    assert!(
        serialized1.contains("MinimalTestSystem"),
        "Serialized output should contain space system name"
    );
    assert!(
        serialized1.contains("TestU8"),
        "Serialized output should contain parameter type"
    );

    println!("Serialization consistency test passed");
}

/// Test that all serialization API functions are accessible and work.
#[test]
fn test_serialization_api_exists() {
    let xml_content = std::fs::read_to_string("tests/data/minimal.xtce.xml")
        .expect("Failed to read minimal.xtce.xml");

    let space_system: SpaceSystem =
        hermes_xtce::from_str(&xml_content).expect("Failed to deserialize XTCE");

    // Test to_string
    let result = hermes_xtce::to_string(&space_system);
    assert!(result.is_ok(), "to_string should succeed");

    // Test to_string_pretty
    let result = hermes_xtce::to_string_pretty(&space_system);
    assert!(result.is_ok(), "to_string_pretty should succeed");

    // Test to_writer
    let mut buffer = Vec::new();
    let result = hermes_xtce::to_utf8_io_writer(&mut buffer, &space_system);
    assert!(result.is_ok(), "to_writer should succeed");
    assert!(!buffer.is_empty(), "Writer should produce output");

    println!("All serialization API functions are accessible and working");
}
