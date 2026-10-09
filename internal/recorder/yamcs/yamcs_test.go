package yamcs

import (
	"cmp"
	"context"
	"io"
	"net"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/proto"

	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/mdb"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/services"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/yamcsManagement"
)

// Runs against a YAMCS server with the yamcs-grpc plugin and live telemetry,
// e.g. YAMCS_GRPC_ADDRESS=localhost:8091. YAMCS_INSTANCE defaults to
// fprime-project.
func TestSubscribeTelemetered(t *testing.T) {
	addr := os.Getenv("YAMCS_GRPC_ADDRESS")
	if addr == "" {
		t.Skip("YAMCS_GRPC_ADDRESS not set")
	}
	conn, err := Dial(addr)
	require.NoError(t, err)
	defer conn.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	instance := cmp.Or(os.Getenv("YAMCS_INSTANCE"), "fprime-project")

	names, err := TelemeteredParameters(ctx, conn, instance)
	require.NoError(t, err)
	t.Logf("%d TELEMETERED parameters", len(names))
	require.NotEmpty(t, names)
	for _, n := range names {
		assert.False(t, strings.HasPrefix(n, "/yamcs/"), "system parameter %s listed", n)
	}

	stream, err := Subscribe(ctx, conn, instance, "realtime", names)
	require.NoError(t, err)
	mapped := make(map[uint32]string)
	for {
		data, err := stream.Recv()
		require.NoError(t, err)
		require.Empty(t, data.GetInvalid())
		for id, n := range data.GetMapping() {
			mapped[id] = n.GetName()
		}
		if len(data.GetValues()) > 0 {
			require.Contains(t, mapped, data.GetValues()[0].GetNumericId())
			break
		}
	}
	assert.Len(t, mapped, len(names))
}

// Raises one event with CreateEvent. It stays in the instance's archive.
func TestSubscribeEvents(t *testing.T) {
	addr := os.Getenv("YAMCS_GRPC_ADDRESS")
	if addr == "" {
		t.Skip("YAMCS_GRPC_ADDRESS not set")
	}
	conn, err := Dial(addr)
	require.NoError(t, err)
	defer conn.Close()
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()
	instance := cmp.Or(os.Getenv("YAMCS_INSTANCE"), "fprime-project")

	stream, err := SubscribeEvents(ctx, conn, instance)
	require.NoError(t, err)
	// YAMCS does not acknowledge the subscription, so give it time to start.
	time.Sleep(time.Second)
	created, err := events.NewEventsApiClient(conn).CreateEvent(ctx, &events.CreateEventRequest{
		Instance: proto.String(instance),
		Source:   proto.String("yamcs-recorder test"),
		Message:  proto.String(t.Name()),
	})
	require.NoError(t, err)

	// Other sources may raise events first.
	for {
		e, err := stream.Recv()
		require.NoError(t, err)
		if e.GetSource() == created.GetSource() && e.GetSeqNumber() == created.GetSeqNumber() {
			t.Logf("received %s #%d: %s", e.GetSource(), e.GetSeqNumber(), e.GetMessage())
			assert.Equal(t, t.Name(), e.GetMessage())
			return
		}
	}
}

// serve starts an in-process gRPC server, lets register add the fake YAMCS
// services a test needs, and connects to it with Dial.
func serve(t *testing.T, register func(*grpc.Server)) *grpc.ClientConn {
	t.Helper()
	lis, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)
	server := grpc.NewServer()
	register(server)
	go server.Serve(lis)
	t.Cleanup(server.Stop)
	conn, err := Dial(lis.Addr().String())
	require.NoError(t, err)
	t.Cleanup(func() { conn.Close() })
	return conn
}

// mdbServer answers each ListParameters request with the page its continuation
// token names. YAMCS lists every source when the request names none, so we
// reject requests that don't ask for TELEMETERED.
type mdbServer struct {
	mdb.UnimplementedMdbApiServer
	pages map[string]*mdb.ListParametersResponse
}

func (s mdbServer) ListParameters(_ context.Context, req *mdb.ListParametersRequest) (*mdb.ListParametersResponse, error) {
	// TELEMETERED is the enum's zero value, so GetSource can't tell it from unset.
	if req.Source == nil || *req.Source != mdb.DataSourceType_TELEMETERED {
		return nil, status.Error(codes.InvalidArgument, "want TELEMETERED")
	}
	return s.pages[req.GetNext()], nil
}

func TestTelemeteredParametersFollowsPages(t *testing.T) {
	param := func(name string) *mdb.ParameterInfo { return &mdb.ParameterInfo{QualifiedName: proto.String(name)} }
	conn := serve(t, func(s *grpc.Server) {
		mdb.RegisterMdbApiServer(s, mdbServer{pages: map[string]*mdb.ListParametersResponse{
			"":   {Parameters: []*mdb.ParameterInfo{param("/Ref/a"), param("/Ref/b")}, ContinuationToken: proto.String("p2")},
			"p2": {Parameters: []*mdb.ParameterInfo{param("/Ref/c")}},
		}})
	})
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	names, err := TelemeteredParameters(ctx, conn, "fprime-project")
	require.NoError(t, err)
	assert.Equal(t, []string{"/Ref/a", "/Ref/b", "/Ref/c"}, names)
}

// processingServer acts like YAMCS while the instance restarts: the parameter
// stream stays open but silent, and the processor watch sends states, then
// ends with err.
type processingServer struct {
	processing.UnimplementedProcessingApiServer
	states []services.ServiceState
	err    error
}

func (processingServer) SubscribeParameters(stream processing.ProcessingApi_SubscribeParametersServer) error {
	<-stream.Context().Done()
	return nil
}

func (s processingServer) SubscribeProcessors(_ *processing.SubscribeProcessorsRequest, stream processing.ProcessingApi_SubscribeProcessorsServer) error {
	for _, state := range s.states {
		if err := stream.Send(&yamcsManagement.ProcessorInfo{State: state.Enum()}); err != nil {
			return err
		}
	}
	return s.err
}

func TestSubscribeEndsWhenProcessorStops(t *testing.T) {
	// Each case sends RUNNING first, which Subscribe should ignore.
	running := services.ServiceState_RUNNING
	for _, tc := range []struct {
		server processingServer
		want   string
	}{
		{processingServer{states: []services.ServiceState{running, services.ServiceState_STOPPING}}, "processor realtime is STOPPING"},
		{processingServer{states: []services.ServiceState{running}, err: status.Error(codes.Unavailable, "restarting")}, "processor watch ended"},
	} {
		t.Run(tc.want, func(t *testing.T) {
			conn := serve(t, func(s *grpc.Server) { processing.RegisterProcessingApiServer(s, tc.server) })

			// We give Subscribe a context without a deadline and time the wait
			// ourselves. If Subscribe didn't close the parameter stream when the
			// watch ended, a deadline would close it for us, Recv would still
			// return the watch's reason, and the test would pass.
			stream, err := Subscribe(t.Context(), conn, "fprime-project", "realtime", []string{"/Ref/a"})
			require.NoError(t, err)
			errs := make(chan error, 1)
			go func() { _, err := stream.Recv(); errs <- err }()
			select {
			case err := <-errs:
				assert.ErrorContains(t, err, tc.want)
			case <-time.After(5 * time.Second):
				t.Fatal("parameter stream still open 5s after the processor watch ended")
			}
		})
	}
}

// eventsServer acts like YAMCS's event subscription. With err set, it rejects
// the stream at once. Otherwise it reads the request, rejects it unless it
// names fprime-project, then sends the events in sent and ends the stream.
type eventsServer struct {
	events.UnimplementedEventsApiServer
	sent []*events.Event
	err  error
}

func (s eventsServer) SubscribeEvents(stream events.EventsApi_SubscribeEventsServer) error {
	if s.err != nil {
		return s.err
	}
	req, err := stream.Recv()
	if err != nil {
		return err
	}
	if req.GetInstance() != "fprime-project" {
		return status.Error(codes.NotFound, "want fprime-project")
	}
	for _, e := range s.sent {
		if err := stream.Send(e); err != nil {
			return err
		}
	}
	return nil
}

func TestSubscribeEventsStreamsInstanceEvents(t *testing.T) {
	sent := []*events.Event{
		{Message: proto.String("[OpCodeDispatched] Opcode 0x1000000 dispatched to port 4")},
		{Message: proto.String("Sequence count jump for APID: 4 old seq: 0 newseq: 0")},
	}
	conn := serve(t, func(s *grpc.Server) { events.RegisterEventsApiServer(s, eventsServer{sent: sent}) })
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	stream, err := SubscribeEvents(ctx, conn, "fprime-project")
	require.NoError(t, err)
	for _, want := range sent {
		e, err := stream.Recv()
		require.NoError(t, err)
		assert.Equal(t, want.GetMessage(), e.GetMessage())
	}
	_, err = stream.Recv()
	assert.ErrorIs(t, err, io.EOF)
}

// answeredConn makes each new stream wait for the server's first reply. A
// server that rejects the stream replies by ending it, so the Send in
// SubscribeEvents returns io.EOF and SubscribeEvents has to get the real error
// from Recv. Without the wait, Send goes out before the rejection arrives, so
// SubscribeEvents returns no error and that io.EOF path goes untested.
type answeredConn struct{ *grpc.ClientConn }

func (c answeredConn) NewStream(ctx context.Context, desc *grpc.StreamDesc, method string, opts ...grpc.CallOption) (grpc.ClientStream, error) {
	stream, err := c.ClientConn.NewStream(ctx, desc, method, opts...)
	if err == nil {
		stream.Header() // blocks until the server sends headers or ends the stream
	}
	return stream, err
}

func TestSubscribeEventsReturnsRejection(t *testing.T) {
	conn := serve(t, func(s *grpc.Server) {
		events.RegisterEventsApiServer(s, eventsServer{err: status.Error(codes.NotFound, "no instance")})
	})
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := SubscribeEvents(ctx, answeredConn{conn}, "fprime-project")
	assert.Equal(t, codes.NotFound, status.Code(err), err)
}
