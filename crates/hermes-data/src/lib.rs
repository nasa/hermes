mod calibrator;
mod container;
mod error;
mod parameter;
mod types;
mod util;

use error::*;

pub use calibrator::*;
pub use container::*;
pub use parameter::*;
pub use types::*;
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

        let root_path = format!("/{}", schema.name);

        // Load parameter types
        let mut unresolved_param_types = HashMap::new();
        collect_parameter_types(&root_path, schema, &mut unresolved_param_types);
        let parameter_types = construct_parameter_types(unresolved_param_types)?;

        // Load parameters
        let mut unresolved_parameters = HashMap::new();
        collect_parameters(&root_path, schema, &mut unresolved_parameters);
        let parameters = construct_parameters(unresolved_parameters, &parameter_types)?;

        // Store parameter types and parameters in the database
        out.de.parameter_types = parameter_types;
        out.de.parameters = parameters;

        // Collect all containers with their unresolved references
        let mut unresolved_containers = HashMap::new();
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

    pub fn get_parameter_type(&self, name: &str) -> Option<&Rc<Type>> {
        self.de.parameter_types.get(name)
    }

    pub fn parameters(&self) -> &HashMap<String, Rc<Parameter>> {
        &self.de.parameters
    }

    pub fn parameter_types(&self) -> &HashMap<String, Rc<Type>> {
        &self.de.parameter_types
    }

    pub fn get_container(&self, name: &str) -> Option<&Rc<SequenceContainer>> {
        self.de.containers.get(name)
    }

    pub fn containers(&self) -> &HashMap<String, Rc<SequenceContainer>> {
        &self.de.containers
    }
}
