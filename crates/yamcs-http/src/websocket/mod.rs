//! WebSocket client for YAMCS real-time subscriptions
//!
//! This module provides WebSocket support for subscribing to real-time data streams
//! from YAMCS, including parameter values, events, alarms, and command updates.
//!
//! **Note:** This module is only available when the `websocket` feature is enabled.
//!
//! # Example
//!
//! ```no_run
//! use yamcs_http::websocket::{WebSocketClient, ConnectionState};
//! use yamcs_http::types::monitoring::ParameterData;
//!
//! #[tokio::main]
//! async fn main() -> Result<(), Box<dyn std::error::Error>> {
//!     let ws_client = WebSocketClient::new("http://localhost:8090");
//!
//!     // Connect to WebSocket
//!     ws_client.connect().await?;
//!
//!     // Subscribe to parameters
//!     let handle = ws_client.subscribe(
//!         "parameters",
//!         serde_json::json!({
//!             "instance": "myproject",
//!             "processor": "realtime",
//!             "id": [{"name": "/MySystem/MyParameter"}]
//!         }),
//!         |data: ParameterData| {
//!             println!("Received parameter update: {:?}", data);
//!         }
//!     ).await?;
//!
//!     // Keep subscription active...
//!     tokio::time::sleep(tokio::time::Duration::from_secs(10)).await;
//!
//!     // Cancel subscription
//!     ws_client.cancel_subscription(handle).await?;
//!
//!     Ok(())
//! }
//! ```

pub mod client;
pub mod subscription;

pub use client::{ClientMessage, ConnectionState, ServerMessage, WebSocketClient};
pub use subscription::SubscriptionHandle;
