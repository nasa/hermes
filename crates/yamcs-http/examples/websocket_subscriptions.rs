//! WebSocket subscriptions example
//!
//! This example demonstrates real-time subscriptions using WebSockets.
//! Requires the `websocket` feature to be enabled.
//!
//! Run with: cargo run --example websocket_subscriptions --features websocket

#[cfg(feature = "websocket")]
use yamcs_http::{
    AuthMethod, YamcsClient,
    types::{
        alarms::{SubscribeAlarmsRequest, SubscribeGlobalAlarmStatusRequest},
        common::NamedObjectId,
        events::SubscribeEventsRequest,
        monitoring::{SubscribeParametersAction, SubscribeParametersRequest},
    },
};

#[cfg(feature = "websocket")]
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing subscriber
    tracing_subscriber::fmt::init();

    let base_url =
        std::env::var("YAMCS_URL").unwrap_or_else(|_| "http://localhost:8090".to_string());
    let instance = std::env::var("YAMCS_INSTANCE").unwrap_or_else(|_| "myproject".to_string());
    let processor = std::env::var("YAMCS_PROCESSOR").unwrap_or_else(|_| "realtime".to_string());

    let token = std::env::var("YAMCS_TOKEN").ok();

    let client = if let Some(token) = token {
        YamcsClient::with_auth(&base_url, AuthMethod::AccessToken(token))?
    } else {
        YamcsClient::new(&base_url)?
    };

    tracing::info!("=== YAMCS WebSocket Subscriptions Example ===");

    // Connect to WebSocket
    tracing::info!("Connecting to WebSocket...");
    client.connect_websocket().await?;
    tracing::info!("Connected!");

    // Set frame loss callback
    client
        .set_frame_loss_callback(|| {
            tracing::warn!("Frame loss detected!");
        })
        .await;

    // Subscribe to events
    tracing::info!("Subscribing to events...");
    let events_request = SubscribeEventsRequest {
        instance: instance.clone(),
        filter: None,
    };
    let mut events_rx = client.subscribe_events(&events_request).await?;
    tracing::info!("Events subscription active\n");

    // Spawn task to process events
    tokio::spawn(async move {
        while let Some(event) = events_rx.recv().await {
            tracing::info!(
                "[EVENT {:?}] {}: {}",
                event.severity,
                event.source,
                event.message
            );
        }
    });

    // Subscribe to global alarm status
    tracing::info!("Subscribing to global alarm status...");
    let alarm_status_request = SubscribeGlobalAlarmStatusRequest {
        instance: instance.clone(),
        processor: processor.clone(),
    };
    let mut alarm_status_rx = client
        .subscribe_global_alarm_status(&alarm_status_request)
        .await?;
    tracing::info!("Alarm status subscription active\n");

    // Spawn task to process alarm status
    tokio::spawn(async move {
        while let Some(status) = alarm_status_rx.recv().await {
            tracing::info!(
                "[ALARM STATUS] Unack: {} (active: {}), Ack: {} (active: {}), Shelved: {}",
                status.unacknowledged_count,
                status.unacknowledged_active,
                status.acknowledged_count,
                status.acknowledged_active,
                status.shelved_count
            );
        }
    });

    // Subscribe to alarms
    tracing::info!("Subscribing to alarms...");
    let alarms_request = SubscribeAlarmsRequest {
        instance: instance.clone(),
        processor: processor.clone(),
        include_pending: true,
    };
    let mut alarms_rx = client.subscribe_alarms(&alarms_request).await?;
    tracing::info!("Alarms subscription active\n");

    // Spawn task to process alarms
    tokio::spawn(async move {
        while let Some(alarm) = alarms_rx.recv().await {
            tracing::info!(
                "[ALARM {:?}] {} - seq: {}, violations: {}",
                alarm.severity,
                alarm.id.name,
                alarm.seq_num,
                alarm.violations
            );
        }
    });

    // Subscribe to parameters (if any are specified)
    if let Ok(params) = std::env::var("YAMCS_PARAMETERS") {
        let param_list: Vec<String> = params.split(',').map(|s| s.trim().to_string()).collect();

        if !param_list.is_empty() {
            tracing::info!("Subscribing to parameters: {:?}...", param_list);
            let params_request = SubscribeParametersRequest {
                instance: instance.clone(),
                processor: processor.clone(),
                id: param_list
                    .iter()
                    .map(|name| NamedObjectId {
                        name: name.clone(),
                        namespace: None,
                    })
                    .collect(),
                abort_on_invalid: false,
                update_on_expiration: false,
                send_from_cache: true,
                max_bytes: None,
                action: SubscribeParametersAction::Replace,
            };
            let mut params_rx = client.subscribe_parameters(&params_request).await?;
            tracing::info!("Parameter subscription active\n");

            // Spawn task to process parameters
            tokio::spawn(async move {
                while let Some(data) = params_rx.recv().await {
                    // Show mapping info on first update
                    if !data.mapping.is_empty() {
                        tracing::info!(
                            "[PARAM INFO] Subscribed to {} parameters",
                            data.mapping.len()
                        );
                    }
                    // Show any invalid parameters
                    if !data.invalid.is_empty() {
                        tracing::info!("[PARAM WARN] Invalid parameters: {:?}", data.invalid);
                    }
                    // Show parameter values
                    for param in &data.values {
                        tracing::info!(
                            "[PARAM] {} = {:?} @ {}",
                            param.id.name,
                            param.eng_value,
                            param.generation_time
                        );
                    }
                }
            });

            tracing::info!("Listening for updates... (press Ctrl+C to stop)");
            tracing::info!(
                "Tip: Set YAMCS_PARAMETERS env var to subscribe to specific parameters (comma-separated)"
            );
            tracing::info!("Example: YAMCS_PARAMETERS=/MySystem/Param1,/MySystem/Param2\n");

            // Keep running until interrupted
            tokio::signal::ctrl_c().await?;
        } else {
            tracing::info!("No parameters specified. Listening to events and alarms only...\n");
            tracing::info!("Tip: Set YAMCS_PARAMETERS env var to subscribe to parameters");
            tracing::info!("Example: YAMCS_PARAMETERS=/MySystem/Param1,/MySystem/Param2\n");

            // Keep running until interrupted
            tokio::signal::ctrl_c().await?;
        }
    } else {
        tracing::info!("Listening for updates... (press Ctrl+C to stop)");
        tracing::info!("Tip: Set YAMCS_PARAMETERS env var to subscribe to specific parameters");
        tracing::info!("Example: YAMCS_PARAMETERS=/MySystem/Param1,/MySystem/Param2\n");

        // Keep running until interrupted
        tokio::signal::ctrl_c().await?;
    }

    tracing::info!("\nShutting down...");
    tracing::info!("Note: Subscriptions are automatically cancelled when the client closes");

    // Close WebSocket
    client.close_websocket().await;

    tracing::info!("Disconnected.");

    Ok(())
}

#[cfg(not(feature = "websocket"))]
fn main() {
    tracing_subscriber::fmt::init();
    tracing::error!("This example requires the 'websocket' feature to be enabled.");
    tracing::info!("Run with: cargo run --example websocket_subscriptions --features websocket");
    std::process::exit(1);
}
