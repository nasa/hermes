use crate::error::{Result, YamcsError};
use crate::websocket::subscription::{Subscription, SubscriptionHandle};
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::{Mutex, RwLock, mpsc};
use tokio_tungstenite::{connect_async, tungstenite::Message};
use url::Url;

/// Client message sent to YAMCS WebSocket
#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct ClientMessage {
    #[serde(rename = "type")]
    pub message_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub call: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub low_priority: Option<bool>,
    pub options: serde_json::Value,
}

/// Server message received from YAMCS WebSocket
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ServerMessage {
    #[serde(rename = "type")]
    pub message_type: String,
    pub call: u32,
    pub seq: u32,
    pub data: serde_json::Value,
}

/// WebSocket connection state
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ConnectionState {
    Disconnected,
    Connecting,
    Connected,
    Reconnecting,
}

/// WebSocket client for YAMCS real-time subscriptions
pub struct WebSocketClient {
    base_url: String,
    state: Arc<RwLock<ConnectionState>>,
    subscriptions: Arc<Mutex<HashMap<u32, Subscription>>>,
    request_sequence: Arc<Mutex<u32>>,
    tx: Arc<Mutex<Option<mpsc::UnboundedSender<ClientMessage>>>>,
    frame_loss_callback: Arc<Mutex<Option<Box<dyn Fn() + Send + Sync>>>>,
}

impl WebSocketClient {
    /// Create a new WebSocket client
    ///
    /// # Arguments
    /// * `base_url` - Base URL for the YAMCS server (e.g., "http://localhost:8090")
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base_url: base_url.into(),
            state: Arc::new(RwLock::new(ConnectionState::Disconnected)),
            subscriptions: Arc::new(Mutex::new(HashMap::new())),
            request_sequence: Arc::new(Mutex::new(0)),
            tx: Arc::new(Mutex::new(None)),
            frame_loss_callback: Arc::new(Mutex::new(None)),
        }
    }

    /// Set a callback to be called when frame loss is detected
    pub async fn set_frame_loss_callback<F>(&self, callback: F)
    where
        F: Fn() + Send + Sync + 'static,
    {
        let mut cb = self.frame_loss_callback.lock().await;
        *cb = Some(Box::new(callback));
    }

    /// Get current connection state
    pub async fn state(&self) -> ConnectionState {
        *self.state.read().await
    }

    /// Connect to the WebSocket endpoint
    pub async fn connect(&self) -> Result<()> {
        // Check if already connected
        {
            let state = self.state.read().await;
            if *state == ConnectionState::Connected {
                return Ok(());
            }
        }

        // Update state to connecting
        {
            let mut state = self.state.write().await;
            *state = ConnectionState::Connecting;
        }

        // Build WebSocket URL
        let ws_url = self.build_websocket_url()?;

        // Connect to WebSocket
        let (ws_stream, _) = connect_async(&ws_url)
            .await
            .map_err(|e| YamcsError::WebSocket(format!("Connection failed: {}", e)))?;

        // Split the WebSocket stream
        let (write, read) = ws_stream.split();

        // Create message channel
        let (tx, mut rx) = mpsc::unbounded_channel::<ClientMessage>();

        // Store the sender
        {
            let mut sender = self.tx.lock().await;
            *sender = Some(tx);
        }

        // Update state to connected
        {
            let mut state = self.state.write().await;
            *state = ConnectionState::Connected;
        }

        // Spawn write task
        let write_handle = tokio::spawn(async move {
            let mut write = write;
            while let Some(msg) = rx.recv().await {
                let json = serde_json::to_string(&msg).unwrap();
                if let Err(e) = write.send(Message::Text(json)).await {
                    tracing::error!("WebSocket send error: {}", e);
                    break;
                }
            }
        });

        // Spawn read task
        let subscriptions = Arc::clone(&self.subscriptions);
        let state = Arc::clone(&self.state);
        let frame_loss_cb = Arc::clone(&self.frame_loss_callback);

        let read_handle = tokio::spawn(async move {
            let mut read = read;
            while let Some(result) = read.next().await {
                match result {
                    Ok(Message::Text(text)) => {
                        match serde_json::from_str::<ServerMessage>(&text) {
                            Ok(msg) => {
                                // Route message to appropriate subscription
                                let subs = subscriptions.lock().await;
                                if let Some(sub) = subs.get(&msg.call) {
                                    let frame_loss = sub.consume(msg).await;
                                    if frame_loss {
                                        let cb = frame_loss_cb.lock().await;
                                        if let Some(callback) = cb.as_ref() {
                                            callback();
                                        }
                                    }
                                }
                            }
                            Err(e) => {
                                tracing::warn!("Failed to parse server message: {}", e);
                            }
                        }
                    }
                    Ok(Message::Close(_)) => {
                        tracing::info!("WebSocket closed by server");
                        break;
                    }
                    Err(e) => {
                        tracing::error!("WebSocket read error: {}", e);
                        break;
                    }
                    _ => {}
                }
            }

            // Update state to disconnected
            let mut s = state.write().await;
            *s = ConnectionState::Disconnected;
        });

        // Store handles (we could use these for cleanup later)
        drop(write_handle);
        drop(read_handle);

        Ok(())
    }

    /// Create a subscription
    ///
    /// # Arguments
    /// * `subscription_type` - Type of subscription (e.g., "parameters", "events")
    /// * `options` - Subscription options
    /// * `callback` - Function to call when data is received
    pub async fn subscribe<O, D, F>(
        &self,
        subscription_type: impl Into<String>,
        options: O,
        callback: F,
    ) -> Result<SubscriptionHandle>
    where
        O: Serialize,
        D: for<'de> Deserialize<'de> + Send + 'static,
        F: Fn(D) + Send + Sync + 'static,
    {
        self.create_subscription(subscription_type, false, options, callback)
            .await
    }

    /// Create a low-priority subscription
    ///
    /// Low-priority subscriptions may have frames dropped if the client cannot keep up.
    ///
    /// # Arguments
    /// * `subscription_type` - Type of subscription
    /// * `options` - Subscription options
    /// * `callback` - Function to call when data is received
    pub async fn subscribe_low_priority<O, D, F>(
        &self,
        subscription_type: impl Into<String>,
        options: O,
        callback: F,
    ) -> Result<SubscriptionHandle>
    where
        O: Serialize,
        D: for<'de> Deserialize<'de> + Send + 'static,
        F: Fn(D) + Send + Sync + 'static,
    {
        self.create_subscription(subscription_type, true, options, callback)
            .await
    }

    async fn create_subscription<O, D, F>(
        &self,
        subscription_type: impl Into<String>,
        low_priority: bool,
        options: O,
        callback: F,
    ) -> Result<SubscriptionHandle>
    where
        O: Serialize,
        D: for<'de> Deserialize<'de> + Send + 'static,
        F: Fn(D) + Send + Sync + 'static,
    {
        // Ensure we're connected
        if self.state().await != ConnectionState::Connected {
            return Err(YamcsError::WebSocket(
                "Not connected to WebSocket".to_string(),
            ));
        }

        // Get next request ID
        let request_id = {
            let mut seq = self.request_sequence.lock().await;
            *seq += 1;
            *seq
        };

        let subscription_type = subscription_type.into();

        // Create subscription
        let subscription = Subscription::new(request_id, subscription_type.clone(), callback);
        let handle = subscription.handle();

        // Send subscription message
        let msg = ClientMessage {
            message_type: subscription_type,
            id: Some(request_id),
            call: None,
            low_priority: if low_priority { Some(true) } else { None },
            options: serde_json::to_value(options).map_err(|e| YamcsError::JsonSerialization(e))?,
        };

        self.send_message(msg).await?;

        // Wait for reply to get the call ID
        let call_id = subscription.wait_for_reply().await?;

        // Store subscription with call ID
        {
            let mut subs = self.subscriptions.lock().await;
            subs.insert(call_id, subscription);
        }

        Ok(handle)
    }

    /// Cancel a subscription
    pub async fn cancel_subscription(&self, handle: SubscriptionHandle) -> Result<()> {
        let call_id = handle.call_id();
        if call_id == 0 {
            // Not yet replied to, can't cancel
            return Ok(());
        }

        // Remove from subscriptions
        {
            let mut subs = self.subscriptions.lock().await;
            subs.remove(&call_id);
        }

        // Send cancel message
        let msg = ClientMessage {
            message_type: "cancel".to_string(),
            id: None,
            call: None,
            low_priority: None,
            options: serde_json::json!({ "call": call_id }),
        };

        self.send_message(msg).await?;

        Ok(())
    }

    async fn send_message(&self, msg: ClientMessage) -> Result<()> {
        let tx = self.tx.lock().await;
        if let Some(sender) = tx.as_ref() {
            sender
                .send(msg)
                .map_err(|e| YamcsError::WebSocket(format!("Failed to send message: {}", e)))?;
            Ok(())
        } else {
            Err(YamcsError::WebSocket("Not connected".to_string()))
        }
    }

    fn build_websocket_url(&self) -> Result<String> {
        let base = Url::parse(&self.base_url)?;
        let scheme = if base.scheme() == "https" || base.scheme() == "wss" {
            "wss"
        } else {
            "ws"
        };

        let host = base
            .host_str()
            .ok_or_else(|| YamcsError::InvalidUrl(url::ParseError::EmptyHost))?;

        let port = base
            .port()
            .unwrap_or_else(|| if scheme == "wss" { 443 } else { 8090 });

        Ok(format!("{}://{}:{}/api/websocket", scheme, host, port))
    }

    /// Close the WebSocket connection
    pub async fn close(&self) {
        // Clear all subscriptions
        {
            let mut subs = self.subscriptions.lock().await;
            subs.clear();
        }

        // Close the sender (which will cause the write task to exit)
        {
            let mut tx = self.tx.lock().await;
            *tx = None;
        }

        // Update state
        {
            let mut state = self.state.write().await;
            *state = ConnectionState::Disconnected;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_websocket_url_construction() {
        let client = WebSocketClient::new("http://localhost:8090");
        let url = client.build_websocket_url().unwrap();
        assert_eq!(url, "ws://localhost:8090/api/websocket");

        let client = WebSocketClient::new("https://example.com");
        let url = client.build_websocket_url().unwrap();
        assert_eq!(url, "wss://example.com:443/api/websocket");
    }
}
