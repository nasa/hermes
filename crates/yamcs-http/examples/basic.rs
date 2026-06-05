//! Basic example demonstrating YAMCS HTTP client usage
//!
//! This example shows how to:
//! - Create a client
//! - Get server information
//! - Check authentication requirements
//! - Get system information
//!
//! Run with: cargo run --example basic

use yamcs_http::{YamcsClient, YamcsError};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing subscriber
    tracing_subscriber::fmt::init();

    // Create a client (change URL to match your YAMCS server)
    let base_url =
        std::env::var("YAMCS_URL").unwrap_or_else(|_| "http://localhost:8090".to_string());
    tracing::info!("Connecting to YAMCS at {}", base_url);

    let client = YamcsClient::new(&base_url)?;

    // Get general server information
    tracing::info!("=== General Information ===");
    match client.get_general_info().await {
        Ok(info) => {
            tracing::info!("YAMCS version: {}", info.yamcs_version);
            tracing::info!("Server ID: {}", info.server_id);
            tracing::info!("Git revision: {}", info.revision);
            tracing::info!("Installed plugins:");
            for plugin in info.plugins {
                tracing::info!(
                    "  - {} v{} ({})",
                    plugin.name,
                    plugin.version,
                    plugin.vendor
                );
            }
        }
        Err(e) => {
            tracing::error!("Failed to get general info: {}", e);
        }
    }

    // Check authentication requirements
    tracing::info!("=== Authentication Information ===");
    match client.get_auth_info().await {
        Ok(auth_info) => {
            tracing::info!(
                "Authentication required: {}",
                auth_info.require_authentication
            );
            tracing::info!("SPNEGO enabled: {}", auth_info.spnego);
            if let Some(openid) = auth_info.openid {
                tracing::info!("OpenID Connect available:");
                tracing::info!("  Client ID: {}", openid.client_id);
                tracing::info!(
                    "  Authorization endpoint: {}",
                    openid.authorization_endpoint
                );
                tracing::info!("  Scope: {}", openid.scope);
            }
        }
        Err(e) => {
            tracing::error!("Failed to get auth info: {}", e);
        }
    }

    // Get system information (may require authentication)
    tracing::info!("=== System Information ===");
    match client.get_system_info().await {
        Ok(sys_info) => {
            tracing::info!("Operating system: {}", sys_info.os);
            tracing::info!("Architecture: {}", sys_info.arch);
            tracing::info!("JVM: {}", sys_info.jvm);
            tracing::info!("Available processors: {}", sys_info.available_processors);
            tracing::info!("Uptime: {} ms", sys_info.uptime);

            let heap_usage_pct =
                (sys_info.used_heap_memory as f64 / sys_info.max_heap_memory as f64) * 100.0;
            tracing::info!("Memory:");
            tracing::info!(
                "  Heap: {} / {} MB ({:.1}%)",
                sys_info.used_heap_memory / 1024 / 1024,
                sys_info.max_heap_memory / 1024 / 1024,
                heap_usage_pct
            );

            tracing::info!("CPU:");
            tracing::info!("  System load: {:.2}%", sys_info.cpu_load * 100.0);
            tracing::info!("  Process load: {:.2}%", sys_info.process_cpu_load * 100.0);

            tracing::info!("Process:");
            tracing::info!("  PID: {}", sys_info.process.pid);
            tracing::info!("  User: {}", sys_info.process.user);
            tracing::info!("  Command: {}", sys_info.process.command);
        }
        Err(YamcsError::HttpStatus { status: 401, .. }) => {
            tracing::warn!("Authentication required to access system information");
        }
        Err(YamcsError::HttpStatus { status: 403, .. }) => {
            tracing::warn!("Permission denied to access system information");
        }
        Err(e) => {
            tracing::error!("Failed to get system info: {}", e);
        }
    }

    // Try to get user info (requires authentication)
    tracing::info!("=== User Information ===");
    match client.get_user_info().await {
        Ok(user) => {
            tracing::info!("Username: {}", user.name);
            tracing::info!("Display name: {}", user.display_name);
            tracing::info!("Email: {}", user.email);
            tracing::info!("Active: {}", user.active);
            tracing::info!("Superuser: {}", user.superuser);
            tracing::info!("Clearance: {}", user.clearance);
        }
        Err(YamcsError::HttpStatus { status: 401, .. }) => {
            tracing::warn!("Not authenticated - user information not available");
            tracing::info!(
                "To authenticate, use AuthMethod::AccessToken or set up client certificates"
            );
        }
        Err(e) => {
            tracing::error!("Failed to get user info: {}", e);
        }
    }

    Ok(())
}
