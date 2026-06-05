use crate::common::{annotation_to_metadata, parse_name, parse_type};
use crate::error::DictionaryError;
use crate::fprime::TelemetryChannel;
use hermes_pb::TelemetryDef;

/// Process a telemetry channel definition into a TelemetryDef
pub fn process_telemetry_channel(
    channel: &TelemetryChannel,
) -> Result<(String, TelemetryDef), DictionaryError> {
    let (component, name) = parse_name(&channel.name)?;
    let key = format!("{}.{}", component, name);

    let telemetry_def = TelemetryDef {
        id: channel.id as i32,
        name,
        component,
        r#type: Some(parse_type(&channel.type_)?),
        metadata: annotation_to_metadata(&channel.annotation),
    };

    Ok((key, telemetry_def))
}
