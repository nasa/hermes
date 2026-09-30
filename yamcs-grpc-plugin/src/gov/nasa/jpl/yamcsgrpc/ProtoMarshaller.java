package gov.nasa.jpl.yamcsgrpc;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import com.google.protobuf.Message;

import io.grpc.MethodDescriptor.Marshaller;
import io.grpc.Status;

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
            throw Status.INVALID_ARGUMENT.withDescription("Could not decode request: " + e.getMessage())
                    .withCause(e)
                    .asRuntimeException();
        }
    }
}
