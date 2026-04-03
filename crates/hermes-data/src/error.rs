use thiserror::Error;

/// Result type alias for hermes-data operations
pub type Result<T> = std::result::Result<T, Error>;

/// Error types for hermes-data operations
#[derive(Error, Debug)]
pub enum Error {
    #[error("Invalid spline calibrator: {0}")]
    InvalidSpline(String),

    #[error("Invalid polynomial calibrator: {0}")]
    InvalidPolynomial(String),

    #[error("Math operation error: {0}")]
    MathOperation(String),

    #[error("Calibration error: {0}")]
    Calibration(String),

    #[error("Parameter not found: {0}")]
    ParameterNotFound(String),

    #[error("Container not found: {0}")]
    ContainerNotFound(String),

    #[error("Invalid XTCE definition: {0}")]
    InvalidXtce(String),

    #[error("Invalid value: {0}")]
    InvalidValue(String),

    #[error("Operation Not Implemented: {0}")]
    NotImplemented(&'static str),
}
