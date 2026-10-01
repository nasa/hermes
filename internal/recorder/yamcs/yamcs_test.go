package yamcs

import (
	"context"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Runs against a YAMCS server with the yamcs-grpc plugin and live telemetry,
// e.g. YAMCS_GRPC_ADDRESS=localhost:8095 with BigData on fprime-project.
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

	names, err := TelemeteredParameters(ctx, conn, "fprime-project")
	require.NoError(t, err)
	t.Logf("%d TELEMETERED parameters", len(names))
	require.NotEmpty(t, names)
	for _, n := range names {
		assert.False(t, strings.HasPrefix(n, "/yamcs/"), "system parameter %s listed", n)
	}

	stream, err := Subscribe(ctx, conn, "fprime-project", "realtime", names)
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
