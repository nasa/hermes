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
