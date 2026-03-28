//! Authenticated client example
//!
//! This example demonstrates how to use different authentication methods with YAMCS.
//!
//! Run with: cargo run --example authenticated

use yamcs_http::{AuthMethod, YamcsClient};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing subscriber
    tracing_subscriber::fmt::init();

    let base_url = std::env::var("YAMCS_URL").unwrap_or_else(|_| "http://localhost:8090".to_string());

    // Get auth token from environment variable
    let token = std::env::var("YAMCS_TOKEN").ok();

    let client = if let Some(token) = token {
        tracing::info!("Connecting with authentication token...");
        YamcsClient::with_auth(&base_url, AuthMethod::AccessToken(token))?
    } else {
        tracing::info!("No YAMCS_TOKEN found, connecting without authentication...");
        YamcsClient::new(&base_url)?
    };

    // Try to get user information
    match client.get_user_info().await {
        Ok(user) => {
            tracing::info!("=== User Information ===");
            tracing::info!("Username: {}", user.name);
            tracing::info!("Display name: {}", user.display_name);
            tracing::info!("Email: {}", user.email);
            tracing::info!("Active: {}", user.active);
            tracing::info!("Superuser: {}", user.superuser);
            tracing::info!("Clearance: {}", user.clearance);

            if let Some(groups) = user.groups {
                tracing::info!("Groups:");
                for group in groups {
                    tracing::info!("  - {}: {}", group.name, group.description);
                }
            }

            if let Some(roles) = user.roles {
                tracing::info!("Roles:");
                for role in roles {
                    tracing::info!("  - {}: {}", role.name, role.description);
                }
            }

            if let Some(privileges) = user.system_privileges {
                tracing::info!("System privileges:");
                for privilege in privileges {
                    tracing::info!("  - {}", privilege);
                }
            }
        }
        Err(e) => {
            tracing::error!("Failed to get user info: {}", e);
            tracing::info!("To authenticate, set the YAMCS_TOKEN environment variable:");
            tracing::info!("  export YAMCS_TOKEN=your-token-here");
            tracing::info!("  cargo run --example authenticated");
        }
    }

    Ok(())
}
