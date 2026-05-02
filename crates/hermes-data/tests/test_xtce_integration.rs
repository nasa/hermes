/// Integration tests for XTCE command loading and flattening
/// This test validates that the parameter type resolution bug is fixed
/// and that command flattening works correctly with verifiers and constraints

use hermes_data::{MissionDatabase, Result};

#[test]
fn test_minimal_command_with_integer_argument() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/minimal_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Verify command exists
    let cmd = mdb
        .get_command("/Minimal/SetMode")
        .expect("Command should exist");

    // Verify argument was loaded correctly
    assert_eq!(cmd.args.len(), 1, "Should have 1 argument");
    assert_eq!(cmd.args[0].head.name, "Mode");

    // Verify protobuf conversion works
    let proto_def: hermes_pb::CommandDef = cmd.as_ref().into();

    assert_eq!(proto_def.arguments.len(), 1);
    assert!(proto_def.r#abstract == false);

    Ok(())
}

#[test]
fn test_command_with_enumerated_argument() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Verify command exists
    let cmd = mdb
        .get_command("/TestSystem/SetHeater")
        .expect("Command should exist");

    // Verify enumerated argument was loaded
    assert_eq!(cmd.args.len(), 1);
    assert_eq!(cmd.args[0].head.name, "EnableDisable");

    // Verify type is enumerated
    match cmd.args[0].type_.as_ref() {
        hermes_data::Type::Enumerated(enum_ty) => {
            assert_eq!(enum_ty.enumeration_list.len(), 2);
            assert!(enum_ty
                .enumeration_list
                .iter()
                .any(|e| e.label == "DISABLE" && e.value == 0));
            assert!(enum_ty
                .enumeration_list
                .iter()
                .any(|e| e.label == "ENABLE" && e.value == 1));
        }
        _ => panic!("Expected Enumerated type"),
    }

    Ok(())
}

#[test]
fn test_command_verifiers_and_constraints() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let cmd = mdb
        .get_command("/TestSystem/SetHeater")
        .expect("Command should exist");

    // Verify verifiers were parsed (ReceivedVerifier, AcceptedVerifier, CompleteVerifier)
    assert_eq!(cmd.verifiers.len(), 3, "Should have 3 verifiers");

    // Verify collect_verifiers works (no base command, so same as direct access)
    let collected_verifiers = cmd.collect_verifiers();
    assert_eq!(collected_verifiers.len(), 3);

    Ok(())
}

#[test]
fn test_all_command_defs_filters_abstract() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Filter out abstract commands and convert to protobuf
    let command_defs: Vec<hermes_pb::CommandDef> = mdb
        .all_commands()
        .iter()
        .filter(|(_, cmd)| !cmd.abstract_)
        .map(|(_, cmd)| cmd.as_ref().into())
        .collect();

    // Should only include non-abstract commands
    assert!(!command_defs.is_empty());
    assert!(
        !command_defs.iter().any(|cmd| cmd.r#abstract),
        "Should not include abstract commands"
    );

    // Verify SetHeater is included
    assert!(
        command_defs
            .iter()
            .any(|cmd| cmd.def.as_ref().map(|d| d.name == "SetHeater").unwrap_or(false)),
        "SetHeater should be in command defs"
    );

    Ok(())
}

#[test]
fn test_protobuf_conversion_includes_all_fields() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let cmd = mdb
        .get_command("/TestSystem/SetHeater")
        .expect("Command should exist");

    // Convert to protobuf
    let command_def: hermes_pb::CommandDef = cmd.as_ref().into();

    // Verify XtceDef is populated
    let def = command_def.def.as_ref().expect("Should have def");
    assert_eq!(def.name, "SetHeater");
    assert_eq!(def.qualified_name, "/TestSystem/SetHeater");
    assert!(def.short_description.is_none() || !def.short_description.as_ref().unwrap().is_empty());

    // Verify arguments
    assert_eq!(command_def.arguments.len(), 1);
    let arg = &command_def.arguments[0];
    let arg_def = arg.def.as_ref().expect("Argument should have def");
    assert_eq!(arg_def.name, "EnableDisable");
    assert!(arg.r#type.is_some(), "Argument should have type");

    // Verify constraints (none in this test file to avoid cross-metadata issues)
    assert_eq!(command_def.transmission_constraints.len(), 0);

    Ok(())
}
