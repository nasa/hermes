use serde::{Deserialize, Serialize};

/// Authentication method for YAMCS connection
#[derive(Debug, Clone, Default)]
pub enum AuthMethod {
    /// No authentication
    #[default]
    None,
    /// JWT/Bearer token authentication
    AccessToken(String),
    /// Client certificate authentication
    ClientCert { cert_path: String, key_path: String },
}

/// Authentication information from YAMCS server
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AuthInfo {
    /// Whether authentication is required
    pub require_authentication: bool,
    /// Whether SPNEGO authentication is supported
    #[serde(default)]
    pub spnego: bool,
    /// OpenID Connect configuration if available
    #[serde(skip_serializing_if = "Option::is_none")]
    pub openid: Option<OpenIdConnectInfo>,
}

/// OpenID Connect authentication configuration
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct OpenIdConnectInfo {
    /// OpenID client ID
    pub client_id: String,
    /// Authorization endpoint URL
    pub authorization_endpoint: String,
    /// OAuth2 scope
    pub scope: String,
}

/// Token response from authentication endpoint
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TokenResponse {
    /// Access token
    pub access_token: String,
    /// Token type (usually "Bearer")
    pub token_type: String,
    /// Token expiration time in seconds
    pub expires_in: u64,
    /// Refresh token for obtaining new access tokens
    pub refresh_token: String,
    /// User information
    pub user: crate::types::system::UserInfo,
}
