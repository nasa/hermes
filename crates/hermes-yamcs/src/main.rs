mod convert;
mod service;

use clap::Parser;
use hermes_server::api_server::ApiServer;
use service::YamcsApiService;
use std::net::SocketAddr;
use tonic::transport::Server;
use tracing::{error, info};
use tracing_subscriber::{EnvFilter, fmt};

/// Hermes-YAMCS bridge: connects Hermes telemetry clients to YAMCS mission control system
#[derive(Parser, Debug)]
#[command(name = "hermes-yamcs")]
#[command(version, about, long_about = None)]
struct Args {
    /// YAMCS HTTP server URL
    #[arg(long, default_value = "http://localhost:8090")]
    yamcs_url: String,

    /// YAMCS processor name (used for all instances)
    #[arg(long, default_value = "realtime")]
    yamcs_processor: String,

    /// Address to bind the Hermes gRPC server to
    #[arg(long, default_value = "[::1]:6880")]
    bind_addr: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing subscriber with stderr output
    let env_filter = EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info"));

    fmt()
        .with_env_filter(env_filter)
        .with_writer(std::io::stderr)
        .init();

    let args = Args::parse();

    info!("Starting Hermes-YAMCS bridge");
    info!(yamcs_url = %args.yamcs_url, "YAMCS URL configured");
    info!(yamcs_processor = %args.yamcs_processor, "YAMCS Processor configured");
    info!(bind_addr = %args.bind_addr, "Binding address configured");

    // Create YAMCS client
    let yamcs_client = yamcs_http::YamcsClient::new(&args.yamcs_url).map_err(|e| {
        error!(error = %e, "Failed to create YAMCS client");
        e
    })?;

    // Test connection and list instances
    let server_info = yamcs_client.get_general_info().await.map_err(|e| {
        error!(error = %e, "Failed to connect to YAMCS");
        e
    })?;
    info!(yamcs_version = %server_info.yamcs_version, "Connected to YAMCS");

    // List available instances
    let instances = yamcs_client.get_instances().await.map_err(|e| {
        error!(error = %e, "Failed to list YAMCS instances");
        e
    })?;
    info!(count = instances.len(), "Discovered YAMCS instances");
    for instance in &instances {
        info!(instance = %instance.name, "Available instance");
    }

    // Create the service
    let service = YamcsApiService::new(
        yamcs_client,
        args.yamcs_processor.clone(),
    );

    // Parse bind address
    let addr: SocketAddr = args.bind_addr.parse().map_err(|e| {
        error!(error = %e, bind_addr = %args.bind_addr, "Failed to parse bind address");
        e
    })?;

    info!(addr = %addr, "Starting Hermes gRPC server");

    // Start the gRPC server
    Server::builder()
        .add_service(ApiServer::new(service))
        .serve(addr)
        .await
        .map_err(|e| {
            error!(error = %e, "gRPC server failed");
            e
        })?;

    Ok(())
}
