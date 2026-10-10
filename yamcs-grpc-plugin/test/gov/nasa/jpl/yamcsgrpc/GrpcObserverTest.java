package gov.nasa.jpl.yamcsgrpc;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;

import com.google.protobuf.ByteString;
import com.google.protobuf.BytesValue;
import com.google.protobuf.Message;
import com.google.protobuf.StringValue;

import io.grpc.Status;
import io.grpc.stub.ServerCallStreamObserver;

class GrpcObserverTest {

    // Stands in for grpc-java's side of one call. It records what GrpcObserver sends, lets a test set whether the
    // client is ready, and keeps the handlers GrpcObserver registers so a test can run each one when grpc-java would.
    static class FakeCall extends ServerCallStreamObserver<Message> {
        final List<Object> sent = new ArrayList<>();
        boolean ready;
        Runnable onReady, onCancel, onClose;

        @Override public boolean isReady() { return ready; }
        @Override public void onNext(Message m) { sent.add(m); }
        @Override public void onError(Throwable t) { sent.add(Status.fromThrowable(t).getCode()); }
        @Override public void onCompleted() { sent.add("completed"); }
        @Override public void setOnReadyHandler(Runnable r) { onReady = r; }
        @Override public void setOnCancelHandler(Runnable r) { onCancel = r; }
        @Override public void setOnCloseHandler(Runnable r) { onClose = r; }
        // ServerCallStreamObserver makes us implement the rest, but GrpcObserver never calls them
        @Override public boolean isCancelled() { return false; }
        @Override public void setCompression(String c) { }
        @Override public void disableAutoInboundFlowControl() { }
        @Override public void request(int n) { }
        @Override public void setMessageCompression(boolean e) { }
    }

    // GrpcObserver forwards any protobuf message, so we use protobuf's built-in one that holds a string
    static Message msg(String s) {
        return StringValue.of(s);
    }

    @Test
    void sendsWaitingMessagesInOrderThenEndsTheCallAndFreesTheSubscription() {
        FakeCall call = new FakeCall();
        GrpcObserver obs = new GrpcObserver(call);
        // YAMCS frees a subscription in the cancel handler it sets on the observer, so we count how often that runs
        AtomicInteger freed = new AtomicInteger();
        obs.setCancelHandler(freed::incrementAndGet);

        // The client isn't ready yet, so "a" waits
        obs.next(msg("a"));

        // The client turns ready, but "a" waits until grpc-java runs the ready handler, so "b" must wait behind it
        call.ready = true;
        obs.next(msg("b"));

        // YAMCS ends the call. The end has to wait behind "a" and "b", so nothing has been sent yet.
        obs.complete();
        assertEquals(List.of(), call.sent);

        // grpc-java runs the ready handler, and GrpcObserver sends everything in order
        call.onReady.run();
        assertEquals(List.of(msg("a"), msg("b"), "completed"), call.sent);

        // Once grpc-java has sent all of that it runs the close handler, which frees the subscription
        call.onClose.run();
        assertEquals(1, freed.get());
    }

    @Test
    void endsTheCallWhenTheClientFallsTooFarBehindAndFreesTheSubscriptionOnce() throws Exception {
        FakeCall call = new FakeCall();
        GrpcObserver obs = new GrpcObserver(call);
        // Counts how often YAMCS would free the subscription
        AtomicInteger freed = new AtomicInteger();
        obs.setCancelHandler(freed::incrementAndGet);

        // The client isn't ready, so GrpcObserver holds each message. Once more than 8 MiB are waiting, it drops
        // them all, ends the call with an error and ignores any later message. Nine 1 MiB messages get us there.
        Message mib = BytesValue.of(ByteString.copyFrom(new byte[1024 * 1024]));
        for (int i = 0; i < 9; i++) {
            obs.next(mib);
        }
        assertEquals(List.of(Status.Code.RESOURCE_EXHAUSTED), call.sent);

        // The client turns ready. If any message were still waiting, GrpcObserver would send it now, so we check
        // that the error is still all the client was sent.
        call.ready = true;
        call.onReady.run();
        assertEquals(1, call.sent.size());

        // GrpcObserver frees the subscription on another thread, so we wait up to a second for it
        for (int i = 0; i < 100 && freed.get() == 0; i++) {
            Thread.sleep(10);
        }
        assertEquals(1, freed.get());

        // Last, grpc-java runs the close handler, as it does once it has sent the error. That must not free the
        // subscription a second time.
        call.onClose.run();
        assertEquals(1, freed.get());
    }

    @Test
    void freesTheSubscriptionAndDropsWaitingMessagesWhenTheClientCancels() {
        FakeCall call = new FakeCall();
        GrpcObserver obs = new GrpcObserver(call);
        // Counts how often YAMCS would free the subscription
        AtomicInteger freed = new AtomicInteger();
        obs.setCancelHandler(freed::incrementAndGet);

        // The client isn't ready, so "a" waits. Then the client cancels the call.
        obs.next(msg("a"));
        call.onCancel.run();

        // The client turns ready. If "a" were still waiting, GrpcObserver would send it now.
        call.ready = true;
        call.onReady.run();

        // YAMCS sends "b", which would go straight out if GrpcObserver still took messages
        obs.next(msg("b"));

        // Nothing reached the client, and the cancel freed the subscription once
        assertEquals(List.of(), call.sent);
        assertEquals(1, freed.get());
    }
}
