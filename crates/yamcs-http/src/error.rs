use thiserror::Error;

/// Error types for YAMCS HTTP client operations
#[derive(Debug, Error)]
pub enum YamcsError {
    /// HTTP request failed
    #[error("HTTP request failed: {0}")]
    Http(#[from] reqwest::Error),

    /// HTTP error response from server
    #[error("HTTP error {status}: {message}")]
    HttpStatus {
        status: u16,
        message: String,
        detail: Option<serde_json::Value>,
    },

    /// Authentication failed
    #[error("Authentication failed: {0}")]
    Auth(String),

    /// WebSocket error
    #[error("WebSocket error: {0}")]
    WebSocket(String),

    /// JSON serialization/deserialization error
    #[error("Serialization error: {0}")]
    JsonSerialization(#[from] serde_json::Error),

    /// URL encoding error
    #[error("URL encoding error: {0}")]
    UrlEncoding(#[from] serde_urlencoded::ser::Error),

    /// Invalid URL provided
    #[error("Invalid URL: {0}")]
    InvalidUrl(#[from] url::ParseError),

    /// IO error
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    /// Missing required field or configuration
    #[error("Missing required field: {0}")]
    MissingField(String),
}

/// Convenient Result type alias for YAMCS operations
pub type Result<T> = std::result::Result<T, YamcsError>;
