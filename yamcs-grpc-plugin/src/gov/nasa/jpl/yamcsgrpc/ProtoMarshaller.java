package gov.nasa.jpl.yamcsgrpc;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;

import com.google.protobuf.Message;

import io.grpc.MethodDescriptor.Marshaller;

/**
 * Protobuf (de)serialization using the protobuf-java that ships with YAMCS, so grpc-protobuf is not needed.
 */
final class ProtoMarshaller implements Marshaller<Message> {

    private final Message prototype;

    ProtoMarshaller(Message prototype) {
        this.prototype = prototype;
    }

    @Override
    public InputStream stream(Message value) {
        return new ByteArrayInputStream(value.toByteArray());
    }

    @Override
    public Message parse(InputStream stream) {
        try {
            return prototype.getParserForType().parseFrom(stream);
        } catch (IOException e) {
            // grpc-java fails the call with UNKNOWN whatever we throw, so a gRPC status here never reaches the client
            throw new UncheckedIOException("Could not decode request", e);
        }
    }
}
