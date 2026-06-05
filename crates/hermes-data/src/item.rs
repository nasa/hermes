use crate::Type;
use std::sync::Arc;

#[derive(Clone, Debug)]
pub struct Item {
    /// The local name of this item
    pub name: String,
    /// The fully qualified name (e.g., "/SpaceSystem/SubSystem/ItemName")
    pub qualified_name: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Optional long description
    pub long_description: Option<String>,
    ///Use for any non-standard data associated with this named item.  See AncillaryDataSetType for additional explanation.
    pub ancillary_data_set: Option<hermes_xtce::AncillaryDataSetType>,
}

#[derive(Clone, Debug)]
pub struct Parameter {
    pub head: Item,
    /// Data type of this parameter
    pub type_: Arc<Type>,
    ///Describes extended properties/attributes of Parameter definitions.
    pub properties: Option<hermes_xtce::ParameterPropertiesType>,
}
