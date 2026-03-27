//! # yamcs-http
//!
//! Rust client library for the YAMCS (Yet Another Mission Control System) HTTP/REST API.
//!
//! This crate provides a complete client implementation for interacting with YAMCS servers,
//! including support for:
//!
//! - Mission Database (MDB) queries
//! - Real-time telemetry and commanding
//! - Event and alarm management
//! - WebSocket subscriptions (with `websocket` feature)
//! - Multiple authentication methods (JWT, client certificates)
//!
//! ## Quick Start
//!
//! ```no_run
//! use yamcs_http::{YamcsClient, AuthMethod};
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     // Create a client without authentication
//!     let client = YamcsClient::new("http://localhost:8090")?;
//!
//!     // Get server information
//!     let info = client.get_general_info().await?;
//!     println!("YAMCS version: {}", info.yamcs_version);
//!
//!     // Get authenticated user info (requires auth)
//!     let client_with_auth = YamcsClient::with_auth(
//!         "http://localhost:8090",
//!         AuthMethod::AccessToken("your-token".to_string())
//!     )?;
//!     let user = client_with_auth.get_user_info().await?;
//!     println!("Logged in as: {}", user.name);
//!
//!     Ok(())
//! }
//! ```
//!
//! ## Features
//!
//! - `websocket`: Enable WebSocket support for real-time subscriptions
//!
//! ## Architecture
//!
//! The crate is organized into several modules:
//!
//! - [`client`]: Main YAMCS client implementation
//! - [`auth`]: Authentication types and methods
//! - [`http`]: HTTP client infrastructure
//! - [`error`]: Error types
//! - [`types`]: Type definitions for YAMCS API objects
//!
//! ## Authentication
//!
//! YAMCS supports multiple authentication methods:
//!
//! ```no_run
//! use yamcs_http::{YamcsClient, AuthMethod};
//!
//! // No authentication
//! let client = YamcsClient::new("http://localhost:8090")?;
//!
//! // JWT/Bearer token authentication
//! let client = YamcsClient::with_auth(
//!     "http://localhost:8090",
//!     AuthMethod::AccessToken("token".to_string())
//! )?;
//!
//! // Client certificate authentication
//! let client = YamcsClient::with_auth(
//!     "https://localhost:8090",
//!     AuthMethod::ClientCert {
//!         cert_path: "/path/to/cert.pem".to_string(),
//!         key_path: "/path/to/key.pem".to_string(),
//!     }
//! )?;
//! # Ok::<(), yamcs_http::YamcsError>(())
//! ```

pub mod auth;
pub mod client;
pub mod error;
pub mod http;
pub mod types;

#[cfg(feature = "websocket")]
pub mod websocket;

// Re-export main types for convenient access
pub use auth::{AuthInfo, AuthMethod};
pub use client::YamcsClient;
pub use error::{Result, YamcsError};

// Re-export common types
pub use types::common::{AggregateValue, MonitoringResult, NamedObjectId, Value};
pub use types::system::{
    GeneralInfo, GroupInfo, Instance, InstanceState, PluginInfo, Processor, ServiceState,
    SystemInfo, UserInfo,
};
