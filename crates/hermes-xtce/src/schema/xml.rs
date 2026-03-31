use serde::{Deserialize, Serialize};
pub type Base = super::xs::AnyUriType;
pub type Lang = super::xs::LanguageType;
#[derive(Debug, Deserialize, Serialize)]
pub enum Space {
    #[serde(rename = "default")]
    Default,
    #[serde(rename = "preserve")]
    Preserve,
}
