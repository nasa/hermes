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
        // The client is ready now, but "a" waits until grpc-java runs the ready handler, so "b" must wait behind it
        call.ready = true;
        obs.next(msg("b"));
        // YAMCS ends the call, but the end has to wait until "a" and "b" are sent
        obs.complete();
        assertEquals(List.of(), call.sent);
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
        AtomicInteger freed = new AtomicInteger();
        obs.setCancelHandler(freed::incrementAndGet);
        // The client isn't ready, so every message waits, and nine 1 MiB messages put it past the 8 MiB limit
        Message mib = BytesValue.of(ByteString.copyFrom(new byte[1024 * 1024]));
        for (int i = 0; i < 9; i++) {
            obs.next(mib);
        }
        assertEquals(List.of(Status.Code.RESOURCE_EXHAUSTED), call.sent);
        // If any of the nine were still waiting, the ready handler would send them now
        call.ready = true;
        call.onReady.run();
        assertEquals(1, call.sent.size());
        // GrpcObserver frees the subscription on another thread, so we wait up to a second for it
        for (int i = 0; i < 100 && freed.get() == 0; i++) {
            Thread.sleep(10);
        }
        assertEquals(1, freed.get());
        // grpc-java runs the close handler later, once it has sent the error. It must not free the subscription again.
        call.onClose.run();
        assertEquals(1, freed.get());
    }

    @Test
    void freesTheSubscriptionAndDropsWaitingMessagesWhenTheClientCancels() {
        FakeCall call = new FakeCall();
        GrpcObserver obs = new GrpcObserver(call);
        AtomicInteger freed = new AtomicInteger();
        obs.setCancelHandler(freed::incrementAndGet);
        obs.next(msg("a"));
        call.onCancel.run();
        // If "a" were still waiting, the ready handler would send it now
        call.ready = true;
        call.onReady.run();
        // The client is ready, so "b" would go straight out if GrpcObserver still took messages
        obs.next(msg("b"));
        assertEquals(List.of(), call.sent);
        assertEquals(1, freed.get());
    }
}
