use crate::common::{annotation_to_metadata, parse_name, parse_type};
use crate::error::DictionaryError;
use crate::fprime::Command;
use hermes_pb::{CommandDef, Field};

/// Process a command definition into a CommandDef
pub fn process_command(command: &Command) -> Result<(String, CommandDef), DictionaryError> {
    let (component, name) = parse_name(&command.name)?;
    let key = format!("{}.{}", component, name);

    let arguments: Result<Vec<_>, DictionaryError> = command
        .formal_params
        .iter()
        .map(|param| {
            Ok::<Field, DictionaryError>(Field {
                name: param.name.clone(),
                r#type: Some(parse_type(&param.type_)?),
                metadata: annotation_to_metadata(&param.annotation),
                value: None,
            })
        })
        .collect();

    let command_def = CommandDef {
        opcode: command.opcode as i32,
        mnemonic: name,
        component,
        arguments: arguments?,
        metadata: annotation_to_metadata(&command.annotation),
    };

    Ok((key, command_def))
}
