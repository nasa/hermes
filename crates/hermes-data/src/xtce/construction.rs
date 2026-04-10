/// Multi-pass construction functions for building data structures from XTCE
use std::collections::HashMap;
use std::sync::Arc;

use super::collection::{UnresolvedContainer, UnresolvedParameter, UnresolvedParameterType};
use super::conversion::convert_restriction_criteria;
use super::resolution::{resolve_container_reference, resolve_parameter_type_name};
use crate::de::{RestrictionCriteria, SequenceContainerType};
use crate::xtce::container::convert_entry;
use crate::xtce::types::{
    convert_parameter_type_set, convert_parameter_type_set_with_context,
    convert_parameter_type_set_with_parameters,
};
use crate::{Error, Result};
use crate::{Item, Parameter};

/// Construct parameter types in multiple passes:
/// Pass 1: Simple types (int, float, string, bool, enum, time) - no dependencies
/// Pass 2: Aggregate types - depend on simple types
/// Binary and Array types are deferred until parameters are available (they can reference parameters)
pub(crate) fn construct_parameter_types_pass1(
    unresolved: HashMap<String, UnresolvedParameterType>,
) -> Result<(
    HashMap<String, Arc<crate::Type>>,
    Vec<(String, UnresolvedParameterType)>, // deferred binary types
    Vec<(String, UnresolvedParameterType)>, // deferred array types
    Vec<(String, UnresolvedParameterType)>, // deferred aggregate types
)> {
    let mut completed: HashMap<String, Arc<crate::Type>> = HashMap::new();
    let mut deferred_binary_types: Vec<(String, UnresolvedParameterType)> = Vec::new();
    let mut deferred_array_types: Vec<(String, UnresolvedParameterType)> = Vec::new();
    let mut deferred_aggregate_types: Vec<(String, UnresolvedParameterType)> = Vec::new();

    // Convert simple types that don't reference other types or parameters
    for (qualified_name, unresolved_type) in unresolved {
        match &unresolved_type.xml {
            // Defer Binary, Array, and Aggregate types
            hermes_xtce::ParameterTypeSetType::BinaryParameterType(_) => {
                deferred_binary_types.push((qualified_name, unresolved_type));
            }
            hermes_xtce::ParameterTypeSetType::ArrayParameterType(_) => {
                deferred_array_types.push((qualified_name, unresolved_type));
            }
            hermes_xtce::ParameterTypeSetType::AggregateParameterType(_) => {
                deferred_aggregate_types.push((qualified_name, unresolved_type));
            }
            // Convert all other types immediately
            _ => match convert_parameter_type_set(&unresolved_type.xml) {
                Ok(type_) => {
                    completed.insert(qualified_name, Arc::new(type_));
                }
                Err(Error::NotImplemented(_)) => {
                    unreachable!("These types should be deferred")
                }
                Err(e) => {
                    // Propagate other errors
                    return Err(e);
                }
            },
        }
    }

    Ok((
        completed,
        deferred_binary_types,
        deferred_array_types,
        deferred_aggregate_types,
    ))
}

/// Pass 2: Construct Aggregate types (after simple types are available)
/// This uses multi-pass construction to handle dependencies between aggregate types.
pub(crate) fn construct_parameter_types_pass2_aggregates(
    deferred_aggregate_types: Vec<(String, UnresolvedParameterType)>,
    completed: &mut HashMap<String, Arc<crate::Type>>,
) -> Result<()> {
    let mut remaining = deferred_aggregate_types;
    let mut failed_permanently = Vec::new();

    // Keep trying until we make no more progress
    while !remaining.is_empty() {
        let mut still_deferred = Vec::new();
        let mut made_progress = false;

        for (qualified_name, unresolved_type) in remaining {
            match convert_parameter_type_set_with_context(
                &unresolved_type.xml,
                &unresolved_type.space_system_path,
                &completed,
            ) {
                Ok(type_) => {
                    completed.insert(qualified_name, Arc::new(type_));
                    made_progress = true;
                }
                Err(Error::NotImplemented(msg)) => {
                    // These are permanently unsupported types
                    tracing::warn!(
                        "Skipping unsupported parameter type '{}': {}",
                        qualified_name,
                        msg
                    );
                    failed_permanently.push(qualified_name);
                }
                Err(Error::InvalidXtce(ref msg)) if msg.contains("not found") => {
                    // This is likely a missing dependency - defer for next pass
                    still_deferred.push((qualified_name, unresolved_type));
                }
                Err(e) => {
                    // Other errors should be logged but not retried
                    tracing::warn!(
                        "Failed to construct aggregate type '{}': {}",
                        qualified_name,
                        e
                    );
                    failed_permanently.push(qualified_name);
                }
            }
        }

        // If we didn't make progress and still have deferred types, they must have unresolvable dependencies
        if !made_progress && !still_deferred.is_empty() {
            for (qualified_name, _) in still_deferred {
                tracing::warn!(
                    "Failed to construct aggregate type '{}': unresolvable type dependencies",
                    qualified_name
                );
            }
            break;
        }

        remaining = still_deferred;
    }

    Ok(())
}

/// Pass 3: Construct Binary and Array types (after parameters are available)
pub(crate) fn construct_parameter_types_pass3_binary_array(
    deferred_binary_types: Vec<(String, UnresolvedParameterType)>,
    deferred_array_types: Vec<(String, UnresolvedParameterType)>,
    types: &mut HashMap<String, Arc<crate::Type>>,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<()> {
    // Construct binary types first
    for (qualified_name, unresolved_type) in deferred_binary_types {
        match convert_parameter_type_set_with_parameters(
            &unresolved_type.xml,
            &unresolved_type.space_system_path,
            types,
            parameters,
        ) {
            Ok(type_) => {
                types.insert(qualified_name, Arc::new(type_));
            }
            Err(e) => {
                tracing::warn!(
                    "Failed to construct binary type '{}': {}",
                    qualified_name,
                    e
                );
            }
        }
    }

    // Then construct array types
    for (qualified_name, unresolved_type) in deferred_array_types {
        match convert_parameter_type_set_with_parameters(
            &unresolved_type.xml,
            &unresolved_type.space_system_path,
            types,
            parameters,
        ) {
            Ok(type_) => {
                types.insert(qualified_name, Arc::new(type_));
            }
            Err(e) => {
                tracing::warn!("Failed to construct array type '{}': {}", qualified_name, e);
            }
        }
    }

    Ok(())
}

/// Construct parameters with available types.
/// Returns completed parameters and a list of unresolved parameters (whose types don't exist yet).
pub(crate) fn construct_parameters(
    unresolved: HashMap<String, UnresolvedParameter>,
    parameter_types: &HashMap<String, Arc<crate::Type>>,
) -> (
    HashMap<String, Arc<Parameter>>,
    HashMap<String, UnresolvedParameter>,
) {
    let mut completed: HashMap<String, Arc<Parameter>> = HashMap::new();
    let mut still_unresolved: HashMap<String, UnresolvedParameter> = HashMap::new();

    for (qualified_name, unresolved_param) in unresolved {
        // Try to resolve parameter type reference
        match resolve_parameter_type_name(
            &unresolved_param.space_system_path,
            &unresolved_param.parameter_type_ref,
            parameter_types,
        ) {
            Ok(resolved_type_name) => {
                if let Some(type_) = parameter_types.get(&resolved_type_name) {
                    let parameter = Parameter {
                        head: Item {
                            name: unresolved_param.xml.name.clone(),
                            qualified_name: qualified_name.clone(),
                            short_description: unresolved_param.xml.short_description.clone(),
                            long_description: unresolved_param.xml.long_description.clone(),
                            ancillary_data_set: unresolved_param.xml.ancillary_data_set.clone(),
                        },
                        type_: type_.clone(),
                        properties: unresolved_param.xml.parameter_properties.clone(),
                    };

                    completed.insert(qualified_name, Arc::new(parameter));
                } else {
                    // Type not available yet - defer
                    still_unresolved.insert(qualified_name, unresolved_param);
                }
            }
            Err(_) => {
                // Type not found - defer
                still_unresolved.insert(qualified_name, unresolved_param);
            }
        }
    }

    (completed, still_unresolved)
}

/// Construct remaining parameters after all types are available.
pub(crate) fn construct_remaining_parameters(
    unresolved: HashMap<String, UnresolvedParameter>,
    parameter_types: &HashMap<String, Arc<crate::Type>>,
    completed: &mut HashMap<String, Arc<Parameter>>,
) -> Result<()> {
    for (qualified_name, unresolved_param) in unresolved {
        // Try to resolve parameter type reference
        match resolve_parameter_type_name(
            &unresolved_param.space_system_path,
            &unresolved_param.parameter_type_ref,
            parameter_types,
        ) {
            Ok(resolved_type_name) => {
                let type_ = parameter_types
                    .get(&resolved_type_name)
                    .ok_or_else(|| {
                        Error::InvalidXtce(format!(
                            "Parameter type '{}' not found in constructed types",
                            resolved_type_name
                        ))
                    })?
                    .clone();

                let parameter = Parameter {
                    head: Item {
                        name: unresolved_param.xml.name.clone(),
                        qualified_name: qualified_name.clone(),
                        short_description: unresolved_param.xml.short_description.clone(),
                        long_description: unresolved_param.xml.long_description.clone(),
                        ancillary_data_set: unresolved_param.xml.ancillary_data_set.clone(),
                    },
                    type_,
                    properties: unresolved_param.xml.parameter_properties.clone(),
                };

                completed.insert(qualified_name, Arc::new(parameter));
            }
            Err(_) => {
                // Skip parameters that reference unsupported or missing types
                tracing::warn!(
                    "Skipping parameter '{}' because its type '{}' could not be resolved",
                    qualified_name,
                    unresolved_param.parameter_type_ref
                );
            }
        }
    }

    Ok(())
}

/// Takes unresolved containers and creates a dependency graph where each container
/// knows its parent's fully qualified name. Returns containers in topological order
/// along with the resolved dependencies mapping.
pub(crate) fn build_dependency_graph(
    unresolved: &HashMap<String, UnresolvedContainer>,
) -> Result<(Vec<String>, HashMap<String, String>)> {
    let mut dependencies: HashMap<String, String> = HashMap::new();

    // Resolve all container references to fully qualified names
    for (qualified_name, container) in unresolved {
        if let Some(base_ref) = &container.base_container_ref {
            // Resolve the base container reference with upward search
            let resolved_parent =
                resolve_container_reference(&container.space_system_path, base_ref, &unresolved)?;

            // Verify the parent exists (should already be checked by resolve_container_reference)
            if !unresolved.contains_key(&resolved_parent) {
                return Err(Error::ContainerNotFound(format!(
                    "Container '{}' references non-existent parent '{}'",
                    qualified_name, resolved_parent
                )));
            }

            dependencies.insert(qualified_name.clone(), resolved_parent);
        }
    }

    // Topological sort using Kahn's algorithm
    let mut in_degree: HashMap<String, usize> = HashMap::new();
    let mut children: HashMap<String, Vec<String>> = HashMap::new();

    // Initialize in-degree counts
    for name in unresolved.keys() {
        in_degree.insert(name.clone(), 0);
    }

    // Build graph and count in-degrees
    for (child, parent) in &dependencies {
        *in_degree.get_mut(child).unwrap() += 1;
        children
            .entry(parent.clone())
            .or_default()
            .push(child.clone());
    }

    // Find all nodes with no dependencies (in-degree 0)
    let mut queue: Vec<String> = in_degree
        .iter()
        .filter(|(_, deg)| **deg == 0)
        .map(|(name, _)| name.clone())
        .collect();

    let mut sorted = Vec::new();

    while let Some(node) = queue.pop() {
        sorted.push(node.clone());

        // Reduce in-degree for all children
        if let Some(child_list) = children.get(&node) {
            for child in child_list {
                let degree = in_degree.get_mut(child).unwrap();
                *degree -= 1;
                if *degree == 0 {
                    queue.push(child.clone());
                }
            }
        }
    }

    // Check for cycles
    if sorted.len() != unresolved.len() {
        return Err(Error::InvalidXtce(
            "Circular dependency detected in container inheritance".to_string(),
        ));
    }

    Ok((sorted, dependencies))
}

/// Build SequenceContainer objects in reverse topological order (children before parents)
/// so that each parent can include references to its already-constructed children.
pub(crate) fn construct_containers(
    unresolved: HashMap<String, UnresolvedContainer>,
    sorted_names: Vec<String>,
    dependencies: HashMap<String, String>,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<HashMap<String, Arc<SequenceContainerType>>> {
    // Build reverse mapping: parent -> [(child_name, restriction_criteria)]
    let mut parent_to_children: HashMap<String, Vec<(String, RestrictionCriteria)>> =
        HashMap::new();

    for (child_name, parent_name) in &dependencies {
        let unresolved_container = unresolved.get(child_name).ok_or_else(|| {
            Error::InvalidXtce(format!(
                "Child container '{}' not found in unresolved map",
                child_name
            ))
        })?;

        let criteria = if let Some(base_container) = &unresolved_container.xml.base_container {
            base_container
                .restriction_criteria
                .as_ref()
                .map(|rc| {
                    convert_restriction_criteria(
                        rc,
                        &unresolved_container.space_system_path,
                        parameters,
                    )
                })
                .transpose()?
        } else {
            None
        };

        // A child must have restriction criteria to be a valid child
        if let Some(criteria) = criteria {
            parent_to_children
                .entry(parent_name.clone())
                .or_default()
                .push((child_name.clone(), criteria));
        } else {
            return Err(Error::InvalidXtce(format!(
                "Child container '{}' has parent '{}' but no restriction criteria",
                child_name, parent_name
            )));
        }
    }

    let mut completed: HashMap<String, Arc<SequenceContainerType>> = HashMap::new();

    // Process containers in reverse topological order (children first, then parents)
    for qualified_name in sorted_names.into_iter().rev() {
        let unresolved_container = unresolved.get(&qualified_name).ok_or_else(|| {
            Error::InvalidXtce(format!(
                "Container '{}' not found in unresolved map",
                qualified_name
            ))
        })?;

        // Create the container with parameter and container reference resolution
        let mut container = construct_sequence_container_type(
            unresolved_container.xml.clone(),
            qualified_name.clone(),
            &unresolved_container.space_system_path,
            parameters,
            &unresolved,
        )?;

        // Add children if this container is a parent
        if let Some(children_list) = parent_to_children.get(&qualified_name) {
            for (child_name, criteria) in children_list {
                let child_rc = completed
                    .get(child_name)
                    .ok_or_else(|| {
                        Error::InvalidXtce(format!(
                            "Child container '{}' not yet constructed when building parent '{}'",
                            child_name, qualified_name
                        ))
                    })?
                    .clone();

                container.children.push((criteria.clone(), child_rc));
            }
        }

        completed.insert(qualified_name, Arc::new(container));
    }

    Ok(completed)
}

pub(crate) fn construct_sequence_container_type(
    xml: hermes_xtce::SequenceContainerType,
    qualified_name: String,
    space_system_path: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
    containers: &HashMap<String, UnresolvedContainer>,
) -> Result<SequenceContainerType> {
    // Convert size_in_bits if specified via binary encoding
    let size_in_bits = if let Some(encoding) = &xml.binary_encoding {
        encoding
            .size_in_bits
            .as_ref()
            .map(|iv| crate::xtce::convert_integer_value(iv, space_system_path, parameters))
            .transpose()?
    } else {
        None
    };

    // Convert entry list with parameter and container reference resolution
    let entry_list = xml
        .entry_list
        .into_iter()
        .map(|e| convert_entry(e, space_system_path, parameters, containers))
        .collect::<Result<Vec<_>>>()?;

    Ok(SequenceContainerType {
        head: Item {
            name: xml.name.clone(),
            qualified_name,
            short_description: xml.short_description.clone(),
            long_description: xml.long_description.clone(),
            ancillary_data_set: xml.ancillary_data_set.clone(),
        },
        abstract_: xml.abstract_,
        size_in_bits,
        entry_list,
        children: vec![],
    })
}
