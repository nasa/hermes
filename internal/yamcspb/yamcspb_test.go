package yamcspb_test

import (
	"context"
	"os"
	"testing"
	"time"

	"github.com/nasa/hermes/internal/yamcspb/protobuf/mdb"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/proto"
)

// Runs against a YAMCS server with the yamcs-grpc plugin, e.g. YAMCS_GRPC_ADDRESS=localhost:8095.
func TestListParameters(t *testing.T) {
	addr := os.Getenv("YAMCS_GRPC_ADDRESS")
	if addr == "" {
		t.Skip("YAMCS_GRPC_ADDRESS not set")
	}

	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	require.NoError(t, err)
	defer conn.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	resp, err := mdb.NewMdbApiClient(conn).ListParameters(ctx, &mdb.ListParametersRequest{
		Instance: proto.String("fprime-project"),
	})
	require.NoError(t, err)
	require.NotEmpty(t, resp.GetParameters())
	t.Logf("%d parameters, first %s", len(resp.GetParameters()), resp.GetParameters()[0].GetQualifiedName())
}
