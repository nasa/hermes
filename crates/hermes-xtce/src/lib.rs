#[allow(dead_code)]
mod schema;
pub use schema::xtce::*;

pub mod serde_helpers;

use std::io::BufRead;

use quick_xml::DeError;
pub use quick_xml::de::Deserializer;
use serde::Deserialize;

/// Deserialize an XTCE XML file from a string of XML text.
pub fn from_str(s: &str) -> Result<SpaceSystem, DeError> {
    let mut de = Deserializer::from_str(s);
    SpaceSystem::deserialize(&mut de)
}

/// Deserialize an XTCE File from a reader. This method will do internal copies of data
/// read from `reader`. If you want have a `&str` input and want to borrow
/// as much as possible, use [`from_str`].
pub fn from_reader<R>(reader: R) -> Result<SpaceSystem, DeError>
where
    R: BufRead,
{
    let mut de = Deserializer::from_reader(reader);
    SpaceSystem::deserialize(&mut de)
}
