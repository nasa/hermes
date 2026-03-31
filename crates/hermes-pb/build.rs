use std::io::Result;

fn main() -> Result<()> {
    // Generate Rust code from protobuf definitions
    // This will output to OUT_DIR (typically target/debug/build/hermes-pb-*/out/)
    // prost_build::compile_protos(
    //     &[
    //         "../../proto/pb/bus.proto",
    //         "../../proto/pb/dictionary.proto",
    //         "../../proto/pb/file.proto",
    //         "../../proto/pb/fsw.proto",
    //         "../../proto/pb/msg.proto",
    //         "../../proto/pb/profile.proto",
    //         "../../proto/pb/time.proto",
    //         "../../proto/pb/type.proto",
    //     ],
    //     &["../../proto/pb/"],
    // )?;
    Ok(())
}
