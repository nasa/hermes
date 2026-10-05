package gov.nasa.jpl.yamcsgrpc;

import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.yamcs.YamcsServer;
import org.yamcs.api.Api;
import org.yamcs.api.Observer;
import org.yamcs.http.BadRequestException;
import org.yamcs.http.Context;
import org.yamcs.http.GrpcContext;
import org.yamcs.http.HttpServer;

import com.google.protobuf.Descriptors.MethodDescriptor;
import com.google.protobuf.Descriptors.ServiceDescriptor;
import com.google.protobuf.Message;

import io.grpc.HandlerRegistry;
import io.grpc.MethodDescriptor.MethodType;
import io.grpc.ServerCallHandler;
import io.grpc.ServerMethodDefinition;
import io.grpc.stub.ServerCallStreamObserver;
import io.grpc.stub.ServerCalls;
import io.grpc.stub.StreamObserver;

/**
 * Resolves gRPC method names ({@code package.Service/Method}) to the YAMCS {@link Api} that implements them.
 * <p>
 * Lookups happen on the first call, so it does not matter whether the HTTP server has registered its APIs by the
 * time the plugin loads.
 */
final class YamcsMethodRegistry extends HandlerRegistry {

    private final Map<String, ServerMethodDefinition<?, ?>> cache = new ConcurrentHashMap<>();

    @Override
    public ServerMethodDefinition<?, ?> lookupMethod(String methodName, String authority) {
        return cache.computeIfAbsent(methodName, YamcsMethodRegistry::resolve);
    }

    private static ServerMethodDefinition<Message, Message> resolve(String fullMethodName) {
        int slash = fullMethodName.lastIndexOf('/');
        if (slash < 0) {
            return null;
        }
        String serviceName = fullMethodName.substring(0, slash);
        String methodName = fullMethodName.substring(slash + 1);

        HttpServer httpServer = YamcsServer.getServer().getGlobalService(HttpServer.class);
        if (httpServer == null) {
            return null;
        }
        for (Api<Context> api : apis(httpServer)) {
            ServiceDescriptor service = api.getDescriptorForType();
            if (service.getFullName().equals(serviceName)) {
                MethodDescriptor method = service.findMethodByName(methodName);
                return method != null ? define(httpServer, api, method, fullMethodName) : null;
            }
        }
        return null;
    }

    private static Set<Api<Context>> apis(HttpServer httpServer) {
        Set<Api<Context>> apis = new LinkedHashSet<>();
        httpServer.getRoutes().forEach(route -> apis.add(route.getApi()));
        httpServer.getTopics().forEach(topic -> apis.add(topic.getApi()));
        return apis;
    }

    private static ServerMethodDefinition<Message, Message> define(HttpServer httpServer, Api<Context> api,
            MethodDescriptor method, String fullMethodName) {
        MethodType type;
        if (method.isClientStreaming()) {
            type = method.isServerStreaming() ? MethodType.BIDI_STREAMING : MethodType.CLIENT_STREAMING;
        } else {
            type = method.isServerStreaming() ? MethodType.SERVER_STREAMING : MethodType.UNARY;
        }

        io.grpc.MethodDescriptor<Message, Message> grpcMethod = io.grpc.MethodDescriptor.<Message, Message> newBuilder()
                .setType(type)
                .setFullMethodName(fullMethodName)
                .setRequestMarshaller(new ProtoMarshaller(api.getRequestPrototype(method)))
                .setResponseMarshaller(new ProtoMarshaller(api.getResponsePrototype(method)))
                .build();

        ServerCallHandler<Message, Message> handler = switch (type) {
        case UNARY -> ServerCalls.asyncUnaryCall((req, obs) -> call(httpServer, api, method, req, obs));
        case SERVER_STREAMING -> ServerCalls.asyncServerStreamingCall(
                (req, obs) -> call(httpServer, api, method, req, obs));
        // Client-streaming calls end when the client half-closes, like an HTTP request body ending.
        case CLIENT_STREAMING -> ServerCalls.asyncClientStreamingCall(
                obs -> stream(httpServer, api, method, obs, true));
        // Bidirectional calls are YAMCS WebSocket subscriptions. Those only end on cancel, so a
        // half-close means "no more requests" and the subscription keeps running.
        case BIDI_STREAMING -> ServerCalls.asyncBidiStreamingCall(
                obs -> stream(httpServer, api, method, obs, false));
        default -> throw new IllegalStateException("Unknown method type " + type);
        };
        return ServerMethodDefinition.create(grpcMethod, handler);
    }

    private static GrpcContext newContext(HttpServer httpServer, Api<Context> api, MethodDescriptor method) {
        return new GrpcContext(httpServer, AuthInterceptor.USER.get(), api, method, AuthInterceptor.CLIENT.get());
    }

    private static void call(HttpServer httpServer, Api<Context> api, MethodDescriptor method, Message request,
            StreamObserver<Message> responseObserver) {
        GrpcObserver out = new GrpcObserver((ServerCallStreamObserver<Message>) responseObserver);
        try {
            // YAMCS's HTTP routes reject a page size above maxPageSize before calling the Api, so do the same
            var limit = request.getDescriptorForType().findFieldByName("limit");
            if (limit != null && request.hasField(limit)
                    && ((Number) request.getField(limit)).intValue() > httpServer.getConfig().getInt("maxPageSize")) {
                throw new BadRequestException("Limit parameter is too large");
            }
            api.callMethod(method, newContext(httpServer, api, method), request, out);
        } catch (Throwable t) {
            out.completeExceptionally(t);
        }
    }

    private static StreamObserver<Message> stream(HttpServer httpServer, Api<Context> api, MethodDescriptor method,
            StreamObserver<Message> responseObserver, boolean clientStreaming) {
        GrpcObserver out = new GrpcObserver((ServerCallStreamObserver<Message>) responseObserver);
        Observer<Message> in;
        try {
            in = api.callMethod(method, newContext(httpServer, api, method), out);
        } catch (Throwable t) {
            out.completeExceptionally(t);
            // The call has already failed, so we ignore anything the client still sends.
            return new StreamObserver<>() {
                @Override
                public void onNext(Message value) {
                }

                @Override
                public void onError(Throwable t) {
                }

                @Override
                public void onCompleted() {
                }
            };
        }
        return new StreamObserver<>() {
            @Override
            public void onNext(Message request) {
                try {
                    in.next(request);
                } catch (Throwable t) {
                    // As over HTTP, a client-streaming API gets the error so it can clean up and fail the call
                    // itself (WriteRows closes its table stream). Subscriptions don't end the call, so we do.
                    if (clientStreaming) {
                        in.completeExceptionally(t);
                    } else {
                        out.completeExceptionally(t);
                    }
                }
            }

            @Override
            public void onError(Throwable t) {
                // The client cancelled. GrpcObserver already ran the API's cancel handler.
            }

            @Override
            public void onCompleted() {
                if (clientStreaming) {
                    in.complete();
                }
            }
        };
    }
}
