use crate::container::Item;
use crate::Type;
use std::sync::Arc;

#[derive(Clone, Debug)]
pub struct Parameter {
    pub head: Item,
    /// Data type of this parameter
    pub type_: Arc<Type>,
    ///Describes extended properties/attributes of Parameter definitions.
    pub properties: Option<hermes_xtce::ParameterPropertiesType>,
}

#[derive(Clone, Debug)]
pub struct Argument {
    pub head: Item,
    pub type_: Arc<Type>,
}
