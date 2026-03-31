use hermes_fprime_dictionary::parse_fprime_json_dictionary;
use prost::Message;
use std::fs;
use std::process::Command;

#[test]
fn test_cli_converts_dictionary() {
    // Create a temporary test dictionary
    let test_json = r#"{
        "metadata": {
            "deploymentName": "CliTestDeployment",
            "projectVersion": "1.0.0"
        },
        "commands": [
            {
                "name": "TestComponent.TestCommand",
                "commandKind": "async",
                "opcode": 42,
                "formalParams": []
            }
        ],
        "events": [
            {
                "name": "TestComponent.TestEvent",
                "severity": "FATAL",
                "formalParams": [
                    {
                        "name": "errorCode",
                        "type": {
                            "name": "U32",
                            "kind": "integer",
                            "size": 32,
                            "signed": false
                        },
                        "ref": false
                    }
                ],
                "id": 100,
                "format": "Critical error: {d}"
            }
        ],
        "telemetryChannels": [
            {
                "name": "TestComponent.Temperature",
                "type": {
                    "name": "F32",
                    "kind": "float",
                    "size": 32
                },
                "id": 200,
                "telemetryUpdate": "always"
            }
        ]
    }"#;

    // Write to temporary file
    let temp_dir = std::env::temp_dir();
    let input_path = temp_dir.join("cli_test_dict.json");
    fs::write(&input_path, test_json).expect("Failed to write test file");

    // Run the binary
    let output = Command::new(env!("CARGO_BIN_EXE_hermes-fprime-dictionary"))
        .arg(&input_path)
        .output()
        .expect("Failed to execute binary");

    // Verify it succeeded
    assert!(
        output.status.success(),
        "Binary failed with stderr: {}",
        String::from_utf8_lossy(&output.stderr)
    );

    // Verify the output is not empty
    assert!(!output.stdout.is_empty(), "Binary produced no output");

    // Verify we can decode it as a valid dictionary
    let dictionary =
        hermes_pb::Dictionary::decode(&output.stdout[..]).expect("Failed to decode protobuf");

    // Verify the content
    let head = dictionary.head.expect("No dictionary head");
    assert_eq!(head.r#type, "fprime");
    assert_eq!(head.name, "CliTestDeployment");
    assert_eq!(head.version, "1.0.0");

    // Verify namespaces exist
    assert!(dictionary.content.contains_key(""));
    let ns = dictionary.content.get("").expect("No main namespace");

    // Verify commands
    assert_eq!(ns.commands.len(), 1);
    let cmd = ns
        .commands
        .get("TestComponent.TestCommand")
        .expect("Command not found");
    assert_eq!(cmd.opcode, 42);
    assert_eq!(cmd.mnemonic, "TestCommand");
    assert_eq!(cmd.component, "TestComponent");

    // Verify events
    assert_eq!(ns.events.len(), 1);
    let evt = ns
        .events
        .get("TestComponent.TestEvent")
        .expect("Event not found");
    assert_eq!(evt.id, 100);
    assert_eq!(evt.name, "TestEvent");
    assert_eq!(evt.severity, hermes_pb::EvrSeverity::EvrFatal as i32);
    assert_eq!(evt.arguments.len(), 1);
    // Verify format string was parsed into fragments
    let format = evt.format.as_ref().expect("No format");
    assert_eq!(format.original, "Critical error: {d}");
    assert!(format.fragments.len() > 0);

    // Verify telemetry
    assert_eq!(ns.telemetry.len(), 1);
    let tlm = ns
        .telemetry
        .get("TestComponent.Temperature")
        .expect("Telemetry not found");
    assert_eq!(tlm.id, 200);
    assert_eq!(tlm.name, "Temperature");

    // Cleanup
    fs::remove_file(&input_path).ok();
}

#[test]
fn test_cli_help() {
    let output = Command::new(env!("CARGO_BIN_EXE_hermes-fprime-dictionary"))
        .arg("--help")
        .output()
        .expect("Failed to execute binary");

    assert!(output.status.success());
    let stdout = String::from_utf8_lossy(&output.stdout);
    assert!(stdout.contains("Load an FPrime (JSON) dictionary"));
    assert!(stdout.contains("Usage:"));
}

#[test]
fn test_cli_missing_file() {
    let output = Command::new(env!("CARGO_BIN_EXE_hermes-fprime-dictionary"))
        .arg("/nonexistent/file.json")
        .output()
        .expect("Failed to execute binary");

    assert!(!output.status.success());
    let stderr = String::from_utf8_lossy(&output.stderr);
    assert!(stderr.contains("Error:") || stderr.contains("error"));
}

#[test]
fn test_lib_and_binary_produce_same_output() {
    let test_json = r#"{
        "metadata": {
            "deploymentName": "Consistency",
            "projectVersion": "2.0.0"
        },
        "commands": [],
        "events": [],
        "telemetryChannels": []
    }"#;

    // Parse using library
    let lib_dict = parse_fprime_json_dictionary(test_json).expect("Library parse failed");
    let mut lib_buf = Vec::new();
    lib_dict
        .encode(&mut lib_buf)
        .expect("Library encode failed");

    // Parse using binary
    let temp_dir = std::env::temp_dir();
    let input_path = temp_dir.join("consistency_test.json");
    fs::write(&input_path, test_json).expect("Failed to write test file");

    let output = Command::new(env!("CARGO_BIN_EXE_hermes-fprime-dictionary"))
        .arg(&input_path)
        .output()
        .expect("Failed to execute binary");

    assert!(output.status.success());

    // Compare outputs
    assert_eq!(
        lib_buf, output.stdout,
        "Library and binary produce different outputs"
    );

    // Cleanup
    fs::remove_file(&input_path).ok();
}
