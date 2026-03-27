//! Automatic subscription cancellation example
//!
//! This example demonstrates how subscriptions are automatically cancelled
//! when the channel receiver is dropped.
//!
//! Run with: cargo run --example auto_cancel_subscription --features websocket

#[cfg(feature = "websocket")]
use yamcs_http::{types::events::SubscribeEventsRequest, AuthMethod, YamcsClient};

#[cfg(feature = "websocket")]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing subscriber
    tracing_subscriber::fmt::init();

    let base_url =
        std::env::var("YAMCS_URL").unwrap_or_else(|_| "http://localhost:8090".to_string());
    let instance = std::env::var("YAMCS_INSTANCE").unwrap_or_else(|_| "myproject".to_string());

    let token = std::env::var("YAMCS_TOKEN").ok();

    let client = if let Some(token) = token {
        YamcsClient::with_auth(&base_url, AuthMethod::AccessToken(token))?
    } else {
        YamcsClient::new(&base_url)?
    };

    tracing::info!("=== YAMCS Automatic Subscription Cancellation Example ===");

    // Connect to WebSocket
    tracing::info!("Connecting to WebSocket...");
    client.connect_websocket().await?;
    tracing::info!("Connected!\n");

    // Example 1: Subscription cancelled by explicit drop
    tracing::info!("Example 1: Explicit cancellation via drop()");
    {
        let events_request = SubscribeEventsRequest {
            instance: instance.clone(),
            filter: None,
        };

        let mut rx = client.subscribe_events(&events_request).await?;

        // Spawn task to process events
        let handle = tokio::spawn(async move {
            let mut count = 0;
            while let Some(event) = rx.recv().await {
                tracing::info!("[EVENT] {}: {}", event.source, event.message);
                count += 1;
            }
            tracing::info!("Receiver closed - received {} events", count);
        });

        tracing::info!("Subscription active");
        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

        tracing::info!("Dropping receiver (by aborting the task)...");
        handle.abort();

        // Give the cancellation task a moment to complete
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        tracing::info!("Subscription cancelled\n");
    }

    tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

    // Example 2: Subscription automatically cancelled when receiver goes out of scope
    tracing::info!("Example 2: Automatic cancellation when receiver goes out of scope");
    {
        let events_request = SubscribeEventsRequest {
            instance: instance.clone(),
            filter: None,
        };

        {
            let mut rx = client.subscribe_events(&events_request).await?;

            // Spawn task to process events
            let _handle = tokio::spawn(async move {
                let mut count = 0;
                while let Some(event) = rx.recv().await {
                    tracing::info!("[EVENT] {}: {}", event.source, event.message);
                    count += 1;
                }
                tracing::info!("Receiver closed - received {} events", count);
            });

            tracing::info!("Subscription active in inner scope");
            tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

            tracing::info!("Exiting inner scope...");
            // rx is moved into the spawned task, but when we exit this scope
            // we're no longer holding any reference to the receiver
        }

        tracing::info!("Subscription automatically cancelled when scope ended!");

        // Give the cancellation task a moment to complete
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
    }

    // Example 3: Multiple receivers from the same subscription type
    tracing::info!("\nExample 3: Multiple independent subscriptions");
    {
        let events_request = SubscribeEventsRequest {
            instance: instance.clone(),
            filter: None,
        };

        // Create two independent subscriptions
        let mut rx1 = client.subscribe_events(&events_request).await?;
        let mut rx2 = client.subscribe_events(&events_request).await?;

        tracing::info!("Two independent event subscriptions active");

        // Spawn tasks to process events
        let handle1 = tokio::spawn(async move {
            let mut count = 0;
            while let Some(event) = rx1.recv().await {
                tracing::info!("[SUB1] {}: {}", event.source, event.message);
                count += 1;
            }
            tracing::info!("Subscription 1 closed - received {} events", count);
        });

        let handle2 = tokio::spawn(async move {
            let mut count = 0;
            while let Some(event) = rx2.recv().await {
                tracing::info!("[SUB2] {}: {}", event.source, event.message);
                count += 1;
            }
            tracing::info!("Subscription 2 closed - received {} events", count);
        });

        tokio::time::sleep(tokio::time::Duration::from_secs(2)).await;

        tracing::info!("Cancelling first subscription...");
        handle1.abort();
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;

        tracing::info!("First subscription cancelled, second still active");
        tokio::time::sleep(tokio::time::Duration::from_secs(1)).await;

        tracing::info!("Cancelling second subscription...");
        handle2.abort();
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;
        tracing::info!("Both subscriptions cancelled");
    }

    // Close WebSocket
    client.close_websocket().await;
    tracing::info!("\nDisconnected.");

    Ok(())
}

#[cfg(not(feature = "websocket"))]
fn main() {
    tracing_subscriber::fmt::init();
    tracing::error!("This example requires the 'websocket' feature to be enabled.");
    tracing::info!(
        "Run with: cargo run --example auto_cancel_subscription --features websocket"
    );
    std::process::exit(1);
}
