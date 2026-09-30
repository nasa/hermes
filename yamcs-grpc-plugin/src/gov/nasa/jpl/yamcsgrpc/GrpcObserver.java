package gov.nasa.jpl.yamcsgrpc;

import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutionException;

import org.yamcs.api.Observer;
import org.yamcs.http.HttpException;

import com.google.protobuf.Message;

import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.ServerCallStreamObserver;

/**
 * Passes what a YAMCS API method emits to the gRPC caller.
 * <p>
 * YAMCS may call this from several threads, while grpc-java observers are not thread-safe, hence the locking.
 * <p>
 * TODO: YAMCS pushes without waiting. grpc-java buffers without limit when the client reads slower than YAMCS
 * sends. The WebSocket path drops low-priority frames in that case (WebSocketFrameDropper); this does not yet.
 */
final class GrpcObserver implements Observer<Message> {

    private final ServerCallStreamObserver<Message> out;
    private volatile Runnable cancelHandler;
    private volatile boolean cancelled;
    private boolean completed;

    GrpcObserver(ServerCallStreamObserver<Message> out) {
        this.out = out;
        // Must be registered before the handler returns
        out.setOnCancelHandler(() -> {
            cancelled = true;
            Runnable handler = cancelHandler;
            if (handler != null) {
                handler.run();
            }
        });
    }

    @Override
    public synchronized void next(Message message) {
        if (!completed && !cancelled) {
            out.onNext(message);
        }
    }

    @Override
    public synchronized void completeExceptionally(Throwable t) {
        if (!completed && !cancelled) {
            completed = true;
            out.onError(toStatus(t));
        }
    }

    @Override
    public synchronized void complete() {
        if (!completed && !cancelled) {
            completed = true;
            out.onCompleted();
        }
    }

    @Override
    public boolean isCancelled() {
        return cancelled;
    }

    @Override
    public void setCancelHandler(Runnable cancelHandler) {
        this.cancelHandler = cancelHandler;
        if (cancelled) {
            cancelHandler.run();
        }
    }

    static StatusRuntimeException toStatus(Throwable t) {
        if ((t instanceof CompletionException || t instanceof ExecutionException) && t.getCause() != null) {
            return toStatus(t.getCause());
        }
        if (t instanceof StatusRuntimeException) {
            return (StatusRuntimeException) t;
        }
        if (t instanceof HttpException) {
            int code = ((HttpException) t).getStatus().code();
            Status status = switch (code) {
            case 400 -> Status.INVALID_ARGUMENT;
            case 401 -> Status.UNAUTHENTICATED;
            case 403 -> Status.PERMISSION_DENIED;
            case 404 -> Status.NOT_FOUND;
            case 405, 501 -> Status.UNIMPLEMENTED;
            case 409 -> Status.ALREADY_EXISTS;
            case 429 -> Status.RESOURCE_EXHAUSTED;
            case 503 -> Status.UNAVAILABLE;
            default -> code >= 500 ? Status.INTERNAL : Status.UNKNOWN;
            };
            return status.withDescription(t.getMessage()).asRuntimeException();
        }
        return Status.INTERNAL.withDescription(String.valueOf(t)).withCause(t).asRuntimeException();
    }
}
