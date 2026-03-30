#[allow(dead_code)]
mod schema;
pub use schema::xtce::*;

// Workaround for quick-xml enum deserialization limitation
// The generated RestrictionCriteriaType enum can't be deserialized when wrapped
// in a <RestrictionCriteria> element. This wrapper struct fixes that.
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct RestrictionCriteriaWrapper {
    #[serde(rename = "$value")]
    pub inner: RestrictionCriteriaType,
}

// Re-export BaseContainer with the fixed restriction_criteria field
#[derive(Debug, serde::Deserialize, serde::Serialize)]
pub struct BaseContainerFixed {
    #[serde(rename = "@containerRef")]
    pub container_ref: NameReferenceWithPathType,
    #[serde(default, rename = "RestrictionCriteria")]
    pub restriction_criteria: ::core::option::Option<RestrictionCriteriaWrapper>,
}
