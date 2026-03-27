use crate::error::{Result, YamcsError};
use crate::websocket::client::ServerMessage;
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::{Mutex, Notify};

/// Handle to a WebSocket subscription
///
/// Use this handle to check subscription status and cancel the subscription.
#[derive(Clone)]
pub struct SubscriptionHandle {
    inner: Arc<SubscriptionInner>,
}

struct SubscriptionInner {
    call_id: Mutex<u32>,
    cancelled: Mutex<bool>,
}

impl SubscriptionHandle {
    fn new() -> Self {
        Self {
            inner: Arc::new(SubscriptionInner {
                call_id: Mutex::new(0),
                cancelled: Mutex::new(false),
            }),
        }
    }

    /// Get the server-assigned call ID
    ///
    /// Returns 0 if the server has not yet replied to the subscription request.
    pub fn call_id(&self) -> u32 {
        // Note: This is a synchronous getter, so we use try_lock
        // In practice, once set, the call_id doesn't change
        self.inner.call_id.try_lock().map(|g| *g).unwrap_or(0)
    }

    /// Check if the subscription has been cancelled
    pub async fn is_cancelled(&self) -> bool {
        *self.inner.cancelled.lock().await
    }

    async fn set_call_id(&self, id: u32) {
        let mut call_id = self.inner.call_id.lock().await;
        *call_id = id;
    }

    #[allow(dead_code)]
    async fn cancel(&self) {
        let mut cancelled = self.inner.cancelled.lock().await;
        *cancelled = true;
    }
}

/// Internal subscription state
pub(crate) struct Subscription {
    request_id: u32,
    call_id: Mutex<Option<u32>>,
    subscription_type: String,
    seq: Mutex<u32>,
    frame_loss: Mutex<bool>,
    callback: Arc<dyn Fn(serde_json::Value) + Send + Sync>,
    reply_notify: Arc<Notify>,
    handle: SubscriptionHandle,
}

impl Subscription {
    pub(crate) fn new<D, F>(request_id: u32, subscription_type: String, callback: F) -> Self
    where
        D: for<'de> Deserialize<'de> + Send + 'static,
        F: Fn(D) + Send + Sync + 'static,
    {
        let callback = Arc::new(move |value: serde_json::Value| {
            match serde_json::from_value::<D>(value) {
                Ok(data) => callback(data),
                Err(e) => {
                    tracing::error!("Failed to deserialize subscription data: {}", e);
                }
            }
        });

        Self {
            request_id,
            call_id: Mutex::new(None),
            subscription_type,
            seq: Mutex::new(0),
            frame_loss: Mutex::new(false),
            callback,
            reply_notify: Arc::new(Notify::new()),
            handle: SubscriptionHandle::new(),
        }
    }

    pub(crate) fn handle(&self) -> SubscriptionHandle {
        self.handle.clone()
    }

    /// Wait for the server to reply with the call ID
    pub(crate) async fn wait_for_reply(&self) -> Result<u32> {
        // Wait for notification
        self.reply_notify.notified().await;

        // Get the call ID
        let call_id = self.call_id.lock().await;
        call_id.ok_or_else(|| YamcsError::WebSocket("No call ID received".to_string()))
    }

    /// Process a server message
    ///
    /// Returns true if frame loss was detected
    pub(crate) async fn consume(&self, msg: ServerMessage) -> bool {
        // Handle reply message (establishes call ID)
        if msg.message_type == "reply" {
            if let Some(reply_to) = msg.data.get("replyTo").and_then(|v| v.as_u64()) {
                if reply_to as u32 == self.request_id {
                    // Store call ID
                    {
                        let mut call_id = self.call_id.lock().await;
                        *call_id = Some(msg.call);
                    }

                    // Update handle
                    self.handle.set_call_id(msg.call).await;

                    // Check for exception
                    if let Some(exception) = msg.data.get("exception") {
                        let code = exception
                            .get("code")
                            .and_then(|v| v.as_str())
                            .unwrap_or("UNKNOWN");
                        let err_type = exception
                            .get("type")
                            .and_then(|v| v.as_str())
                            .unwrap_or("UNKNOWN");
                        let detail = exception
                            .get("msg")
                            .and_then(|v| v.as_str())
                            .unwrap_or("No details");

                        tracing::error!(
                            code = code,
                            error_type = err_type,
                            topic = self.subscription_type,
                            "Subscription error: {}",
                            detail
                        );
                    }

                    // Notify waiters
                    self.reply_notify.notify_waiters();
                }
            }
            return false;
        }

        // Handle data message
        if msg.message_type == self.subscription_type {
            // Check for frame loss by comparing sequence numbers
            let mut frame_loss_detected = false;
            {
                let mut seq = self.seq.lock().await;
                let expected_seq = *seq + 1;
                if *seq > 0 && msg.seq != expected_seq {
                    // Frame loss detected!
                    let mut frame_loss = self.frame_loss.lock().await;
                    if !*frame_loss {
                        *frame_loss = true;
                        frame_loss_detected = true;
                        tracing::warn!(
                            topic = self.subscription_type,
                            expected = expected_seq,
                            actual = msg.seq,
                            "Frame loss detected"
                        );
                    }
                }
                *seq = msg.seq;
            }

            // Call the callback
            (self.callback)(msg.data);

            return frame_loss_detected;
        }

        false
    }

    /// Check if frame loss has been detected
    #[allow(dead_code)]
    pub async fn has_frame_loss(&self) -> bool {
        *self.frame_loss.lock().await
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_subscription_handle() {
        let handle = SubscriptionHandle::new();
        assert_eq!(handle.call_id(), 0);
        assert!(!handle.is_cancelled().await);

        handle.set_call_id(42).await;
        // Note: try_lock might fail in rare cases, but for tests this is fine
        tokio::time::sleep(tokio::time::Duration::from_millis(10)).await;
        assert_eq!(handle.call_id(), 42);

        handle.cancel().await;
        assert!(handle.is_cancelled().await);
    }
}
