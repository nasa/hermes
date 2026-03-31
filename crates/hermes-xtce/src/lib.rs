#[allow(dead_code)]
mod schema;
pub use schema::xtce::*;

use std::io::BufRead;

pub use quick_xml::de::Deserializer;
use quick_xml::se::{Serializer, WriteResult};
use quick_xml::{DeError, SeError};
use serde::{Deserialize, Serialize};

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

/// Serialize an XTCE SpaceSystem to a string of XML text.
pub fn to_string(space_system: &SpaceSystem) -> Result<String, SeError> {
    let mut buffer = "<?xml version='1.0' encoding='utf-8'?>\n".to_string();
    let ser = Serializer::new(&mut buffer);
    Root::new(space_system).serialize(ser)?;
    Ok(buffer)
}

/// Serialize an XTCE SpaceSystem to a string of XML text with pretty printing.
///
/// Uses two spaces for indentation and includes a newline at the end.
pub fn to_string_pretty(space_system: &SpaceSystem) -> Result<String, SeError> {
    let mut buffer = "<?xml version='1.0' encoding='utf-8'?>\n".to_string();
    let mut ser = Serializer::new(&mut buffer);
    ser.indent(' ', 2);
    Root::new(space_system).serialize(ser)?;
    Ok(buffer)
}

#[derive(Debug, Serialize)]
#[serde(rename = "SpaceSystem")]
struct Root<'a> {
    #[serde(rename = "@xmlns")]
    xmlns: String,
    #[serde(rename = "@xmlns:xsi")]
    xmlns_xsi: String,
    #[serde(rename = "@xsi:schemaLocation")]
    xsi_schema_location: String,

    #[serde(default, rename = "@shortDescription")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub short_description: &'a ::core::option::Option<ShortDescriptionType>,
    #[serde(rename = "@name")]
    pub name: &'a NameType,
    #[serde(default = "SpaceSystemType::default_system_type", rename = "@systemType")]
    pub system_type: &'a SystemTypeType,
    #[serde(default = "SpaceSystemType::default_asset_type", rename = "@assetType")]
    pub asset_type: &'a crate::schema::xs::StringType,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@operationalStatus")]
    pub operational_status: &'a ::core::option::Option<crate::schema::xs::TokenType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "@base")]
    pub base: &'a ::core::option::Option<crate::schema::xml::Base>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "LongDescription")]
    pub long_description: &'a ::core::option::Option<LongDescriptionType>,
    #[serde(default, rename = "AliasSet")]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alias_set: &'a ::core::option::Option<AliasSetType>,
    #[serde(default, rename = "AncillaryDataSet")]
    pub ancillary_data_set: &'a ::core::option::Option<AncillaryDataSetType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "Header")]
    pub header: &'a ::core::option::Option<HeaderType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "TelemetryMetaData")]
    pub telemetry_meta_data: &'a ::core::option::Option<TelemetryMetaDataType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "CommandMetaData")]
    pub command_meta_data: &'a ::core::option::Option<CommandMetaDataType>,
    #[serde(skip_serializing_if = "Option::is_none")]
    #[serde(default, rename = "ServiceSet")]
    pub service_set: &'a ::core::option::Option<ServiceSetType>,
    #[serde(default, rename = "SpaceSystem")]
    pub space_system: &'a ::std::vec::Vec<SpaceSystem>,
}

impl<'a> Root<'a> {
    pub(crate) fn new(root: &'_ SpaceSystem) -> Root<'_> {
        Root {
            xmlns: "http://www.omg.org/spec/XTCE/20180204".to_string(),
            xmlns_xsi: "http://www.w3.org/2001/XMLSchema-instance".to_string(),
            xsi_schema_location: "http://www.omg.org/spec/XTCE/20180204 https://www.omg.org/spec/XTCE/20180204/SpaceSystem.xsd".to_string(),

            short_description: &root.short_description,
            name: &root.name,
            system_type: &root.system_type,
            asset_type: &root.asset_type,
            operational_status: &root.operational_status,
            base: &root.base,
            long_description: &root.long_description,
            alias_set: &root.alias_set,
            ancillary_data_set: &root.ancillary_data_set,
            header: &root.header,
            telemetry_meta_data: &root.telemetry_meta_data,
            command_meta_data: &root.command_meta_data,
            service_set: &root.service_set,
            space_system: &root.space_system,
        }
    }
}

/// Serialize an XTCE SpaceSystem to a writer that implements std::fmt::Write.
pub fn to_writer<W>(mut writer: W, value: &SpaceSystem) -> Result<WriteResult, SeError>
where
    W: std::fmt::Write,
{
    writer.write_str("<?xml version='1.0' encoding='utf-8'?>\n")?;
    let root = Root::new(value);
    root.serialize(Serializer::new(&mut writer))
}

/// Serialize an XTCE SpaceSystem to a writer that implements std::io::Write.
pub fn to_utf8_io_writer<W>(mut writer: W, value: &SpaceSystem) -> Result<WriteResult, SeError>
where
    W: std::io::Write,
{
    writer.write("<?xml version='1.0' encoding='utf-8'?>\n".as_bytes())?;
    let root = Root::new(value);
    quick_xml::se::to_utf8_io_writer(&mut writer, &root)
}
