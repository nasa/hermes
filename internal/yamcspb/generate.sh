#!/bin/sh
# Generates Go code for the vendored YAMCS protos in proto/yamcs.
set -e
cd "$(dirname "$0")/../.."

# Generated files record these versions in their headers, so we pin them to keep regenerated output identical.
PROTOC=36.0
PROTOC_GEN_GO=v1.36.11
PROTOC_GEN_GO_GRPC=v1.6.2

# protoc on Windows ends its version line with \r
if [ "$(protoc --version | tr -d '\r')" != "libprotoc $PROTOC" ]; then
    echo "want protoc $PROTOC, found $(protoc --version)" >&2
    exit 1
fi

BIN="$(pwd)/out/protoc-plugins"
# Go on Windows only accepts the C:/... form of the path, which Git Bash prints with pwd -W
export GOBIN="$(pwd -W 2>/dev/null || pwd)/out/protoc-plugins"
go install google.golang.org/protobuf/cmd/protoc-gen-go@$PROTOC_GEN_GO
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@$PROTOC_GEN_GO_GRPC

FILES=$(cd proto && find yamcs -name '*.proto' | sort)
# YAMCS's protos don't set go_package, so we pass each file's Go import path to the plugins as M<file>=<import path>.
OPTS=""
for f in $FILES; do
    m="M$f=github.com/nasa/hermes/internal/yamcspb/$(dirname "${f#yamcs/}")"
    OPTS="$OPTS --go_opt=$m --go-grpc_opt=$m"
done

find internal/yamcspb -name '*.pb.go' -delete
PATH="$BIN:$PATH" protoc -Iproto \
    --go_out=. --go_opt=module=github.com/nasa/hermes \
    --go-grpc_out=. --go-grpc_opt=module=github.com/nasa/hermes \
    $OPTS $FILES
