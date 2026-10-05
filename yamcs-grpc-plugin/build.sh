#!/bin/sh
# Builds the plugin against the YAMCS 5.13.5 jars inside the yamcs/example-simulation image.
# out/lib ends up holding the plugin jar plus the grpc-java jars it needs; mount it at /opt/yamcs/lib/ext.
set -e
cd "$(dirname "$0")"

GRPC=1.84.0
mkdir -p out/lib
# out/lib is YAMCS's lib/ext, so jars from an older gRPC version must not stay behind
find out/lib -name 'grpc-*.jar' ! -name "*-$GRPC.jar" -delete
for a in grpc-api grpc-core grpc-netty-shaded grpc-stub grpc-util; do
    [ -f "out/lib/$a-$GRPC.jar" ] || curl -sfL -o "out/lib/$a-$GRPC.jar" \
        "https://repo1.maven.org/maven2/io/grpc/$a/$GRPC/$a-$GRPC.jar"
done
[ -f out/lib/perfmark-api-0.27.0.jar ] || curl -sfL -o out/lib/perfmark-api-0.27.0.jar \
    https://repo1.maven.org/maven2/io/perfmark/perfmark-api/0.27.0/perfmark-api-0.27.0.jar

# pwd -W gives a Windows path under Git Bash, which Docker Desktop needs for the mount
docker run --rm --user "$(id -u):$(id -g)" -v "$(pwd -W 2>/dev/null || pwd):/w" --entrypoint sh \
    yamcs/example-simulation:5.13.5 -c '
        set -e
        cd /w
        rm -rf out/classes && mkdir -p out/classes
        javac --release 17 -cp "/opt/yamcs/lib/*:out/lib/*" -d out/classes $(find src -name "*.java")
        cp -r resources/. out/classes/
        jar --create --file out/lib/yamcs-grpc-0.1.0.jar -C out/classes .'

echo "built $(pwd)/out/lib/yamcs-grpc-0.1.0.jar"
