/// Common metadata for all named XTCE items
#[derive(Clone, Debug)]
pub struct NamedItem {
    /// The local name of this item
    pub name: String,
    /// The fully qualified name (e.g., "/SpaceSystem/SubSystem/ItemName")
    pub qualified_name: String,
    /// Optional short description
    pub short_description: Option<String>,
    /// Optional long description
    pub long_description: Option<String>,
}
