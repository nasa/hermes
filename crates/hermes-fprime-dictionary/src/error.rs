use thiserror::Error;

#[derive(Error, Debug)]
pub enum DictionaryError {
    #[error("Invalid integer size: {0} (must be 8, 16, 32, or 64)")]
    InvalidIntegerSize(i32),

    #[error("Invalid float size: {0} (must be 32 or 64)")]
    InvalidFloatSize(i32),

    #[error("Invalid EVR severity: {0}")]
    InvalidSeverity(String),

    #[error("Expected name to have dot-separated identifiers: {0}")]
    InvalidName(String),

    #[error("Enums must be encoded as an integer type, not {0}")]
    InvalidEnumEncodeType(String),

    #[error("No telemetry with name '{0}'")]
    TelemetryNotFound(String),

    #[error("Expected numeric value for 'ComCfg.SpacecraftId', got {0}")]
    InvalidSpacecraftId(String),

    #[error("Invalid format specifier: {0}")]
    InvalidFormatSpecifier(String),

    #[error("Argument count mismatch: expected {expected}, found {found} format specifiers")]
    ArgumentCountMismatch { expected: usize, found: usize },

    #[error("Unclosed format specifier at position {0}")]
    UnclosedFormatSpecifier(usize),

    #[error("JSON parse error: {0}")]
    JsonError(#[from] serde_json::Error),
}
