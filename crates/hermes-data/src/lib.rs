mod calibrator;
mod command;
pub mod de;
mod error;
mod framing;
mod item;
pub mod ser;
mod types;
mod util;
mod xtce;

pub use calibrator::*;
pub use command::*;
pub use error::{Error, Result};
pub use framing::*;
pub use item::*;
pub use types::*;

use std::collections::HashMap;
use std::sync::Arc;

/// The mission database is a resolved form of the XTCE definition which
/// places XTCE definitions into more favorable data structures
pub struct MissionDatabase {
    // Telemetry (downlink)
    telemetry_root: Arc<de::SequenceContainerType>,
    telemetry_parameter_types: HashMap<String, Arc<Type>>,
    telemetry_parameters: HashMap<String, Arc<Parameter>>,
    telemetry_containers: HashMap<String, Arc<de::SequenceContainerType>>,

    // Commanding (uplink)
    command_argument_types: HashMap<String, Arc<Type>>,
    command_arguments: HashMap<String, Arc<Argument>>,
    commands: HashMap<String, Arc<MetaCommand>>,
}

// Compile-time checks to ensure MissionDatabase is thread-safe
const _: () = {
    const fn assert_send<T: Send>() {}
    const fn assert_sync<T: Sync>() {}
    let _ = assert_send::<MissionDatabase>;
    let _ = assert_sync::<MissionDatabase>;
};

impl MissionDatabase {
    pub fn new_from_xtce_str(xtce: &str) -> Result<Self> {
        let schema = match hermes_xtce::from_str(xtce) {
            Ok(schema) => schema,
            Err(err) => return Err(Error::InvalidXtce(format!("Failed to parse XTCE: {}", err))),
        };

        Self::new(&schema)
    }

    pub fn new(schema: &hermes_xtce::SpaceSystem) -> Result<Self> {
        let root_path = format!("/{}", schema.name);

        // Collect unresolved parameter types
        let mut unresolved_param_types = HashMap::new();
        xtce::collect_parameter_types(&root_path, schema, &mut unresolved_param_types);

        // Construct simple types (int, float, string, bool, enum, time)
        // Defer Binary, Array, and Aggregate types
        let (mut telemetry_parameter_types, deferred_binary, deferred_array, deferred_aggregate) =
            xtce::construct_parameter_types_pass1(unresolved_param_types)?;

        // Construct Aggregate types (now that simple types are available)
        xtce::construct_parameter_types_pass2_aggregates(
            deferred_aggregate,
            &mut telemetry_parameter_types,
        )?;

        // Collect unresolved parameters
        let mut unresolved_parameters = HashMap::new();
        xtce::collect_parameters(&root_path, schema, &mut unresolved_parameters);

        // Construct parameters with simple/aggregate types
        // Parameters that reference binary/array types will be deferred
        let (mut telemetry_parameters, still_unresolved_params) =
            xtce::construct_parameters(unresolved_parameters, &telemetry_parameter_types);

        // Construct Binary and Array types (now that parameters are available for resolution)
        xtce::construct_parameter_types_pass3_binary_array(
            deferred_binary,
            deferred_array,
            &mut telemetry_parameter_types,
            &telemetry_parameters,
        )?;

        // Construct remaining parameters (those that reference binary/array types)
        xtce::construct_remaining_parameters(
            still_unresolved_params,
            &telemetry_parameter_types,
            &mut telemetry_parameters,
        )?;

        // Collect all containers with their unresolved references
        let mut unresolved_containers = HashMap::new();
        xtce::collect_containers(&root_path, schema, &mut unresolved_containers);

        // Build dependency graph and topological sort
        let (sorted_names, dependencies) = xtce::build_dependency_graph(&unresolved_containers)?;

        if sorted_names.is_empty() {
            return Err(Error::InvalidXtce(
                "Mission database requires at least one telemetry container".to_string(),
            ));
        }

        let root_name = sorted_names[0].clone();

        // Construct containers in dependency order (all references fully resolved)
        let telemetry_containers = xtce::construct_containers(
            unresolved_containers,
            sorted_names,
            dependencies,
            &telemetry_parameters,
        )?;

        let telemetry_root = telemetry_containers.get(&root_name).unwrap();

        // Collect argument types
        let mut unresolved_arg_types = HashMap::new();
        xtce::collect_argument_types(&root_path, schema, &mut unresolved_arg_types);

        // Construct argument types
        let command_argument_types = xtce::construct_argument_types(unresolved_arg_types)?;

        // Collect meta commands
        let mut unresolved_commands = HashMap::new();
        xtce::collect_meta_commands(&root_path, schema, &mut unresolved_commands);

        // Construct arguments from commands
        let command_arguments =
            xtce::construct_arguments(&unresolved_commands, &command_argument_types)?;

        // Construct commands with inheritance
        let commands = xtce::construct_meta_commands(unresolved_commands, &command_arguments)?;

        Ok(MissionDatabase {
            telemetry_root: telemetry_root.clone(),
            telemetry_parameter_types,
            telemetry_parameters,
            telemetry_containers,
            command_argument_types,
            command_arguments,
            commands,
        })
    }

    pub fn telemetry_root(&self) -> &Arc<de::SequenceContainerType> {
        &self.telemetry_root
    }

    pub fn get_telemetry(&self, name: &str) -> Option<&Arc<Parameter>> {
        self.telemetry_parameters.get(name)
    }

    pub fn all_telemetry(&self) -> &HashMap<String, Arc<Parameter>> {
        &self.telemetry_parameters
    }

    pub fn get_telemetry_parameter_type(&self, name: &str) -> Option<&Arc<Type>> {
        self.telemetry_parameter_types.get(name)
    }

    pub fn all_telemetry_parameter_types(&self) -> &HashMap<String, Arc<Type>> {
        &self.telemetry_parameter_types
    }

    pub fn get_telemetry_container(&self, name: &str) -> Option<&Arc<de::SequenceContainerType>> {
        self.telemetry_containers.get(name)
    }

    pub fn all_telemetry_containers(&self) -> &HashMap<String, Arc<de::SequenceContainerType>> {
        &self.telemetry_containers
    }

    pub fn get_command(&self, name: &str) -> Option<&Arc<MetaCommand>> {
        self.commands.get(name)
    }

    pub fn all_commands(&self) -> &HashMap<String, Arc<MetaCommand>> {
        &self.commands
    }

    pub fn get_command_argument(&self, name: &str) -> Option<&Arc<Argument>> {
        self.command_arguments.get(name)
    }

    pub fn all_command_arguments(&self) -> &HashMap<String, Arc<Argument>> {
        &self.command_arguments
    }

    pub fn get_command_argument_type(&self, name: &str) -> Option<&Arc<Type>> {
        self.command_argument_types.get(name)
    }

    pub fn all_command_argument_types(&self) -> &HashMap<String, Arc<Type>> {
        &self.command_argument_types
    }
}
