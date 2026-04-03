mod calibrator;
mod container;
mod error;
mod parameter;
mod types;
mod util;

pub use calibrator::*;
pub use error::*;
pub use types::*;

use hermes_xtce::{ContainerSetType, MetaCommandType};
use std::collections::HashMap;
use std::rc::Rc;

use crate::container::SequenceContainer;
use crate::util::resolve_name_reference;

/// Intermediate structure holding a container during Pass 1 before dependencies are resolved
#[derive(Clone)]
struct UnresolvedContainer {
    /// The original XTCE XML container definition
    xml: hermes_xtce::SequenceContainerType,
    /// Unresolved base container reference (may be relative/unqualified)
    base_container_ref: Option<String>,
    /// The SpaceSystem path where this container is defined (for resolving relative refs)
    space_system_path: String,
}

/// Data structures that are related to uplink
struct Commands {
    pub parameter_types: HashMap<String, Rc<hermes_xtce::ParameterTypeSetType>>,
    pub parameters: HashMap<String, Rc<hermes_xtce::ParameterType>>,
    pub argument_types: HashMap<String, Rc<hermes_xtce::ArgumentTypeSetType>>,
    pub arguments: HashMap<String, Rc<hermes_xtce::ArgumentType>>,
    pub commands: HashMap<String, Rc<MetaCommandType>>,
}

struct Telemetry {
    pub parameter_types: HashMap<String, Rc<hermes_xtce::ParameterTypeSetType>>,
    pub parameters: HashMap<String, Rc<hermes_xtce::ParameterType>>,
    pub containers: HashMap<String, Rc<SequenceContainer>>,
}

/// The mission database is a resolved form of the XTCE definition which
/// places XTCE definitions into more favorable data structures
pub struct MissionDatabase {
    ser: Commands,
    de: Telemetry,
}

impl MissionDatabase {
    /// Resolve a container reference with XTCE upward search semantics.
    ///
    /// For unqualified names, search starts in the current SpaceSystem and moves upward
    /// through parent SpaceSystems until the container is found or root is reached.
    fn resolve_container_reference(
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
    fn collect_containers(
        path: &str,
        schema: &hermes_xtce::SpaceSystem,
        unresolved: &mut HashMap<String, UnresolvedContainer>,
    ) {
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
            Self::collect_containers(&child_path, child, unresolved);
        }
    }

    /// Pass 2: Build dependency graph and resolve references
    ///
    /// Takes unresolved containers and creates a dependency graph where each container
    /// knows its parent's fully qualified name. Returns containers in topological order
    /// along with the resolved dependencies mapping.
    fn build_dependency_graph(
        unresolved: &HashMap<String, UnresolvedContainer>,
    ) -> Result<(Vec<String>, HashMap<String, String>)> {
        let mut dependencies: HashMap<String, String> = HashMap::new();

        // Resolve all container references to fully qualified names
        for (qualified_name, container) in unresolved {
            if let Some(base_ref) = &container.base_container_ref {
                // Resolve the base container reference with upward search
                let resolved_parent = Self::resolve_container_reference(
                    &container.space_system_path,
                    base_ref,
                    &unresolved,
                )?;

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

    /// Pass 3: Construct containers in topological order
    ///
    /// Build SequenceContainer objects with resolved parents by processing
    /// containers in dependency order (parents before children).
    fn construct_containers(
        unresolved: HashMap<String, UnresolvedContainer>,
        sorted_names: Vec<String>,
        dependencies: HashMap<String, String>,
    ) -> Result<HashMap<String, Rc<SequenceContainer>>> {
        let mut completed: HashMap<String, Rc<SequenceContainer>> = HashMap::new();

        // Process containers in topological order
        for qualified_name in sorted_names {
            let unresolved_container = unresolved.get(&qualified_name).unwrap();

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
                    use crate::container::convert_base_container_restriction;
                    convert_base_container_restriction(base_container)?
                } else {
                    None
                };

            // Construct the SequenceContainer
            let container = SequenceContainer::new(
                &unresolved_container.xml,
                qualified_name.clone(),
                resolved_parent,
                restriction_criteria,
            )?;

            completed.insert(qualified_name, Rc::new(container));
        }

        Ok(completed)
    }

    pub fn new(schema: &hermes_xtce::SpaceSystem) -> Result<Self> {
        let mut out = MissionDatabase {
            ser: Commands {
                parameter_types: Default::default(),
                parameters: Default::default(),
                argument_types: Default::default(),
                arguments: Default::default(),
                commands: Default::default(),
            },
            de: Telemetry {
                parameter_types: Default::default(),
                parameters: Default::default(),
                containers: Default::default(),
            },
        };

        // Collect all containers with their unresolved references
        let mut unresolved_containers = HashMap::new();
        let root_path = format!("/{}", schema.name);
        Self::collect_containers(&root_path, schema, &mut unresolved_containers);

        // Build dependency graph and topological sort
        let (sorted_names, dependencies) = Self::build_dependency_graph(&unresolved_containers)?;

        // Construct containers in dependency order
        let completed_containers =
            Self::construct_containers(unresolved_containers, sorted_names, dependencies)?;

        // Store completed containers in the database
        out.de.containers = completed_containers;

        Ok(out)
    }

    pub fn get_container(&self, name: &str) -> Option<&Rc<SequenceContainer>> {
        self.de.containers.get(name)
    }

    pub fn containers(&self) -> &HashMap<String, Rc<SequenceContainer>> {
        &self.de.containers
    }
}

#[cfg(test)]
mod tests {
    use crate::util::resolve_name_reference;

    use super::*;

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
