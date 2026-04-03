mod calibrator;
mod container;
mod error;
mod parameter;
mod types;
mod util;

use error::*;

pub use calibrator::*;
pub use container::*;
pub use types::*;
pub use parameter::*;
use util::*;

use hermes_xtce::MetaCommandType;
use std::collections::HashMap;
use std::rc::Rc;

/// Data structures that are related to uplink
struct Commands {
    pub parameter_types: HashMap<String, Rc<Type>>,
    pub parameters: HashMap<String, Rc<Parameter>>,
    pub argument_types: HashMap<String, Rc<Type>>,
    pub arguments: HashMap<String, Rc<Argument>>,
    pub commands: HashMap<String, Rc<MetaCommandType>>,
}

struct Telemetry {
    pub parameter_types: HashMap<String, Rc<Type>>,
    pub parameters: HashMap<String, Rc<Parameter>>,
    pub containers: HashMap<String, Rc<SequenceContainer>>,
}

/// The mission database is a resolved form of the XTCE definition which
/// places XTCE definitions into more favorable data structures
pub struct MissionDatabase {
    ser: Commands,
    de: Telemetry,
}

impl MissionDatabase {
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
        collect_containers(&root_path, schema, &mut unresolved_containers);

        // Build dependency graph and topological sort
        let (sorted_names, dependencies) = build_dependency_graph(&unresolved_containers)?;

        // Construct containers in dependency order
        let completed_containers =
            construct_containers(unresolved_containers, sorted_names, dependencies)?;

        // Store completed containers in the database
        out.de.containers = completed_containers;

        Ok(out)
    }

    pub fn get_parameter(&self, name: &str) -> Option<&Rc<Parameter>> {
        self.de.parameters.get(name)
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
