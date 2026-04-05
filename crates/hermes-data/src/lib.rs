mod calibrator;
mod container;
mod deserialize;
mod error;
mod parameter;
mod types;
mod util;
mod bit_vec;

use error::*;

pub use calibrator::*;
pub use container::*;
pub use parameter::*;
pub use types::*;
use util::*;

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

        // Multi-pass loading to resolve all references:

        // Pass 1: Collect unresolved parameter types
        let mut unresolved_param_types = HashMap::new();
        collect_parameter_types(&root_path, schema, &mut unresolved_param_types);

        // Pass 2: Construct simple types (int, float, string, bool, enum, time)
        // Defer Binary, Array, and Aggregate types
        let (mut telemetry_parameter_types, deferred_binary, deferred_array, deferred_aggregate) =
            construct_parameter_types_pass1(unresolved_param_types)?;

        // Pass 3: Construct Aggregate types (now that simple types are available)
        construct_parameter_types_pass2_aggregates(
            deferred_aggregate,
            &mut telemetry_parameter_types,
        )?;

        // Pass 4: Collect unresolved parameters
        let mut unresolved_parameters = HashMap::new();
        collect_parameters(&root_path, schema, &mut unresolved_parameters);

        // Pass 5: Construct parameters with simple/aggregate types
        // Parameters that reference binary/array types will be deferred
        let (mut telemetry_parameters, still_unresolved_params) =
            construct_parameters(unresolved_parameters, &telemetry_parameter_types);

        // Pass 6: Construct Binary and Array types (now that parameters are available for resolution)
        construct_parameter_types_pass3_binary_array(
            deferred_binary,
            deferred_array,
            &mut telemetry_parameter_types,
            &telemetry_parameters,
        )?;

        // Pass 7: Construct remaining parameters (those that reference binary/array types)
        construct_remaining_parameters(
            still_unresolved_params,
            &telemetry_parameter_types,
            &mut telemetry_parameters,
        )?;

        // Pass 8: Collect all containers with their unresolved references
        let mut unresolved_containers = HashMap::new();
        collect_containers(&root_path, schema, &mut unresolved_containers);

        // Pass 9: Build dependency graph and topological sort
        let (sorted_names, dependencies) = build_dependency_graph(&unresolved_containers)?;

        if sorted_names.is_empty() {
            return Err(Error::InvalidXtce(
                "Mission database requires at least one telemetry container".to_string(),
            ));
        }

        let root_name = sorted_names[0].clone();

        // Pass 10: Construct containers in dependency order (all references fully resolved)
        let telemetry_containers = construct_containers(
            unresolved_containers,
            sorted_names,
            dependencies,
            &telemetry_parameters,
        )?;

        let telemetry_root = telemetry_containers.get(&root_name).unwrap();

        Ok(MissionDatabase {
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
