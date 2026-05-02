use crate::{Item, Type, Value};
use std::{collections::HashMap, sync::Arc};

/// Command argument definition from XTCE ArgumentType
#[derive(Clone, Debug)]
pub struct Argument {
    pub head: Item,
    pub type_: Arc<Type>,
    /// Optional initial value for this argument
    pub initial_value: Option<Value>,
}

/// MetaCommand definition from XTCE with full support for inheritance and constraints
#[derive(Clone, Debug)]
pub struct MetaCommand {
    pub head: Item,
    /// Abstract commands are not instantiated, only used as bases for inheritance
    pub abstract_: bool,
    /// Command arguments in order
    pub args: Vec<Arc<Argument>>,
    /// Base command for inheritance (if this command extends another)
    pub base_command: Option<Arc<MetaCommand>>,
    /// Binary encoding instructions for this command
    pub command_container: Option<Arc<CommandContainer>>,
    /// Constraints that must be satisfied before transmitting this command
    pub transmission_constraints: Vec<TransmissionConstraint>,
    /// Verification conditions to check after sending command
    pub verifiers: Vec<Verifier>,
}

/// CommandContainer defines how to encode a command into binary format
#[derive(Clone, Debug)]
pub struct CommandContainer {
    pub name: String,
    /// Base container for inheritance
    pub base_container: Option<Arc<CommandContainer>>,
    /// Ordered list of entries to encode
    pub entries: Vec<SequenceEntry>,
}

/// Entry in a command container sequence
#[derive(Clone, Debug)]
pub enum SequenceEntry {
    /// Reference to a command argument - value provided at command time
    ParameterRef(Arc<Argument>),
    /// Reference to a command argument - value provided at command time
    ArgumentRef(Arc<Argument>),
    /// Fixed value that is always encoded the same way
    FixedValue { value: Value, type_: Arc<Type> },
    /// A reference to another container with the arguments filled in
    ContainerRef {
        container: Arc<CommandContainer>,
        args: HashMap<String, Value>,
    },
}

/// Transmission constraint from XTCE
/// These must be satisfied BEFORE transmitting the command
#[derive(Clone, Debug)]
pub struct TransmissionConstraint {
    pub description: String,
    // TODO: Add structured constraint checking (parameter value checks, time windows, etc.)
}

/// Command verifier from XTCE (placeholder for now)
#[derive(Clone, Debug)]
pub struct Verifier {
    // TODO: Implement verification logic
    // This could include checking for specific events, telemetry values, etc.
}

impl MetaCommand {
    /// Collect all verifiers from this command and its inheritance chain
    /// Verifiers are collected in order: base command first, then this command's verifiers
    pub fn collect_verifiers(&self) -> Vec<Verifier> {
        let mut verifiers = Vec::new();

        // Collect from base command first (inheritance order)
        if let Some(base) = &self.base_command {
            verifiers.extend(base.collect_verifiers());
        }

        // Add this command's verifiers
        verifiers.extend(self.verifiers.iter().cloned());

        verifiers
    }

    /// Collect all transmission constraints from inheritance chain
    /// Constraints are collected in order: base command first, then this command's constraints
    pub fn collect_constraints(&self) -> Vec<TransmissionConstraint> {
        let mut constraints = Vec::new();

        // Collect from base command first
        if let Some(base) = &self.base_command {
            constraints.extend(base.collect_constraints());
        }

        // Add this command's constraints
        constraints.extend(self.transmission_constraints.iter().cloned());

        constraints
    }
}
