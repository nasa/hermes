package gov.nasa.jpl.yamcsgrpc;

import java.io.IOException;

import org.yamcs.Plugin;
import org.yamcs.PluginException;
import org.yamcs.Spec;
import org.yamcs.Spec.OptionType;
import org.yamcs.YConfiguration;
import org.yamcs.logging.Log;

import io.grpc.Grpc;
import io.grpc.InsecureServerCredentials;

/**
 * Serves the YAMCS API over gRPC, using the YAMCS .proto service definitions as-is.
 * <p>
 * There is no generated server code. Each call is looked up by name and handed to the same {@code Api}
 * implementation that answers YAMCS's HTTP and WebSocket requests.
 */
public class YamcsGrpcPlugin implements Plugin {

    private static final Log log = new Log(YamcsGrpcPlugin.class);

    @Override
    public Spec getSpec() {
        Spec spec = new Spec();
        spec.addOption("port", OptionType.INTEGER).withDefault(8091);
        return spec;
    }

    @Override
    public void onLoad(YConfiguration config) throws PluginException {
        int port = config.getInt("port");
        try {
            // addService needs every service listed when the server starts, but other plugins, such as yamcs-web,
            // add their APIs as they load, possibly after this one. A fallback registry looks each method up by name
            // on its first call instead.
            Grpc.newServerBuilderForPort(port, InsecureServerCredentials.create())
                    .fallbackHandlerRegistry(new YamcsMethodRegistry())
                    .intercept(new AuthInterceptor())
                    .build()
                    .start();
        } catch (IOException e) {
            throw new PluginException("Could not start gRPC server on port " + port, e);
        }
        log.info("gRPC API listening on port {}", port);
        // We leave the server running at shutdown. Its threads don't keep the JVM alive, and shutdownNow
        // would end subscriptions with CANCELLED, which looks to a client like it cancelled them itself.
    }
}
