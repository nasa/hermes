use crate::Parameter;
/// Functions for resolving XTCE name references and lookups
use std::collections::HashMap;
use std::sync::Arc;

use crate::{Error, Result};

use super::collection::UnresolvedContainer;
use super::utils::{move_up_path, resolve_name_reference};

/// Generic upward search through SpaceSystem hierarchy with XTCE semantics.
///
/// For unqualified names or hierarchical paths, search starts in the current SpaceSystem
/// and moves upward through parent SpaceSystems until the item is found or root is reached.
///
/// # Arguments
/// * `current_path` - The path where the reference originates
/// * `name_ref` - The name reference (absolute, relative, or unqualified)
/// * `exists_fn` - Function to check if a candidate qualified name exists
/// * `error_fn` - Function to generate appropriate error message (name_ref, current_path, last_candidate_tried)
fn resolve_reference_with_upward_search<F, E>(
    current_path: &str,
    name_ref: &str,
    exists_fn: F,
    error_fn: E,
) -> Result<String>
where
    F: Fn(&str) -> bool,
    E: Fn(&str, &str, &str) -> Error,
{
    // If it's an absolute path starting with /, use as-is (no upward search)
    if name_ref.starts_with('/') {
        if exists_fn(name_ref) {
            return Ok(name_ref.to_string());
        }
        return Err(error_fn(name_ref, current_path, name_ref));
    }

    // For relative or unqualified names (with or without /), do upward search
    // This handles both simple names ("Item") and hierarchical paths ("Sub/Item")
    let mut search_path = current_path.to_string();
    let mut last_candidate: String;
    loop {
        let candidate = resolve_name_reference(&search_path, name_ref);
        last_candidate = candidate.clone();

        if exists_fn(&candidate) {
            return Ok(candidate);
        }

        // Move up one level
        if search_path.is_empty() || search_path == "/" {
            // Reached root without finding the item
            return Err(error_fn(name_ref, current_path, &last_candidate));
        }

        search_path = move_up_path(&search_path);
    }
}

/// Resolve a container reference with XTCE upward search semantics.
///
/// For unqualified names, search starts in the current SpaceSystem and moves upward
/// through parent SpaceSystems until the container is found or root is reached.
pub(crate) fn resolve_container_reference(
    current_path: &str,
    name_ref: &str,
    unresolved: &HashMap<String, UnresolvedContainer>,
) -> Result<String> {
    resolve_reference_with_upward_search(
        current_path,
        name_ref,
        |candidate| unresolved.contains_key(candidate),
        |name_ref, context, last_tried| {
            if name_ref.contains('/') {
                Error::ContainerNotFound(format!(
                    "Container reference '{}' not found (searched from '{}', last tried '{}')",
                    name_ref, context, last_tried
                ))
            } else {
                Error::ContainerNotFound(format!(
                    "Container '{}' not found in '{}' or any parent SpaceSystem",
                    name_ref, context
                ))
            }
        },
    )
}

/// Resolve a parameter type name by searching in the constructed types map
pub(crate) fn resolve_parameter_type_name(
    current_path: &str,
    type_ref: &str,
    parameter_types: &HashMap<String, Arc<crate::Type>>,
) -> Result<String> {
    resolve_reference_with_upward_search(
        current_path,
        type_ref,
        |candidate| parameter_types.contains_key(candidate),
        |type_ref, context, last_tried| {
            if type_ref.contains('/') {
                Error::InvalidXtce(format!(
                    "Parameter type reference '{}' not found (searched from '{}', last tried '{}')",
                    type_ref, context, last_tried
                ))
            } else {
                Error::InvalidXtce(format!(
                    "Parameter type '{}' not found in '{}' or any parent SpaceSystem (last tried '{}')",
                    type_ref, context, last_tried
                ))
            }
        },
    )
}

/// Validate that a member path exists within an aggregate type.
/// Returns an error if the path is invalid or doesn't exist.
fn validate_member_path(
    parameter: &Parameter,
    member_path: &[String],
    full_ref: &str,
) -> Result<()> {
    if member_path.is_empty() {
        return Ok(());
    }

    let mut current_type = &*parameter.type_;

    for (index, member_name) in member_path.iter().enumerate() {
        match current_type {
            crate::Type::Aggregate(agg) => {
                // Find the member by name
                let member = agg.members.iter()
                    .find(|m| &m.name == member_name)
                    .ok_or_else(|| {
                        Error::InvalidXtce(format!(
                            "Member '{}' not found in aggregate parameter '{}' (full reference: '{}')",
                            member_name,
                            parameter.head.qualified_name,
                            full_ref
                        ))
                    })?;

                // Move to the member's type for the next iteration
                current_type = &member.type_;
            }
            _ => {
                return Err(Error::InvalidXtce(format!(
                    "Cannot access member '{}' on non-aggregate type at position {} in path (full reference: '{}')",
                    member_name, index, full_ref
                )));
            }
        }
    }

    Ok(())
}

/// Resolve a parameter reference to a fully qualified name using upward search.
/// This is used during container entry construction to resolve parameter refs.
///
/// Supports two types of references:
/// 1. Hierarchical parameter names: "CdhCore/version/CustomVersion02" (SpaceSystem hierarchy)
/// 2. Aggregate member references: "CCSDS_Packet_ID/Version" (parameter with member path)
///
/// The function tries to resolve the full reference as a parameter first. If that fails,
/// it tries progressively shorter prefixes to find a parameter with an aggregate type,
/// treating the remaining parts as the member path.
///
/// Returns (resolved_parameter_name, optional_member_path).
pub(crate) fn resolve_parameter_ref(
    space_system_path: &str,
    param_ref: &str,
    parameters: &HashMap<String, Arc<Parameter>>,
) -> Result<(String, Option<Vec<String>>)> {
    // First, try to resolve the entire reference as a parameter name
    // This handles hierarchical paths like "CdhCore/version/CustomVersion02"
    match resolve_reference_with_upward_search(
        space_system_path,
        param_ref,
        |name| parameters.contains_key(name),
        |_, _, _| Error::InvalidXtce("not found".to_string()), // Dummy error, we'll handle it below
    ) {
        Ok(resolved) => {
            // Successfully resolved as a complete parameter path
            return Ok((resolved, None));
        }
        Err(_) => {
            // Fall through to try aggregate member reference
        }
    }

    // If full resolution failed, try to split into parameter + member path
    // Walk backwards through the path, trying each prefix as a parameter name
    let parts: Vec<&str> = param_ref.split('/').collect();

    if parts.is_empty() {
        return Err(Error::InvalidXtce("Empty parameter reference".to_string()));
    }

    // Try each prefix, from longest to shortest (but at least one part for member path)
    for split_point in (1..parts.len()).rev() {
        let base_param_ref = parts[..split_point].join("/");
        let member_path: Vec<String> = parts[split_point..].iter().map(|s| s.to_string()).collect();

        // Try to resolve the base parameter
        if let Ok(resolved_param_name) = resolve_reference_with_upward_search(
            space_system_path,
            &base_param_ref,
            |name| parameters.contains_key(name),
            |_, _, _| Error::InvalidXtce("not found".to_string()),
        ) {
            // Found a parameter - validate that it has an aggregate type and the member path is valid
            let parameter = parameters.get(&resolved_param_name).ok_or_else(|| {
                Error::InvalidXtce(format!(
                    "Parameter '{}' not found after resolution",
                    resolved_param_name
                ))
            })?;

            // Validate the member path
            validate_member_path(parameter, &member_path, param_ref)?;

            return Ok((resolved_param_name, Some(member_path)));
        }
    }

    // If we get here, we couldn't resolve the reference at all
    Err(Error::InvalidXtce(format!(
        "Parameter '{}' not found in '{}' or parent SpaceSystems",
        param_ref, space_system_path
    )))
}
