use serde::Deserialize;
pub type Base = super::xs::AnyUriType;
pub type Lang = super::xs::LanguageType;
#[derive(Debug, Deserialize)]
pub enum Space {
    #[serde(rename = "default")]
    Default,
    #[serde(rename = "preserve")]
    Preserve,
}
