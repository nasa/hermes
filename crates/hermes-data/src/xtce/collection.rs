/// Functions for traversing the XTCE SpaceSystem tree and collecting items
use std::collections::HashMap;

use super::utils::make_qualified_name;

/// Intermediate structure holding a container during Pass 1 before dependencies are resolved
#[derive(Clone)]
pub(crate) struct UnresolvedContainer {
    /// The original XTCE XML container definition
    pub xml: hermes_xtce::SequenceContainerType,
    /// Unresolved base container reference (may be relative/unqualified)
    pub base_container_ref: Option<String>,
    /// The SpaceSystem path where this container is defined (for resolving relative refs)
    pub space_system_path: String,
}

/// Intermediate structure holding a parameter type during Pass 1 before construction
#[derive(Clone)]
pub(crate) struct UnresolvedParameterType {
    /// The original XTCE XML parameter type definition
    pub xml: hermes_xtce::ParameterTypeSetType,
    /// The SpaceSystem path where this type is defined
    pub space_system_path: String,
}

/// Intermediate structure holding a parameter during Pass 1 before construction
#[derive(Clone)]
pub(crate) struct UnresolvedParameter {
    /// The original XTCE XML parameter definition
    pub xml: hermes_xtce::ParameterType,
    /// Unresolved parameter type reference (may be relative/unqualified)
    pub parameter_type_ref: String,
    /// The SpaceSystem path where this parameter is defined
    pub space_system_path: String,
}

/// Pass 1: Collect containers from SpaceSystem tree
///
/// Recursively traverse the SpaceSystem tree, collecting all SequenceContainers
/// along with their fully qualified names and unresolved base container references.
pub(crate) fn collect_containers(
    path: &str,
    schema: &hermes_xtce::SpaceSystem,
    unresolved: &mut HashMap<String, UnresolvedContainer>,
) {
    use hermes_xtce::ContainerSetType;

    // Collect telemetry containers
    if let Some(telemetry_metadata) = &schema.telemetry_meta_data {
        for container_set in &telemetry_metadata.container_set {
            match container_set {
                ContainerSetType::SequenceContainer(container) => {
                    let qualified_name = make_qualified_name(path, &container.name);

                    let base_container_ref = container
                        .base_container
                        .as_ref()
                        .map(|bc| bc.container_ref.clone());

                    unresolved.insert(
                        qualified_name,
                        UnresolvedContainer {
                            xml: container.clone(),
                            base_container_ref,
                            space_system_path: path.to_string(),
                        },
                    );
                }
            }
        }
    }

    // Recursively process child SpaceSystems
    for child in &schema.space_system {
        let child_path = make_qualified_name(path, &child.name);
        collect_containers(&child_path, child, unresolved);
    }
}

/// Pass 1: Collect parameter types from SpaceSystem tree
///
/// Recursively traverse the SpaceSystem tree, collecting all ParameterTypes
/// along with their fully qualified names.
pub(crate) fn collect_parameter_types(
    path: &str,
    schema: &hermes_xtce::SpaceSystem,
    unresolved: &mut HashMap<String, UnresolvedParameterType>,
) {
    // Collect telemetry parameter types
    if let Some(telemetry_metadata) = &schema.telemetry_meta_data {
        for param_type_set in &telemetry_metadata.parameter_type_set {
            let name = get_parameter_type_name(param_type_set);
            let qualified_name = make_qualified_name(path, name);

            unresolved.insert(
                qualified_name,
                UnresolvedParameterType {
                    xml: param_type_set.clone(),
                    space_system_path: path.to_string(),
                },
            );
        }
    }

    // Recursively process child SpaceSystems
    for child in &schema.space_system {
        let child_path = make_qualified_name(path, &child.name);
        collect_parameter_types(&child_path, child, unresolved);
    }
}

/// Pass 1: Collect parameters from SpaceSystem tree
///
/// Recursively traverse the SpaceSystem tree, collecting all Parameters
/// along with their fully qualified names and unresolved type references.
pub(crate) fn collect_parameters(
    path: &str,
    schema: &hermes_xtce::SpaceSystem,
    unresolved: &mut HashMap<String, UnresolvedParameter>,
) {
    // Collect telemetry parameters
    if let Some(telemetry_metadata) = &schema.telemetry_meta_data {
        for param_set in &telemetry_metadata.parameter_set {
            match param_set {
                hermes_xtce::ParameterSetType::Parameter(param) => {
                    let qualified_name = make_qualified_name(path, &param.name);

                    unresolved.insert(
                        qualified_name,
                        UnresolvedParameter {
                            xml: param.clone(),
                            parameter_type_ref: param.parameter_type_ref.clone(),
                            space_system_path: path.to_string(),
                        },
                    );
                }
                hermes_xtce::ParameterSetType::ParameterRef(_) => {
                    // ParameterRef is a reference to a parameter defined elsewhere
                    // We skip it here as it doesn't define a new parameter
                }
            }
        }
    }

    // Recursively process child SpaceSystems
    for child in &schema.space_system {
        let child_path = make_qualified_name(path, &child.name);
        collect_parameters(&child_path, child, unresolved);
    }
}

/// Helper function to extract the name from a ParameterTypeSetType variant
fn get_parameter_type_name(param_type: &hermes_xtce::ParameterTypeSetType) -> &str {
    match param_type {
        hermes_xtce::ParameterTypeSetType::IntegerParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::FloatParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::StringParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::BooleanParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::EnumeratedParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::BinaryParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::AbsoluteTimeParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::RelativeTimeParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::ArrayParameterType(t) => &t.name,
        hermes_xtce::ParameterTypeSetType::AggregateParameterType(t) => &t.name,
    }
}

// ============================================================================
// Command-related collection functions
// ============================================================================

/// Intermediate structure holding an argument type during Pass 1 before construction
#[derive(Clone)]
pub(crate) struct UnresolvedArgumentType {
    /// The original XTCE XML argument type definition
    pub xml: hermes_xtce::ArgumentTypeSetType,
    /// The SpaceSystem path where this type is defined
    pub space_system_path: String,
}

/// Intermediate structure holding an argument during Pass 1 before construction
#[derive(Clone)]
pub(crate) struct UnresolvedArgument {
    /// The original XTCE XML argument definition
    pub xml: hermes_xtce::ArgumentType,
    /// Unresolved argument type reference (may be relative/unqualified)
    pub argument_type_ref: String,
    /// The SpaceSystem path where this argument is defined
    pub space_system_path: String,
}

/// Intermediate structure holding a meta command during Pass 1 before construction
#[derive(Clone)]
pub(crate) struct UnresolvedMetaCommand {
    /// The original XTCE XML meta command definition
    pub xml: hermes_xtce::MetaCommandType,
    /// Unresolved base command reference (may be relative/unqualified)
    pub base_command_ref: Option<String>,
    /// The SpaceSystem path where this command is defined
    pub space_system_path: String,
}

/// Intermediate structure holding a command container during Pass 1 before construction
#[derive(Clone)]
pub(crate) struct UnresolvedCommandContainer {
    /// The original XTCE XML command container definition
    pub xml: hermes_xtce::CommandContainerType,
    /// Unresolved base container reference (may be relative/unqualified)
    pub base_container_ref: Option<String>,
    /// The SpaceSystem path where this container is defined
    pub space_system_path: String,
}

/// Pass 1: Collect argument types from SpaceSystem tree
///
/// Recursively traverse the SpaceSystem tree, collecting all ArgumentTypes
/// along with their fully qualified names.
pub(crate) fn collect_argument_types(
    path: &str,
    schema: &hermes_xtce::SpaceSystem,
    unresolved: &mut HashMap<String, UnresolvedArgumentType>,
) {
    // Collect command argument types
    if let Some(commanding_metadata) = &schema.command_meta_data {
        for arg_type_set in &commanding_metadata.argument_type_set {
            let name = get_argument_type_name(arg_type_set);
            let qualified_name = make_qualified_name(path, name);

            unresolved.insert(
                qualified_name,
                UnresolvedArgumentType {
                    xml: arg_type_set.clone(),
                    space_system_path: path.to_string(),
                },
            );
        }
    }

    // Recursively process child SpaceSystems
    for child in &schema.space_system {
        let child_path = make_qualified_name(path, &child.name);
        collect_argument_types(&child_path, child, unresolved);
    }
}

/// Pass 1: Collect meta commands from SpaceSystem tree
///
/// Recursively traverse the SpaceSystem tree, collecting all MetaCommands
/// along with their fully qualified names and unresolved base command references.
pub(crate) fn collect_meta_commands(
    path: &str,
    schema: &hermes_xtce::SpaceSystem,
    unresolved: &mut HashMap<String, UnresolvedMetaCommand>,
) {
    // Collect commands
    if let Some(commanding_metadata) = &schema.command_meta_data {
        for meta_command_set in &commanding_metadata.meta_command_set {
            match meta_command_set {
                hermes_xtce::MetaCommandSetType::MetaCommand(command) => {
                    let qualified_name = make_qualified_name(path, &command.name);

                    let base_command_ref = command
                        .base_meta_command
                        .as_ref()
                        .map(|bc| bc.meta_command_ref.clone());

                    unresolved.insert(
                        qualified_name,
                        UnresolvedMetaCommand {
                            xml: command.clone(),
                            base_command_ref,
                            space_system_path: path.to_string(),
                        },
                    );
                }
                hermes_xtce::MetaCommandSetType::MetaCommandRef(_) => {
                    // MetaCommandRef is a reference to a command defined elsewhere
                    // We skip it here as it doesn't define a new command
                }
                hermes_xtce::MetaCommandSetType::BlockMetaCommand(_) => {
                    // BlockMetaCommand is not yet supported
                    // TODO: Add support for BlockMetaCommand
                }
            }
        }
    }

    // Recursively process child SpaceSystems
    for child in &schema.space_system {
        let child_path = make_qualified_name(path, &child.name);
        collect_meta_commands(&child_path, child, unresolved);
    }
}

/// Helper function to extract the name from an ArgumentTypeSetType variant
fn get_argument_type_name(arg_type: &hermes_xtce::ArgumentTypeSetType) -> &str {
    match arg_type {
        hermes_xtce::ArgumentTypeSetType::IntegerArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::FloatArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::StringArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::BooleanArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::EnumeratedArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::BinaryArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::AbsoluteTimeArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::RelativeTimeArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::ArrayArgumentType(t) => &t.name,
        hermes_xtce::ArgumentTypeSetType::AggregateArgumentType(t) => &t.name,
    }
}
