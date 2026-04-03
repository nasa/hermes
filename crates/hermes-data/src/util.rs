use crate::container::SequenceContainer;
use crate::{Error, RelativeTime, Result};
use std::collections::HashMap;
use std::rc::Rc;
use std::time::Duration;

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
        if current_path.is_empty() || current_path == "/" {
            format!("/{}", name_ref)
        } else {
            format!("{}/{}", current_path, name_ref)
        }
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

/// Resolve a container reference with XTCE upward search semantics.
///
/// For unqualified names, search starts in the current SpaceSystem and moves upward
/// through parent SpaceSystems until the container is found or root is reached.
pub(crate) fn resolve_container_reference(
    current_path: &str,
    name_ref: &str,
    unresolved: &HashMap<String, UnresolvedContainer>,
) -> Result<String> {
    // If it's an absolute or relative path with /, use standard resolution
    if name_ref.starts_with('/') || name_ref.contains('/') {
        let resolved = resolve_name_reference(current_path, name_ref);
        if unresolved.contains_key(&resolved) {
            return Ok(resolved);
        }
        return Err(Error::ContainerNotFound(format!(
            "Container reference '{}' resolved to '{}' but not found",
            name_ref, resolved
        )));
    }

    // Unqualified name - search upward through SpaceSystem hierarchy
    let mut search_path = current_path.to_string();
    loop {
        let candidate = if search_path.is_empty() || search_path == "/" {
            format!("/{}", name_ref)
        } else {
            format!("{}/{}", search_path, name_ref)
        };

        if unresolved.contains_key(&candidate) {
            return Ok(candidate);
        }

        // Move up one level
        if search_path.is_empty() || search_path == "/" {
            // Reached root without finding the container
            return Err(Error::ContainerNotFound(format!(
                "Container '{}' not found in '{}' or any parent SpaceSystem",
                name_ref, current_path
            )));
        }

        // Remove the last path component
        if let Some(idx) = search_path.rfind('/') {
            search_path = if idx == 0 {
                "/".to_string()
            } else {
                search_path[..idx].to_string()
            };
        } else {
            search_path = String::new();
        }
    }
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
                    let qualified_name = if path.is_empty() || path == "/" {
                        format!("/{}", container.name)
                    } else {
                        format!("{}/{}", path, container.name)
                    };

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
        let child_path = if path.is_empty() || path == "/" {
            format!("/{}", child.name)
        } else {
            format!("{}/{}", path, child.name)
        };
        collect_containers(&child_path, child, unresolved);
    }
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

/// Build SequenceContainer objects with resolved parents by processing
/// containers in dependency order (parents before children).
pub(crate) fn construct_containers(
    mut unresolved: HashMap<String, UnresolvedContainer>,
    sorted_names: Vec<String>,
    dependencies: HashMap<String, String>,
) -> Result<HashMap<String, Rc<SequenceContainer>>> {
    use crate::container::convert_base_container_restriction;

    let mut completed: HashMap<String, Rc<SequenceContainer>> = HashMap::new();

    // Process containers in topological order
    for qualified_name in sorted_names {
        let unresolved_container = unresolved.remove(&qualified_name).unwrap();

        // Look up resolved parent if this container has one
        let resolved_parent = if let Some(parent_name) = dependencies.get(&qualified_name) {
            Some(
                completed
                    .get(parent_name)
                    .ok_or_else(|| {
                        Error::InvalidXtce(format!(
                            "Parent '{}' not yet constructed when building '{}'",
                            parent_name, qualified_name
                        ))
                    })?
                    .clone(),
            )
        } else {
            None
        };

        // Extract restriction criteria if present
        let restriction_criteria =
            if let Some(base_container) = &unresolved_container.xml.base_container {
                convert_base_container_restriction(base_container)?
            } else {
                None
            };

        // Construct the SequenceContainer
        let container = SequenceContainer::new(
            unresolved_container.xml,
            qualified_name.clone(),
            resolved_parent,
            restriction_criteria,
        )?;

        completed.insert(qualified_name, Rc::new(container));
    }

    assert_eq!(unresolved.len(), 0);
    Ok(completed)
}

pub(crate) fn parse_integer(s: &str) -> Result<i64> {
    match s.parse::<i64>() {
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
