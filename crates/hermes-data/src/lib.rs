mod calibrator;
mod error;
mod types;
mod parameter;
mod container;

pub use calibrator::*;
pub use error::*;
pub use types::*;

use hermes_xtce::{LocationInContainerInBitsType, MetaCommandSetType, MetaCommandType};
use std::collections::HashMap;
use std::rc::Rc;


struct SequenceEntry {
    location_in_container_in_bits_type: LocationInContainerInBitsType,
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
    pub containers: HashMap<String, Rc<hermes_xtce::SequenceContainerType>>,
}

/// The mission database is a resolved form of the XTCE definition which
/// places XTCE definitions into more favorable data structures
pub struct MissionDatabase {
    ser: Commands,
    de: Telemetry,
}

enum ResolutionRequest {
    Command {
        base_path: String,
        reference: hermes_xtce::NameReferenceWithPathType,
    },
}

impl MissionDatabase {
    fn load_space_system(
        &mut self,
        path: &str,
        schema: &hermes_xtce::SpaceSystem,
        resolution_requests: &mut Vec<ResolutionRequest>,
    ) {
        if let Some(command_metadata) = &schema.command_meta_data {
            for container_set in &command_metadata.command_container_set {
                for container in &container_set.command_container {}
            }

            for command_set in &command_metadata.meta_command_set {
                match command_set {
                    MetaCommandSetType::MetaCommand(c) => {
                        self.ser
                            .commands
                            .insert(format!("{}/{}", path, c.name), Rc::new(c.clone()));
                    }
                    // Resolve references later
                    MetaCommandSetType::MetaCommandRef(r) => {
                        resolution_requests.push(ResolutionRequest::Command {
                            base_path: path.to_string(),
                            reference: r.clone(),
                        });
                    }
                    MetaCommandSetType::BlockMetaCommand(n) => {
                        tracing::warn!(name = %n.name, "BlockMetaCommands are not supported")
                    }
                }
            }
        }
    }

    pub fn new(schema: &hermes_xtce::SpaceSystem) -> Self {
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

        // Traverse through the entire mission xtce schema
        let mut to_resolve: Vec<_> = vec![];
        out.load_space_system(&schema.name, schema, &mut to_resolve);

        out
    }

    pub fn get_container(&self, name: &str) -> &hermes_xtce::SequenceContainerType {
        self.ser.arguments.insert()
    }
}

fn decode(mdb: &MissionDatabase, data: &[u8]) {}
