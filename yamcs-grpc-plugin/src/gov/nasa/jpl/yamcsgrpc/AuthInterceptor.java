package gov.nasa.jpl.yamcsgrpc;

import java.net.SocketAddress;
import java.util.Base64;
import java.util.concurrent.ExecutionException;

import org.yamcs.YamcsServer;
import org.yamcs.http.HttpServer;
import org.yamcs.http.UnauthorizedException;
import org.yamcs.security.AuthenticationException;
import org.yamcs.security.AuthenticationInfo;
import org.yamcs.security.SecurityStore;
import org.yamcs.security.User;
import org.yamcs.security.UsernamePasswordToken;

import io.grpc.Contexts;
import io.grpc.Grpc;
import io.grpc.Metadata;
import io.grpc.ServerCall;
import io.grpc.ServerCallHandler;
import io.grpc.ServerInterceptor;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;

/**
 * Turns the {@code authorization} header into a YAMCS {@link User}, the same way YAMCS's HttpHandler does for
 * HTTP: Basic credentials go through the security store, Bearer tokens through the HTTP server's token store, and
 * without a header the guest user is used if it is active (it is when security is disabled).
 */
final class AuthInterceptor implements ServerInterceptor {

    static final io.grpc.Context.Key<User> USER = io.grpc.Context.key("yamcs-user");
    static final io.grpc.Context.Key<String> CLIENT = io.grpc.Context.key("yamcs-client");

    private static final Metadata.Key<String> AUTHORIZATION = Metadata.Key.of("authorization",
            Metadata.ASCII_STRING_MARSHALLER);

    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(ServerCall<ReqT, RespT> call, Metadata headers,
            ServerCallHandler<ReqT, RespT> next) {
        User user;
        try {
            user = authenticate(headers.get(AUTHORIZATION));
        } catch (StatusRuntimeException e) {
            call.close(e.getStatus(), new Metadata());
            return new ServerCall.Listener<>() {
            };
        }
        SocketAddress remote = call.getAttributes().get(Grpc.TRANSPORT_ATTR_REMOTE_ADDR);
        io.grpc.Context ctx = io.grpc.Context.current()
                .withValue(USER, user)
                .withValue(CLIENT, remote != null ? remote.toString() : "grpc");
        return Contexts.interceptCall(ctx, call, headers, next);
    }

    private static User authenticate(String header) {
        SecurityStore securityStore = YamcsServer.getServer().getSecurityStore();
        if (securityStore.isEnabled() && header != null) {
            if (header.startsWith("Basic ")) {
                return basic(securityStore, header.substring("Basic ".length()));
            } else if (header.startsWith("Bearer ")) {
                return bearer(securityStore, header.substring("Bearer ".length()));
            }
            throw Status.UNAUTHENTICATED.withDescription("Unsupported authorization header").asRuntimeException();
        }
        if (securityStore.getGuestUser().isActive()) {
            return securityStore.getGuestUser();
        }
        throw Status.UNAUTHENTICATED.withDescription("Missing authentication").asRuntimeException();
    }

    private static User basic(SecurityStore securityStore, String encoded) {
        String[] parts;
        try {
            parts = new String(Base64.getDecoder().decode(encoded)).split(":", 2);
        } catch (IllegalArgumentException e) {
            throw Status.UNAUTHENTICATED.withDescription("Could not decode Basic credentials").asRuntimeException();
        }
        if (parts.length < 2) {
            throw Status.UNAUTHENTICATED.withDescription("Malformed Basic credentials").asRuntimeException();
        }
        try {
            AuthenticationInfo info = securityStore.login(new UsernamePasswordToken(parts[0], parts[1].toCharArray()))
                    .get();
            return securityStore.getUserFromCache(info.getUsername());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw Status.CANCELLED.asRuntimeException();
        } catch (ExecutionException e) {
            Status status = e.getCause() instanceof AuthenticationException ? Status.UNAUTHENTICATED : Status.INTERNAL;
            throw status.withDescription(String.valueOf(e.getCause().getMessage())).asRuntimeException();
        }
    }

    private static User bearer(SecurityStore securityStore, String token) {
        HttpServer httpServer = YamcsServer.getServer().getGlobalService(HttpServer.class);
        try {
            AuthenticationInfo info = httpServer.getTokenStore().verifyAccessToken(token);
            if (!securityStore.verifyValidity(info)) {
                throw Status.UNAUTHENTICATED.withDescription("Could not verify token").asRuntimeException();
            }
            return securityStore.getUserFromCache(info.getUsername());
        } catch (UnauthorizedException e) {
            throw Status.UNAUTHENTICATED.withDescription(e.getMessage()).asRuntimeException();
        }
    }
}
