package yamcs

import (
	"cmp"
	"context"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"google.golang.org/protobuf/proto"

	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
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
