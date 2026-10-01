#!/bin/sh
# Generates Go code for the vendored YAMCS protos in proto/yamcs.
# YAMCS sets no go_package, so each file gets an M option mapping it to the matching directory here.
set -e
cd "$(dirname "$0")/../.."

PROTOC=36.0
PROTOC_GEN_GO=v1.36.11
PROTOC_GEN_GO_GRPC=v1.6.2

if [ "$(protoc --version | tr -d '\r')" != "libprotoc $PROTOC" ]; then
    echo "want protoc $PROTOC, found $(protoc --version)" >&2
    exit 1
fi

BIN="$(pwd)/out/protoc-plugins"
GOBIN="$BIN" go install google.golang.org/protobuf/cmd/protoc-gen-go@$PROTOC_GEN_GO
GOBIN="$BIN" go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@$PROTOC_GEN_GO_GRPC

FILES=$(cd proto && find yamcs -name '*.proto' | sort)
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
