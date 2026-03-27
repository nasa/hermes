use crate::common::{annotation_to_metadata, parse_name, parse_type};
use crate::error::DictionaryError;
use crate::fprime::Parameter;
use hermes_pb::ParameterDef;

/// Process a parameter definition into a ParameterDef
pub fn process_parameter(param: &Parameter) -> Result<(String, ParameterDef), DictionaryError> {
    let (component, name) = parse_name(&param.name)?;
    let key = format!("{}.{}", component, name);

    let metadata = if let Some(default) = &param.default {
        serde_json::json!({
            "description": param.annotation.as_ref().unwrap_or(&String::new()),
            "default": serde_json::to_string(default).unwrap_or_default()
        })
        .to_string()
    } else {
        annotation_to_metadata(&param.annotation)
    };

    let param_def = ParameterDef {
        id: param.id as i32,
        component,
        name,
        r#type: Some(parse_type(&param.type_)?),
        metadata,
    };

    Ok((key, param_def))
}
