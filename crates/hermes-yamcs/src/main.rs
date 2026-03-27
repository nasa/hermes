mod service;
mod convert;

use clap::Parser;
use hermes_server::api_server::ApiServer;
use service::YamcsApiService;
use std::net::SocketAddr;
use tonic::transport::Server;

/// Hermes-YAMCS bridge: connects Hermes telemetry clients to YAMCS mission control system
#[derive(Parser, Debug)]
#[command(name = "hermes-yamcs")]
#[command(version, about, long_about = None)]
struct Args {
    /// YAMCS server URL
    #[arg(long, default_value = "http://localhost:8090")]
    yamcs_url: String,

    /// YAMCS instance name
    #[arg(long, default_value = "myproject")]
    yamcs_instance: String,

    /// YAMCS processor name
    #[arg(long, default_value = "realtime")]
    yamcs_processor: String,

    /// Address to bind the gRPC server to
    #[arg(long, default_value = "[::1]:6880")]
    bind_addr: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    println!("Starting Hermes-YAMCS bridge:");
    println!("  YAMCS URL: {}", args.yamcs_url);
    println!("  YAMCS Instance: {}", args.yamcs_instance);
    println!("  YAMCS Processor: {}", args.yamcs_processor);
    println!("  Binding to: {}", args.bind_addr);

    // Create YAMCS client
    let yamcs_client = yamcs_http::YamcsClient::new(&args.yamcs_url)?;

    // Test connection
    let info = yamcs_client.get_general_info().await?;
    println!("Connected to YAMCS version: {}", info.yamcs_version);

    // Create the service
    let service = YamcsApiService::new(
        yamcs_client,
        args.yamcs_instance.clone(),
        args.yamcs_processor.clone(),
    );

    // Parse bind address
    let addr: SocketAddr = args.bind_addr.parse()?;

    println!("Hermes gRPC server listening on {}", addr);

    // Start the gRPC server
    Server::builder()
        .add_service(ApiServer::new(service))
        .serve(addr)
        .await?;

    Ok(())
}
