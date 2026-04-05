use crate::container::SequenceContainer;
use crate::{
    BooleanExpression, Comparison, ComparisonCheck, Error, ParameterInstanceRef, ParameterRef,
    ParameterRefOrValue, RelativeTime, RestrictionCriteria, Result,
};
use std::collections::HashMap;
use std::rc::Rc;
use std::time::Duration;

/// Constructs a fully qualified name by joining a path and name.
///
/// Handles the special case where path is empty or root ("/").
fn make_qualified_name(path: &str, name: &str) -> String {
    if path.is_empty() || path == "/" {
        format!("/{}", name)
    } else {
        format!("{}/{}", path, name)
    }
}

/// Moves up one level in a hierarchical path.
///
/// Returns an empty string if already at or above root.
fn move_up_path(path: &str) -> String {
    if path.is_empty() || path == "/" {
        String::new()
    } else if let Some(idx) = path.rfind('/') {
        if idx == 0 {
            "/".to_string()
        } else {
            path[..idx].to_string()
        }
    } else {
        String::new()
    }
}

/// Resolves an XTCE name reference to a fully qualified name.
///
/// XTCE supports three forms of name references:
/// - Absolute: `/System/SubSystem/Item` - starts with `/`, used as-is
/// - Relative: `../Other/Item` or `./Item` - resolved relative to current_path
/// - Unqualified: `Item` - appended to current_path
///
/// # Arguments
/// * `current_path` - The fully qualified path of the current SpaceSystem (e.g., "/RootSystem/SubSystem")
/// * `name_ref` - The name reference string from XTCE XML
///
/// # Returns
/// A fully qualified name starting with `/`
pub(crate) fn resolve_name_reference(current_path: &str, name_ref: &str) -> String {
    if name_ref.starts_with('/') {
        // Absolute path - use as-is
        name_ref.to_string()
    } else if name_ref.contains("../") || name_ref.starts_with("./") || name_ref.contains("/") {
        // Relative path - resolve like filesystem paths
        let mut parts: Vec<&str> = current_path.split('/').filter(|s| !s.is_empty()).collect();

        for segment in name_ref.split('/') {
            match segment {
                "." | "" => continue,
                ".." => {
                    parts.pop();
                }
                s => parts.push(s),
            }
        }

        format!("/{}", parts.join("/"))
    } else {
        // Unqualified name - append to current path
        make_qualified_name(current_path, name_ref)
    }
}

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

/// Generic upward search through SpaceSystem hierarchy with XTCE semantics.
///
/// For unqualified names or hierarchical paths, search starts in the current SpaceSystem
/// and moves upward through parent SpaceSystems until the item is found or root is reached.
///
/// # Arguments
/// * `current_path` - The path where the reference originates
/// * `name_ref` - The name reference (absolute, relative, or unqualified)
/// * `exists_fn` - Function to check if a candidate qualified name exists
/// * `error_fn` - Function to generate appropriate error message
fn resolve_reference_with_upward_search<F, E>(
    current_path: &str,
    name_ref: &str,
    exists_fn: F,
    error_fn: E,
) -> Result<String>
where
    F: Fn(&str) -> bool,
    E: Fn(&str, &str) -> Error,
{
    // If it's an absolute path starting with /, use as-is (no upward search)
    if name_ref.starts_with('/') {
        if exists_fn(name_ref) {
            return Ok(name_ref.to_string());
        }
        return Err(error_fn(name_ref, name_ref));
    }

    // For relative or unqualified names (with or without /), do upward search
    // This handles both simple names ("Item") and hierarchical paths ("Sub/Item")
    let mut search_path = current_path.to_string();
    loop {
        let candidate = resolve_name_reference(&search_path, name_ref);

        if exists_fn(&candidate) {
            return Ok(candidate);
        }

        // Move up one level
        if search_path.is_empty() || search_path == "/" {
            // Reached root without finding the item
            return Err(error_fn(name_ref, current_path));
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
        |name_ref, context| {
            if name_ref.contains('/') {
                Error::ContainerNotFound(format!(
                    "Container reference '{}' resolved to '{}' but not found",
                    name_ref, context
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

/// Construct parameter types in multiple passes:
/// Pass 1: Simple types (int, float, string, bool, enum, time) - no dependencies
/// Pass 2: Aggregate types - depend on simple types
/// Binary and Array types are deferred until parameters are available (they can reference parameters)
pub(crate) fn construct_parameter_types_pass1(
    unresolved: HashMap<String, UnresolvedParameterType>,
) -> Result<(
    HashMap<String, Rc<crate::Type>>,
    Vec<(String, UnresolvedParameterType)>, // deferred binary types
    Vec<(String, UnresolvedParameterType)>, // deferred array types
    Vec<(String, UnresolvedParameterType)>, // deferred aggregate types
)> {
    let mut completed: HashMap<String, Rc<crate::Type>> = HashMap::new();
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
            _ => match crate::types::convert_parameter_type_set(&unresolved_type.xml) {
                Ok(type_) => {
                    completed.insert(qualified_name, Rc::new(type_));
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
pub(crate) fn construct_parameter_types_pass2_aggregates(
    deferred_aggregate_types: Vec<(String, UnresolvedParameterType)>,
    completed: &mut HashMap<String, Rc<crate::Type>>,
) -> Result<()> {
    for (qualified_name, unresolved_type) in deferred_aggregate_types {
        match crate::types::convert_parameter_type_set_with_context(
            &unresolved_type.xml,
            &unresolved_type.space_system_path,
            &completed,
        ) {
            Ok(type_) => {
                completed.insert(qualified_name, Rc::new(type_));
            }
            Err(Error::NotImplemented(msg)) => {
                tracing::warn!(
                    "Skipping unsupported parameter type '{}': {}",
                    qualified_name,
                    msg
                );
            }
            Err(e) => {
                tracing::warn!(
                    "Failed to construct aggregate type '{}': {}",
                    qualified_name,
                    e
                );
            }
        }
    }
    Ok(())
}

/// Pass 3: Construct Binary and Array types (after parameters are available)
pub(crate) fn construct_parameter_types_pass3_binary_array(
    deferred_binary_types: Vec<(String, UnresolvedParameterType)>,
    deferred_array_types: Vec<(String, UnresolvedParameterType)>,
    types: &mut HashMap<String, Rc<crate::Type>>,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<()> {
    // Construct binary types first
    for (qualified_name, unresolved_type) in deferred_binary_types {
        match crate::types::convert_parameter_type_set_with_parameters(
            &unresolved_type.xml,
            &unresolved_type.space_system_path,
            types,
            parameters,
        ) {
            Ok(type_) => {
                types.insert(qualified_name, Rc::new(type_));
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
        match crate::types::convert_parameter_type_set_with_parameters(
            &unresolved_type.xml,
            &unresolved_type.space_system_path,
            types,
            parameters,
        ) {
            Ok(type_) => {
                types.insert(qualified_name, Rc::new(type_));
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
    parameter_types: &HashMap<String, Rc<crate::Type>>,
) -> (
    HashMap<String, Rc<crate::Parameter>>,
    HashMap<String, UnresolvedParameter>,
) {
    let mut completed: HashMap<String, Rc<crate::Parameter>> = HashMap::new();
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
                    let parameter = crate::Parameter {
                        head: crate::Item {
                            name: unresolved_param.xml.name.clone(),
                            qualified_name: qualified_name.clone(),
                            short_description: unresolved_param.xml.short_description.clone(),
                            long_description: unresolved_param.xml.long_description.clone(),
                            ancillary_data_set: unresolved_param.xml.ancillary_data_set.clone(),
                        },
                        type_: type_.clone(),
                        properties: unresolved_param.xml.parameter_properties.clone(),
                    };

                    completed.insert(qualified_name, Rc::new(parameter));
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
    parameter_types: &HashMap<String, Rc<crate::Type>>,
    completed: &mut HashMap<String, Rc<crate::Parameter>>,
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

                let parameter = crate::Parameter {
                    head: crate::Item {
                        name: unresolved_param.xml.name.clone(),
                        qualified_name: qualified_name.clone(),
                        short_description: unresolved_param.xml.short_description.clone(),
                        long_description: unresolved_param.xml.long_description.clone(),
                        ancillary_data_set: unresolved_param.xml.ancillary_data_set.clone(),
                    },
                    type_,
                    properties: unresolved_param.xml.parameter_properties.clone(),
                };

                completed.insert(qualified_name, Rc::new(parameter));
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

/// Resolve a parameter type name by searching in the constructed types map
pub(crate) fn resolve_parameter_type_name(
    current_path: &str,
    type_ref: &str,
    parameter_types: &HashMap<String, Rc<crate::Type>>,
) -> Result<String> {
    resolve_reference_with_upward_search(
        current_path,
        type_ref,
        |candidate| parameter_types.contains_key(candidate),
        |type_ref, context| {
            if type_ref.contains('/') {
                Error::InvalidXtce(format!(
                    "Parameter type reference '{}' resolved to '{}' but not found",
                    type_ref, context
                ))
            } else {
                Error::InvalidXtce(format!(
                    "Parameter type '{}' not found in '{}' or any parent SpaceSystem",
                    type_ref, context
                ))
            }
        },
    )
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

/// Get the type at the end of a member path within an aggregate parameter.
/// If member_path is None, returns the parameter's type.
/// If member_path is Some, navigates through the aggregate structure and returns the member's type.
fn get_member_type<'a>(
    parameter: &'a crate::Parameter,
    member_path: &Option<Vec<String>>,
) -> Result<&'a crate::Type> {
    match member_path {
        None => Ok(&*parameter.type_),
        Some(path) => {
            let mut current_type = &*parameter.type_;

            for member_name in path {
                match current_type {
                    crate::Type::Aggregate(agg) => {
                        let member = agg.members.iter()
                            .find(|m| &m.name == member_name)
                            .ok_or_else(|| {
                                Error::InvalidXtce(format!(
                                    "Member '{}' not found in aggregate parameter '{}'",
                                    member_name,
                                    parameter.head.qualified_name
                                ))
                            })?;
                        current_type = &member.type_;
                    }
                    _ => {
                        return Err(Error::InvalidXtce(format!(
                            "Cannot access member '{}' on non-aggregate type",
                            member_name
                        )));
                    }
                }
            }

            Ok(current_type)
        }
    }
}

fn convert_restriction_criteria(
    xml: &hermes_xtce::RestrictionCriteriaType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<RestrictionCriteria> {
    use hermes_xtce::RestrictionCriteriaType as X;
    match xml {
        X::Comparison(comp) => Ok(RestrictionCriteria::Comparison(convert_comparison(
            comp,
            space_system_path,
            parameters,
        )?)),
        X::ComparisonList(list) => {
            let comparisons = list
                .comparison
                .iter()
                .map(|c| convert_comparison(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(RestrictionCriteria::ComparisonList(comparisons))
        }
        X::BooleanExpression(expr) => Ok(RestrictionCriteria::BooleanExpression(
            convert_boolean_expression(expr, space_system_path, parameters)?,
        )),
        X::CustomAlgorithm(_) => Err(Error::NotImplemented(
            "CustomAlgorithm in RestrictionCriteria",
        )),
        X::NextContainer(_) => Err(Error::NotImplemented(
            "NextContainer in RestrictionCriteria",
        )),
    }
}

fn convert_comparison_check(
    xml: &hermes_xtce::ComparisonCheckType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<ComparisonCheck> {
    use hermes_xtce::ComparisonCheckTypeContent as C;

    // The content array has exactly 3 elements:
    // [0]: ParameterInstanceRef (left side)
    // [1]: ComparisonOperator
    // [2]: Value or ParameterInstanceRef (right side)

    let left_param_ref_xml = match &xml.content[0] {
        C::ParameterInstanceRef(param_ref) => param_ref,
        _ => {
            return Err(Error::InvalidXtce(
                "ComparisonCheck first element must be ParameterInstanceRef".to_string(),
            ));
        }
    };

    // Resolve the left parameter reference
    let (resolved_left_ref, left_member_path) = resolve_parameter_ref(
        space_system_path,
        &left_param_ref_xml.parameter_ref,
        parameters,
    )?;

    let left = ParameterInstanceRef {
        parameter: ParameterRef {
            name: resolved_left_ref.clone(),
            member_path: left_member_path.clone(),
        },
        use_calibrated_value: left_param_ref_xml.use_calibrated_value,
    };

    let operator = match &xml.content[1] {
        C::ComparisonOperator(op) => op.clone(),
        _ => {
            return Err(Error::InvalidXtce(
                "ComparisonCheck second element must be ComparisonOperator".to_string(),
            ));
        }
    };

    let right = match &xml.content[2] {
        C::ParameterInstanceRef(param_ref) => {
            let (resolved_right_ref, right_member_path) = resolve_parameter_ref(
                space_system_path,
                &param_ref.parameter_ref,
                parameters,
            )?;
            ParameterRefOrValue::ParameterInstanceRef(ParameterInstanceRef {
                parameter: ParameterRef {
                    name: resolved_right_ref,
                    member_path: right_member_path,
                },
                use_calibrated_value: param_ref.use_calibrated_value,
            })
        }
        C::Value(val) => {
            // Parse the value based on the left parameter's type (possibly with member path)
            let left_parameter = parameters.get(&resolved_left_ref).ok_or_else(|| {
                Error::InvalidXtce(format!(
                    "Parameter '{}' referenced in comparison check not found",
                    resolved_left_ref
                ))
            })?;

            // Get the type at the end of the member path
            let comparison_type = get_member_type(left_parameter, &left_member_path)?;

            let value = crate::types::parse_value_from_string(val, comparison_type)?;
            ParameterRefOrValue::Value(value)
        }
        _ => {
            return Err(Error::InvalidXtce(
                "ComparisonCheck third element must be Value or ParameterInstanceRef".to_string(),
            ));
        }
    };

    Ok(ComparisonCheck {
        left,
        operator,
        right,
    })
}

/// Convert an ANDed condition from XTCE to BooleanExpression.
/// Each element in AnDedConditions can be either a Condition or nested ORedConditions.
fn convert_anded_condition(
    xml: &hermes_xtce::AnDedConditionsType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<BooleanExpression> {
    use hermes_xtce::AnDedConditionsType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
            space_system_path,
            parameters,
        )?)),
        X::ORedConditions(ors) => {
            let conditions = ors
                .iter()
                .map(|c| convert_ored_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::OrConditions(conditions))
        }
    }
}

/// Convert an ORed condition from XTCE to BooleanExpression.
/// Each element in ORedConditions can be either a Condition or nested AnDedConditions.
fn convert_ored_condition(
    xml: &hermes_xtce::ORedConditionsType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<BooleanExpression> {
    use hermes_xtce::ORedConditionsType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
            space_system_path,
            parameters,
        )?)),
        X::AnDedConditions(ands) => {
            let conditions = ands
                .iter()
                .map(|c| convert_anded_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::AndConditions(conditions))
        }
    }
}

fn convert_boolean_expression(
    xml: &hermes_xtce::BooleanExpressionType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<BooleanExpression> {
    use hermes_xtce::BooleanExpressionType as X;
    match xml {
        X::Condition(cond) => Ok(BooleanExpression::Condition(convert_comparison_check(
            cond,
            space_system_path,
            parameters,
        )?)),
        X::AnDedConditions(ands) => {
            let conditions = ands
                .iter()
                .map(|c| convert_anded_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::AndConditions(conditions))
        }
        X::ORedConditions(ors) => {
            let conditions = ors
                .iter()
                .map(|c| convert_ored_condition(c, space_system_path, parameters))
                .collect::<Result<Vec<_>>>()?;
            Ok(BooleanExpression::OrConditions(conditions))
        }
    }
}

fn convert_comparison(
    xml: &hermes_xtce::ComparisonType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<Comparison> {
    // Resolve the parameter reference to a fully qualified name
    let (resolved_param_ref, member_path) =
        resolve_parameter_ref(space_system_path, &xml.parameter_ref, parameters)?;

    let param_ref = ParameterInstanceRef {
        parameter: ParameterRef {
            name: resolved_param_ref.clone(),
            member_path: member_path.clone(),
        },
        use_calibrated_value: xml.use_calibrated_value,
    };

    // Look up the parameter to get its type
    let parameter = parameters.get(&resolved_param_ref).ok_or_else(|| {
        Error::InvalidXtce(format!(
            "Parameter '{}' (resolved to '{}') referenced in comparison not found",
            xml.parameter_ref, resolved_param_ref
        ))
    })?;

    // Get the type at the end of the member path
    let comparison_type = get_member_type(parameter, &member_path)?;

    // Parse the value based on the comparison type
    let value = crate::types::parse_value_from_string(&xml.value, comparison_type)?;

    Ok(Comparison {
        parameter_ref: param_ref,
        comparison_operator: xml.comparison_operator.clone(),
        value,
    })
}

/// Build SequenceContainer objects in reverse topological order (children before parents)
/// so that each parent can include references to its already-constructed children.
pub(crate) fn construct_containers(
    unresolved: HashMap<String, UnresolvedContainer>,
    sorted_names: Vec<String>,
    dependencies: HashMap<String, String>,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<HashMap<String, Rc<SequenceContainer>>> {
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
                    convert_restriction_criteria(rc, &unresolved_container.space_system_path, parameters)
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

    let mut completed: HashMap<String, Rc<SequenceContainer>> = HashMap::new();

    // Process containers in reverse topological order (children first, then parents)
    for qualified_name in sorted_names.into_iter().rev() {
        let unresolved_container = unresolved.get(&qualified_name).ok_or_else(|| {
            Error::InvalidXtce(format!(
                "Container '{}' not found in unresolved map",
                qualified_name
            ))
        })?;

        // Create the container with parameter and container reference resolution
        let mut container = SequenceContainer::new(
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

        completed.insert(qualified_name, Rc::new(container));
    }

    Ok(completed)
}

pub(crate) fn parse_i64(s: &str) -> Result<i64> {
    match s.parse() {
        Ok(f) => Ok(f),
        Err(e) => Err(Error::InvalidValue(format!("{}", e))),
    }
}

pub(crate) fn parse_u64(s: &str) -> Result<u64> {
    match s.parse() {
        Ok(f) => Ok(f),
        Err(e) => Err(Error::InvalidValue(format!("{}", e))),
    }
}

pub(crate) fn parse_float(s: &str) -> Result<f64> {
    match s.parse::<f64>() {
        Ok(f) => Ok(f),
        Err(e) => Err(Error::InvalidValue(format!("{}", e))),
    }
}

pub(crate) fn parse_boolean(s: &str) -> Result<bool> {
    match s {
        "true" => Ok(true),
        "false" => Ok(false),
        "1" => Ok(true),
        "0" => Ok(false),
        _ => Err(Error::InvalidValue(format!(
            "'{}' is not a valid boolean",
            s
        ))),
    }
}

fn hex_to_bin(b: u8) -> Result<u8> {
    match b {
        b'0'..=b'9' => Ok(b - b'0'),
        b'a'..=b'f' => Ok(b - b'a' + 10),
        b'A'..=b'F' => Ok(b - b'A' + 10),
        _ => Err(Error::InvalidValue(format!(
            "'{}' is not a valid hex number",
            b
        ))),
    }
}

pub(crate) fn parse_hex_binary(s: &str) -> Result<Vec<u8>> {
    if s.len() % 2 != 0 {
        return Err(Error::InvalidValue(
            "Hex binary string must be even length".to_string(),
        ));
    }

    let data = s.as_bytes();
    let mut out = vec![0u8; s.len() / 2];
    for (i, byte) in out.iter_mut().enumerate() {
        *byte = hex_to_bin(data[i * 2])? << 4 | hex_to_bin(data[i * 2 + 1])?;
    }

    Ok(out)
}

/// Convert IntegerValue with resolved parameter references.
/// Used during container construction when parameters are available.
pub(crate) fn convert_integer_value(
    xml: &hermes_xtce::IntegerValueType,
    space_system_path: &str,
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<crate::IntegerValue> {
    use hermes_xtce::IntegerValueType as X;

    match xml {
        X::FixedValue(val) => Ok(crate::IntegerValue::FixedValue(*val)),
        X::DynamicValue(dyn_val) => {
            // Resolve the parameter reference to fully qualified name
            let (resolved_param_ref, member_path) = resolve_parameter_ref(
                space_system_path,
                &dyn_val.parameter_instance_ref.parameter_ref,
                parameters,
            )?;

            let parameter = ParameterInstanceRef {
                parameter: ParameterRef {
                    name: resolved_param_ref,
                    member_path,
                },
                use_calibrated_value: dyn_val.parameter_instance_ref.use_calibrated_value,
            };

            let linear_adjustment =
                dyn_val
                    .linear_adjustment
                    .as_ref()
                    .map(|adj| crate::LinearAdjustment {
                        slope: adj.slope,
                        intercept: adj.intercept,
                    });

            Ok(crate::IntegerValue::DynamicValueParameter {
                ref_: parameter,
                linear_adjustment,
            })
        }
        X::DiscreteLookupList(_) => {
            Err(Error::NotImplemented("DiscreteLookupList in IntegerValue"))
        }
    }
}

/// Validate that a member path exists within an aggregate type.
/// Returns an error if the path is invalid or doesn't exist.
fn validate_member_path(
    parameter: &crate::Parameter,
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
                    member_name,
                    index,
                    full_ref
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
    parameters: &HashMap<String, Rc<crate::Parameter>>,
) -> Result<(String, Option<Vec<String>>)> {
    // First, try to resolve the entire reference as a parameter name
    // This handles hierarchical paths like "CdhCore/version/CustomVersion02"
    match resolve_reference_with_upward_search(
        space_system_path,
        param_ref,
        |name| parameters.contains_key(name),
        |_, _| Error::InvalidXtce("not found".to_string()), // Dummy error, we'll handle it below
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
        return Err(Error::InvalidXtce(
            "Empty parameter reference".to_string()
        ));
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
            |_, _| Error::InvalidXtce("not found".to_string()),
        ) {
            // Found a parameter - validate that it has an aggregate type and the member path is valid
            let parameter = parameters.get(&resolved_param_name)
                .ok_or_else(|| {
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

pub(crate) fn parse_relative_time(s: &str) -> Result<RelativeTime> {
    let mut chars = s.chars();

    macro_rules! expect {
        ($c: expr) => {
            match chars.next() {
                Some($c) => (),
                Some(c) => {
                    return Err(Error::InvalidValue(format!(
                        "Unexpected character '{}', expected '{}'",
                        c, $c
                    )))
                }
                None => return Err(Error::InvalidValue(format!("'{}' is not a valid time", s))),
            }
        };
    }

    #[derive(Default)]
    struct RelativeBuilder {
        positive: bool,
        years: u32,
        months: u32,
        days: u32,
        hours: u32,
        minutes: u32,
        seconds: f64,
    }

    let mut builder: RelativeBuilder = Default::default();

    match chars.next() {
        Some('+') => {
            builder.positive = true;
            expect!('P');
        }
        Some('-') => {
            builder.positive = false;
            expect!('P');
        }
        Some('P') => {
            builder.positive = true;
        }
        _ => {
            return Err(Error::InvalidValue("Expected relative time".to_string()));
        }
    }

    let mut buf = vec![];

    /// Clear the buffer and parse to whatever this is returning into
    macro_rules! parse {
        ($name: expr) => {
            std::mem::replace(&mut buf, vec![])
                .iter()
                .collect::<String>()
                .parse()
                .map_err(|_| Error::InvalidValue(format!("Invalid {}", $name)))?
        };
    }

    let mut parse_time = false;

    // Parse date
    for char in chars {
        match char {
            'Y' if !parse_time => {
                builder.years = parse!("years");
            }
            'M' if !parse_time => {
                builder.months = parse!("months");
            }
            'D' if !parse_time => {
                builder.days = parse!("days");
            }
            'T' if !parse_time => {
                // Make sure we processed all the numbers
                if !buf.is_empty() {
                    return Err(Error::InvalidValue(format!(
                        "Unexpected character '{}'",
                        char
                    )));
                }

                parse_time = true;
            }
            'H' if parse_time => {
                builder.hours = parse!("hours");
            }
            'M' if parse_time => {
                builder.minutes = parse!("minutes");
            }
            'S' if parse_time => {
                builder.seconds = parse!("seconds");
            }
            '0'..'9' => {
                buf.push(char);
            }
            '.' if parse_time => {
                buf.push(char);
            }
            _ => {
                return Err(Error::InvalidValue(format!(
                    "Unexpected character '{}'",
                    char
                )));
            }
        }
    }

    if !buf.is_empty() {
        return Err(Error::InvalidValue(format!(
            "Expected duration specifier after number '{}'",
            buf.into_iter().collect::<String>()
        )));
    }

    // Compute time in microseconds
    let us = ((builder.years as u64) * 365 * 24 * 3600 * 1_000_000)
        + ((builder.months as u64) * 30 * 24 * 3600 * 1_000_000)
        + ((builder.days as u64) * 24 * 3600 * 1_000_000)
        + ((builder.hours as u64) * 3600 * 1_000_000)
        + ((builder.minutes as u64) * 60 * 1_000_000)
        + ((builder.seconds * 1_000_000.0) as u64);

    if builder.positive {
        Ok(RelativeTime::Forward(Duration::from_micros(us)))
    } else {
        Ok(RelativeTime::Backward(Duration::from_micros(us)))
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    pub fn hex() {
        assert_eq!(parse_hex_binary("00").unwrap(), [0]);
        assert_eq!(parse_hex_binary("AB").unwrap(), [0xab]);
        assert_eq!(parse_hex_binary("ABab0F").unwrap(), [0xab, 0xab, 0x0f]);
    }

    #[test]
    pub fn relative_time() {
        assert_eq!(
            parse_relative_time("P10YT10S").unwrap(),
            RelativeTime::Forward(Duration::from_micros(
                10 * 365 * 24 * 3600 * 1_000_000 + 10 * 1_000_000
            ))
        );

        assert_eq!(
            parse_relative_time("PT1H3M1S").unwrap(),
            RelativeTime::Forward(Duration::from_micros(
                1 * 3600 * 1_000_000 + 3 * 60 * 1_000_000 + 1_000_000
            ))
        );

        assert_eq!(
            parse_relative_time("PT1.25S").unwrap(),
            RelativeTime::Forward(Duration::from_micros(1_000_000 + 250_000))
        );

        assert_eq!(
            parse_relative_time("-PT1.25S").unwrap(),
            RelativeTime::Backward(Duration::from_micros(1_000_000 + 250_000))
        );
    }

    #[test]
    fn test_resolve_name_reference_absolute() {
        assert_eq!(
            resolve_name_reference("/Current/Path", "/Absolute/Path/Item"),
            "/Absolute/Path/Item"
        );
    }

    #[test]
    fn test_resolve_name_reference_unqualified() {
        assert_eq!(
            resolve_name_reference("/Root/System", "Item"),
            "/Root/System/Item"
        );
        assert_eq!(resolve_name_reference("/", "Item"), "/Item");
    }

    #[test]
    fn test_resolve_name_reference_relative_current() {
        assert_eq!(
            resolve_name_reference("/Root/System", "./Item"),
            "/Root/System/Item"
        );
    }

    #[test]
    fn test_resolve_name_reference_relative_parent() {
        assert_eq!(
            resolve_name_reference("/Root/System/Sub", "../Other/Item"),
            "/Root/System/Other/Item"
        );
        assert_eq!(
            resolve_name_reference("/Root/System/Sub", "../../Item"),
            "/Root/Item"
        );
    }

    #[test]
    fn test_resolve_name_reference_mixed() {
        assert_eq!(
            resolve_name_reference("/Root/System", "Sub/Item"),
            "/Root/System/Sub/Item"
        );
        assert_eq!(
            resolve_name_reference("/Root/System", "../Other/Sub/Item"),
            "/Root/Other/Sub/Item"
        );
    }
}
