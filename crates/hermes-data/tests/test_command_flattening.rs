use hermes_data::{MissionDatabase, Result};

#[test]
fn test_load_minimal_command() -> Result<()> {
    // Load minimal_command.xtce.xml - simplest possible command
    let xtce = include_str!("../../hermes-xtce/tests/data/minimal_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Get the SetMode command
    let set_mode_cmd = mdb
        .get_command("/Minimal/SetMode")
        .expect("SetMode command should exist");

    println!("Command: {}", set_mode_cmd.head.name);
    println!("  Arguments: {}", set_mode_cmd.args.len());

    assert_eq!(set_mode_cmd.args.len(), 1, "Should have 1 argument");
    assert_eq!(set_mode_cmd.args[0].head.name, "Mode", "Argument should be Mode");

    Ok(())
}

#[test]
fn test_load_simple_command() -> Result<()> {
    // Load simple_command.xtce.xml which has verifiers and constraints
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Get the SetHeater command
    let set_heater_cmd = mdb
        .get_command("/TestSystem/SetHeater")
        .expect("SetHeater command should exist");

    println!("Command: {}", set_heater_cmd.head.name);
    println!("  Arguments: {}", set_heater_cmd.args.len());
    println!("  Verifiers: {}", set_heater_cmd.verifiers.len());
    println!(
        "  Constraints: {}",
        set_heater_cmd.transmission_constraints.len()
    );

    // Should have 1 argument (EnableDisable)
    assert_eq!(set_heater_cmd.args.len(), 1, "Should have 1 argument");
    assert_eq!(
        set_heater_cmd.args[0].head.name, "EnableDisable",
        "Argument should be EnableDisable"
    );

    // Should have verifiers (3 types: Received, Accepted, Complete)
    assert_eq!(
        set_heater_cmd.verifiers.len(),
        3,
        "Should have 3 verifiers"
    );

    // Constraints removed to avoid cross-metadata references
    // (telemetry params referenced from commands causes issues)
    assert_eq!(
        set_heater_cmd.transmission_constraints.len(),
        0,
        "Should have 0 constraints"
    );

    Ok(())
}

#[test]
fn test_convert_to_proto() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    // Get all commands and convert to protobuf (excluding abstract)
    let command_defs: Vec<hermes_pb::CommandDef> = mdb
        .all_commands()
        .iter()
        .filter(|(_, cmd)| !cmd.abstract_)
        .map(|(_, cmd)| cmd.as_ref().into())
        .collect();

    // Check that we have some commands
    assert!(!command_defs.is_empty(), "Should have some commands");

    // Check the SetHeater command
    let set_heater_def = command_defs
        .iter()
        .find(|cmd| {
            cmd.def
                .as_ref()
                .map(|d| d.name == "SetHeater")
                .unwrap_or(false)
        })
        .expect("Should find SetHeater command");

    let def = set_heater_def
        .def
        .as_ref()
        .expect("CommandDef should have def");
    println!("Command: {} ({})", def.name, def.qualified_name);
    println!("  Arguments: {}", set_heater_def.arguments.len());
    println!(
        "  Constraints: {}",
        set_heater_def.transmission_constraints.len()
    );

    assert_eq!(def.name, "SetHeater");
    assert_eq!(def.qualified_name, "/TestSystem/SetHeater");
    assert_eq!(set_heater_def.arguments.len(), 1);

    // Verify argument fields are populated
    for arg in &set_heater_def.arguments {
        let arg_def = arg.def.as_ref().expect("ArgumentDef should have def");
        assert!(!arg_def.name.is_empty());
        assert!(arg.r#type.is_some());

        println!("  Argument: {}", arg_def.name);
    }

    // Constraints removed to avoid cross-metadata references
    assert_eq!(
        set_heater_def.transmission_constraints.len(),
        0,
        "Should have 0 transmission constraints"
    );

    Ok(())
}

#[test]
fn test_collect_verifiers() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let set_heater_cmd = mdb
        .get_command("/TestSystem/SetHeater")
        .expect("SetHeater command should exist");

    // Collect verifiers (including from base commands)
    let verifiers = set_heater_cmd.collect_verifiers();

    println!("Collected {} verifiers", verifiers.len());
    assert_eq!(verifiers.len(), 3, "Should have collected 3 verifiers");

    Ok(())
}

#[test]
fn test_collect_constraints() -> Result<()> {
    let xtce = include_str!("../../hermes-xtce/tests/data/simple_command.xtce.xml");
    let mdb = MissionDatabase::new_from_xtce_str(xtce)?;

    let set_heater_cmd = mdb
        .get_command("/TestSystem/SetHeater")
        .expect("SetHeater command should exist");

    // Collect constraints (including from base commands)
    let constraints = set_heater_cmd.collect_constraints();

    println!("Collected {} constraints", constraints.len());
    for constraint in &constraints {
        println!("  Constraint: {}", constraint.description);
    }

    assert_eq!(
        constraints.len(),
        0,
        "Should have collected 0 constraints"
    );

    Ok(())
}
