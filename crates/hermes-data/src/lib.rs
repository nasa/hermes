mod calibrator;
mod container;
mod deserialize;
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

use crate::error::Error::InvalidXtce;
use std::collections::HashMap;
use std::rc::Rc;

/// The mission database is a resolved form of the XTCE definition which
/// places XTCE definitions into more favorable data structures
pub struct MissionDatabase {
    // command_parameter_types: HashMap<String, Rc<Type>>,
    // command_parameters: HashMap<String, Rc<Parameter>>,
    // command_argument_types: HashMap<String, Rc<Type>>,
    // command_arguments: HashMap<String, Rc<Argument>>,
    // command_containers: HashMap<String, Rc<SequenceContainer>>,
    // commands: HashMap<String, Rc<MetaCommandType>>,
    telemetry_root: Rc<SequenceContainer>,
    telemetry_parameter_types: HashMap<String, Rc<Type>>,
    telemetry_parameters: HashMap<String, Rc<Parameter>>,
    telemetry_containers: HashMap<String, Rc<SequenceContainer>>,
}

impl MissionDatabase {
    pub fn new(schema: &hermes_xtce::SpaceSystem) -> Result<Self> {
        let root_path = format!("/{}", schema.name);

        // Load parameter types
        let mut unresolved_param_types = HashMap::new();
        collect_parameter_types(&root_path, schema, &mut unresolved_param_types);
        let telemetry_parameter_types = construct_parameter_types(unresolved_param_types)?;

        // Load parameters
        let mut unresolved_parameters = HashMap::new();
        collect_parameters(&root_path, schema, &mut unresolved_parameters);
        let telemetry_parameters =
            construct_parameters(unresolved_parameters, &telemetry_parameter_types)?;

        // Collect all containers with their unresolved references
        let mut unresolved_containers = HashMap::new();
        collect_containers(&root_path, schema, &mut unresolved_containers);

        // Build dependency graph and topological sort
        let (sorted_names, dependencies) = build_dependency_graph(&unresolved_containers)?;

        if sorted_names.is_empty() {
            return Err(InvalidXtce(
                "Mission database requires at least one telemetry container".to_string(),
            ));
        }

        let root_name = sorted_names[0].clone();

        // Construct containers in dependency order
        let telemetry_containers =
            construct_containers(unresolved_containers, sorted_names, dependencies)?;

        let telemetry_root = telemetry_containers.get(&root_name).unwrap();

        Ok(MissionDatabase {
            // command_parameter_types: Default::default(),
            // command_parameters: Default::default(),
            // command_argument_types: Default::default(),
            // command_arguments: Default::default(),
            // command_containers: Default::default(),
            // commands: Default::default(),
            telemetry_root: telemetry_root.clone(),
            telemetry_parameter_types,
            telemetry_parameters,
            telemetry_containers,
        })
    }

    pub fn telemetry_root(&self) -> &Rc<SequenceContainer> {
        &self.telemetry_root
    }

    pub fn get_telemetry(&self, name: &str) -> Option<&Rc<Parameter>> {
        self.telemetry_parameters.get(name)
    }

    pub fn all_telemetry(&self) -> &HashMap<String, Rc<Parameter>> {
        &self.telemetry_parameters
    }

    pub fn get_telemetry_parameter_type(&self, name: &str) -> Option<&Rc<Type>> {
        self.telemetry_parameter_types.get(name)
    }

    pub fn all_telemetry_parameter_types(&self) -> &HashMap<String, Rc<Type>> {
        &self.telemetry_parameter_types
    }

    pub fn get_telemetry_container(&self, name: &str) -> Option<&Rc<SequenceContainer>> {
        self.telemetry_containers.get(name)
    }

    pub fn all_telemetry_containers(&self) -> &HashMap<String, Rc<SequenceContainer>> {
        &self.telemetry_containers
    }
}
