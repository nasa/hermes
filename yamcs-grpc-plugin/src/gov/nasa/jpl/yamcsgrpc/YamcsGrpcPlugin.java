package gov.nasa.jpl.yamcsgrpc;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.yamcs.Plugin;
import org.yamcs.PluginException;
import org.yamcs.Spec;
import org.yamcs.Spec.OptionType;
import org.yamcs.YConfiguration;
import org.yamcs.logging.Log;

import io.grpc.Grpc;
import io.grpc.InsecureServerCredentials;
import io.grpc.Server;

/**
 * Serves the YAMCS API over gRPC, using the YAMCS .proto service definitions as-is.
 * <p>
 * There is no generated server code: every call is looked up by name and handed to the same {@code Api}
 * implementation that answers YAMCS's HTTP and WebSocket requests.
 */
public class YamcsGrpcPlugin implements Plugin {

    private static final Log log = new Log(YamcsGrpcPlugin.class);

    private Server server;

    @Override
    public Spec getSpec() {
        Spec spec = new Spec();
        spec.addOption("port", OptionType.INTEGER).withDefault(8091);
        return spec;
    }

    @Override
    public void onLoad(YConfiguration config) throws PluginException {
        int port = config.getInt("port", 8091);
        try {
            server = Grpc.newServerBuilderForPort(port, InsecureServerCredentials.create())
                    .fallbackHandlerRegistry(new YamcsMethodRegistry())
                    .intercept(new AuthInterceptor())
                    .maxInboundMessageSize(64 * 1024 * 1024)
                    .build()
                    .start();
        } catch (IOException e) {
            throw new PluginException("Could not start gRPC server on port " + port + ": " + e.getMessage());
        }
        log.info("gRPC API listening on port {}", port);

        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            try {
                server.shutdownNow().awaitTermination(2, TimeUnit.SECONDS);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }));
    }
}
