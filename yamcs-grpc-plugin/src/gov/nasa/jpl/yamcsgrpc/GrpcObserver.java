package gov.nasa.jpl.yamcsgrpc;

import java.util.ArrayDeque;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.atomic.AtomicBoolean;

import org.yamcs.api.Observer;
import org.yamcs.http.HttpException;
import org.yamcs.http.InternalServerErrorException;
import org.yamcs.logging.Log;

import com.google.protobuf.Message;

import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.stub.ServerCallStreamObserver;

/**
 * Passes what a YAMCS API method emits to the gRPC caller.
 * <p>
 * YAMCS may call this from several threads, while grpc-java observers are not thread-safe, hence the locking.
 * <p>
 * YAMCS pushes without waiting. Whatever grpc-java has queued stays in memory until the client reads it or disconnects,
 * so while the client isn't ready for more we hold messages here instead. If it falls too far behind, we drop them and
 * end the call, much as YAMCS's WebSocket path drops slow clients (WebSocketFrameDropper).
 */
final class GrpcObserver implements Observer<Message> {

    private static final Log log = new Log(GrpcObserver.class);

    // How far a client may fall behind before we end its call. YAMCS's WebSocket path allows 128 KiB. We allow more
    // because clients such as yamcs-recorder stop reading while they write each message to a database.
    private static final long MAX_BACKLOG_BYTES = 8 * 1024 * 1024;

    private final ServerCallStreamObserver<Message> out;
    private volatile Runnable cancelHandler;
    private final AtomicBoolean cancelHandlerRan = new AtomicBoolean();
    private volatile boolean cancelled;
    private boolean completed;
    // Messages waiting for the client to be ready
    private final ArrayDeque<Message> backlog = new ArrayDeque<>();
    private long backlogBytes;
    // How to end the call once the backlog is sent, if YAMCS ended it while messages were still waiting
    private Runnable endAfterBacklog;

    GrpcObserver(ServerCallStreamObserver<Message> out) {
        this.out = out;
        // grpc-java accepts these callbacks (call cancelled, call closed, client ready for more) only while the call
        // is being set up, which is when YAMCS creates this observer. YAMCS frees a subscription only from its cancel
        // handler, so we run that handler whether the client cancels or we end the call ourselves. grpc-java fires
        // exactly one of the cancel and close callbacks.
        out.setOnCancelHandler(() -> {
            cancelled = true;
            dropBacklog();
            runCancelHandler();
        });
        out.setOnCloseHandler(this::runCancelHandler);
        out.setOnReadyHandler(this::sendBacklog);
    }

    private void runCancelHandler() {
        Runnable handler = cancelHandler;
        if (handler != null && cancelHandlerRan.compareAndSet(false, true)) {
            handler.run();
        }
    }

    private synchronized void sendBacklog() {
        while (!backlog.isEmpty() && out.isReady()) {
            Message message = backlog.poll();
            backlogBytes -= message.getSerializedSize();
            out.onNext(message);
        }
        if (backlog.isEmpty() && endAfterBacklog != null) {
            Runnable end = endAfterBacklog;
            endAfterBacklog = null;
            end.run();
        }
    }

    private synchronized void dropBacklog() {
        backlog.clear();
        backlogBytes = 0;
        endAfterBacklog = null;
    }

    @Override
    public synchronized void next(Message message) {
        if (completed || cancelled) {
            return;
        }
        if (backlog.isEmpty() && out.isReady()) {
            out.onNext(message);
            return;
        }
        backlog.add(message);
        backlogBytes += message.getSerializedSize();
        if (backlogBytes > MAX_BACKLOG_BYTES) {
            dropBacklog();
            completed = true;
            out.onError(Status.RESOURCE_EXHAUSTED.withDescription("client fell too far behind").asRuntimeException());
            // grpc-java runs our close handler only once the client reads that error, which a stalled client may
            // never do, so we free the YAMCS subscription now. YAMCS is calling us from the thread that processes
            // its telemetry, so we do it on another thread.
            CompletableFuture.runAsync(this::runCancelHandler);
        }
    }

    @Override
    public synchronized void completeExceptionally(Throwable t) {
        if (!completed && !cancelled) {
            completed = true;
            StatusRuntimeException status = toStatus(t);
            endAfter(() -> out.onError(status));
        }
    }

    @Override
    public synchronized void complete() {
        if (!completed && !cancelled) {
            completed = true;
            endAfter(out::onCompleted);
        }
    }

    // Ends the call now, or once the client has been sent the backlog
    private void endAfter(Runnable end) {
        if (backlog.isEmpty()) {
            end.run();
        } else {
            endAfterBacklog = end;
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
            runCancelHandler();
        }
    }

    private static StatusRuntimeException toStatus(Throwable t) {
        if ((t instanceof CompletionException || t instanceof ExecutionException) && t.getCause() != null) {
            return toStatus(t.getCause());
        }
        if (t instanceof StatusRuntimeException e) {
            return e;
        }
        if (t instanceof HttpException e) {
            // APIs wrap unexpected failures in this, and YAMCS logs those over HTTP, so we do too
            if (t instanceof InternalServerErrorException) {
                log.error("Internal error while handling gRPC call", t);
            }
            Status status = switch (e.getStatus().code()) {
            case 400 -> Status.INVALID_ARGUMENT;
            case 401 -> Status.UNAUTHENTICATED;
            case 403 -> Status.PERMISSION_DENIED;
            case 404 -> Status.NOT_FOUND;
            case 405, 501 -> Status.UNIMPLEMENTED;
            case 409 -> Status.ALREADY_EXISTS;
            case 429 -> Status.RESOURCE_EXHAUSTED;
            case 503 -> Status.UNAVAILABLE;
            default -> e.isServerError() ? Status.INTERNAL : Status.UNKNOWN;
            };
            return status.withDescription(e.getMessage()).asRuntimeException();
        }
        log.error("Internal error while handling gRPC call", t);
        return Status.INTERNAL.withDescription(String.valueOf(t)).withCause(t).asRuntimeException();
    }
}
