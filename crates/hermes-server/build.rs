use std::io::Result;

fn main() -> Result<()> {
    tonic_build::configure()
        .build_client(false)
        .build_server(true)
        .extern_path(".hermes", "::hermes_pb")
        .compile_protos(
            &["../../proto/grpc/hermes.proto"],
            &["../../proto/pb/", "../../proto/grpc/"],
        )?;
    Ok(())
}
