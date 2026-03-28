//! Comprehensive YAMCS API example
//!
//! This example demonstrates the full range of YAMCS HTTP API capabilities including:
//! - Mission Database (MDB) queries
//! - Real-time commanding
//! - Parameter value retrieval
//! - Event management
//! - Alarm monitoring
//!
//! Run with: cargo run --example comprehensive

use yamcs_http::{AuthMethod, YamcsClient, types::GetAlarmsOptions};

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

    tracing::info!("=== YAMCS Comprehensive API Example ===");

    // 1. Server Information
    tracing::info!("1. Server Information:");
    match client.get_general_info().await {
        Ok(info) => {
            tracing::info!("   YAMCS version: {}", info.yamcs_version);
            tracing::info!("   Server ID: {}", info.server_id);
            tracing::info!("   Plugins: {}", info.plugins.len());
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 2. List Instances
    tracing::info!("\n2. Available Instances:");
    match client.get_instances().await {
        Ok(instances) => {
            for inst in &instances {
                tracing::info!("   - {} ({:?})", inst.name, inst.state);
            }
            if instances.is_empty() {
                tracing::info!("   No instances found. Set YAMCS_INSTANCE environment variable.");
                return Ok(());
            }
        }
        Err(e) => {
            tracing::info!("   Error: {}", e);
            return Ok(());
        }
    }

    // 3. Mission Database (MDB)
    tracing::info!("\n3. Mission Database:");
    match client.get_mission_database(&instance).await {
        Ok(mdb) => {
            tracing::info!("   Name: {}", mdb.name);
            tracing::info!("   Version: {}", mdb.version.unwrap_or_default());
            tracing::info!("   Parameters: {}", mdb.parameter_count);
            tracing::info!("   Commands: {}", mdb.command_count);
            tracing::info!("   Containers: {}", mdb.container_count);
            tracing::info!("   Algorithms: {}", mdb.algorithm_count);
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 4. Space Systems
    tracing::info!("\n4. Space Systems:");
    match client.get_space_systems(&instance).await {
        Ok(page) => {
            if let Some(systems) = page.space_systems {
                for system in systems.iter().take(5) {
                    tracing::info!("   - {}", system.qualified_name);
                }
                if systems.len() > 5 {
                    tracing::info!("   ... and {} more", systems.len() - 5);
                }
            }
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 5. Parameters
    tracing::info!("\n5. Parameters (first 5):");
    use yamcs_http::types::mdb::GetParametersOptions;
    match client
        .get_parameters(
            &instance,
            &GetParametersOptions {
                limit: Some(5),
                ..Default::default()
            },
        )
        .await
    {
        Ok(page) => {
            if let Some(params) = page.parameters {
                for param in &params {
                    tracing::info!(
                        "   - {} ({:?})",
                        param.qualified_name, param.data_source
                    );
                }
            }
            tracing::info!("   Total: {}", page.total_size);
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 6. Commands
    tracing::info!("\n6. Commands (first 5):");
    use yamcs_http::types::mdb::GetCommandsOptions;
    match client
        .get_commands(
            &instance,
            &GetCommandsOptions {
                limit: Some(5),
                ..Default::default()
            },
        )
        .await
    {
        Ok(page) => {
            if let Some(commands) = page.commands {
                for cmd in &commands {
                    let abstract_str = if cmd.is_abstract {
                        " (abstract)"
                    } else {
                        ""
                    };
                    tracing::info!(
                        "   - {}{}",
                        cmd.qualified_name, abstract_str
                    );
                }
            }
            tracing::info!("   Total: {}", page.total_size);
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 7. Processors
    tracing::info!("\n7. Processors:");
    match client.get_processors(&instance).await {
        Ok(processors) => {
            for proc in &processors {
                tracing::info!(
                    "   - {} (type: {}, commanding: {})",
                    proc.name, proc.processor_type, proc.has_commanding
                );
            }
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 8. Events
    tracing::info!("\n8. Recent Events (last 5):");
    use yamcs_http::types::events::GetEventsOptions;
    use yamcs_http::types::monitoring::SortOrder;
    match client
        .get_events(
            &instance,
            &GetEventsOptions {
                limit: Some(5),
                order: Some(SortOrder::Desc),
                ..Default::default()
            },
        )
        .await
    {
        Ok(events) => {
            for event in &events {
                tracing::info!(
                    "   [{:?}] {}: {}",
                    event.severity, event.source, event.message
                );
            }
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 9. Alarms
    tracing::info!("\n9. Active Alarms:");
    match client.get_active_alarms(&instance, &processor, &GetAlarmsOptions::default()).await {
        Ok(alarms) => {
            if alarms.is_empty() {
                tracing::info!("   No active alarms");
            } else {
                for alarm in &alarms {
                    tracing::info!(
                        "   [{:?}] {} - seq: {}",
                        alarm.severity, alarm.id.name, alarm.seq_num
                    );
                }
            }
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 10. Global Alarm Status
    tracing::info!("\n10. Global Alarm Status:");
    match client
        .get_global_alarm_status(&instance, &processor)
        .await
    {
        Ok(status) => {
            tracing::info!("   Unacknowledged: {} (active: {})",
                status.unacknowledged_count,
                status.unacknowledged_active
            );
            tracing::info!("   Acknowledged: {} (active: {})",
                status.acknowledged_count,
                status.acknowledged_active
            );
            tracing::info!("   Shelved: {} (active: {})",
                status.shelved_count,
                status.shelved_active
            );
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    // 11. Command History
    tracing::info!("\n11. Recent Commands (last 3):");
    use yamcs_http::types::monitoring::GetCommandHistoryOptions;
    match client
        .get_command_history(
            &instance,
            &GetCommandHistoryOptions {
                limit: Some(3),
                order: Some(SortOrder::Desc),
                ..Default::default()
            },
        )
        .await
    {
        Ok(page) => {
            if let Some(commands) = page.commands {
                for cmd in &commands {
                    tracing::info!(
                        "   - {} (seq: {}, origin: {})",
                        cmd.command_name, cmd.sequence_number, cmd.origin
                    );
                }
            } else {
                tracing::info!("   No command history");
            }
        }
        Err(e) => tracing::error!("   Error: {}", e),
    }

    tracing::info!("\n=== Example Complete ===");
    tracing::info!("\nTip: Set YAMCS_TOKEN environment variable for authenticated access");
    tracing::info!("Tip: Set YAMCS_INSTANCE and YAMCS_PROCESSOR to target specific instance/processor");

    Ok(())
}
