use crate::Type;
use crate::container::Item;
use std::rc::Rc;

#[derive(Clone, Debug)]
pub struct Parameter {
    pub head: Item,
    /// Data type of this parameter
    pub type_: Rc<Type>,
    ///Describes extended properties/attributes of Parameter definitions.
    pub properties: Option<hermes_xtce::ParameterPropertiesType>,
}

#[derive(Clone, Debug)]
pub struct Argument {
    pub head: Item,
    pub type_: Rc<Type>,
}
