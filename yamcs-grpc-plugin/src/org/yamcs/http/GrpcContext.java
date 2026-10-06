package org.yamcs.http;

import org.yamcs.api.Api;
import org.yamcs.security.User;

import com.google.protobuf.Descriptors.MethodDescriptor;

/**
 * Per-call context for API methods invoked over gRPC.
 * <p>
 * Lives in {@code org.yamcs.http} because the {@link Context} constructor is package-private. There is no Netty
 * channel behind a gRPC call (grpc-java uses its own shaded Netty), so {@code nettyContext} is null.
 */
public class GrpcContext extends Context {

    private final MethodDescriptor method;
    private final String clientAddress;

    public GrpcContext(HttpServer httpServer, User user, Api<Context> api, MethodDescriptor method,
            String clientAddress) {
        super(httpServer, null, user, api);
        this.method = method;
        this.clientAddress = clientAddress;
    }

    @Override
    public MethodDescriptor getMethod() {
        return method;
    }

    @Override
    public String getClientAddress() {
        return clientAddress;
    }
}
