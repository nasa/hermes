use crate::{command::CommandContainer, command::SequenceEntry, Error, Result, Value};
use std::collections::HashMap;
use std::sync::Arc;

use super::{SerializationContext, Serializer};

/// Command container serializer that encodes commands according to XTCE CommandContainer definitions
pub struct CommandContainerSerializer {
    pub container: Arc<CommandContainer>,
}

impl CommandContainerSerializer {
    /// Create a new command container serializer
    pub fn new(container: Arc<CommandContainer>) -> Self {
        CommandContainerSerializer { container }
    }

    /// Serialize a command with the given argument values
    pub fn serialize(&self, arguments: &HashMap<String, Value>) -> Result<Vec<u8>> {
        let mut serializer = Serializer::new();
        let _context = SerializationContext::from_arguments(arguments.clone());

        // If this container has a base container, serialize that first (inheritance)
        if let Some(base) = &self.container.base_container {
            let base_serializer = CommandContainerSerializer::new(base.clone());
            let base_bytes = base_serializer.serialize(arguments)?;
            serializer.write_bytes(&base_bytes)?;
        }

        // Serialize entries in order
        for entry in &self.container.entries {
            match entry {
                SequenceEntry::ArgumentRef { argument } => {
                    // Look up the argument value
                    let value = arguments
                        .get(&argument.head.qualified_name)
                        .ok_or_else(|| {
                            Error::InvalidValue(format!(
                                "Missing argument '{}'",
                                argument.head.qualified_name
                            ))
                        })?;

                    // Serialize the argument value according to its type
                    serializer.serialize_value(&argument.type_, value)?;
                }
                SequenceEntry::FixedValue { value, type_ } => {
                    // Serialize the fixed value
                    serializer.serialize_value(type_, value)?;
                }
            }
        }

        Ok(serializer.into_bytes())
    }

    /// Serialize a command, validating all arguments before serialization
    pub fn serialize_validated(&self, arguments: &HashMap<String, Value>) -> Result<Vec<u8>> {
        // First validate all arguments
        for entry in &self.container.entries {
            if let SequenceEntry::ArgumentRef { argument } = entry {
                let value = arguments
                    .get(&argument.head.qualified_name)
                    .ok_or_else(|| {
                        Error::InvalidValue(format!(
                            "Missing argument '{}'",
                            argument.head.qualified_name
                        ))
                    })?;

                // Validate the value against its type
                value.validate(&argument.type_)?;
            }
        }

        // If validation passes, serialize
        self.serialize(arguments)
    }
}
