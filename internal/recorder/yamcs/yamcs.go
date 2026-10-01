// Package yamcs subscribes the recorder to YAMCS parameters through the
// yamcs-grpc plugin.
package yamcs

import (
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/protobuf/proto"

	"github.com/nasa/hermes/internal/yamcspb/protobuf"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/mdb"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
)

// Dial returns a client for the plugin at addr. It connects lazily.
func Dial(addr string) (*grpc.ClientConn, error) {
	return grpc.NewClient(addr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		// grpc-java's default; the plugin answers more frequent pings with
		// GOAWAY too_many_pings.
		grpc.WithKeepaliveParams(keepalive.ClientParameters{Time: 5 * time.Minute}),
		// The plugin's message size limit.
		grpc.WithDefaultCallOptions(grpc.MaxCallRecvMsgSize(64<<20)),
	)
}

// TelemeteredParameters returns the qualified names of every TELEMETERED
// parameter of instance.
func TelemeteredParameters(ctx context.Context, conn grpc.ClientConnInterface, instance string) ([]string, error) {
	client := mdb.NewMdbApiClient(conn)
	req := &mdb.ListParametersRequest{
		Instance: proto.String(instance),
		Source:   mdb.DataSourceType_TELEMETERED.Enum(),
	}
	var names []string
	for {
		resp, err := client.ListParameters(ctx, req)
		if err != nil {
			return nil, fmt.Errorf("failed to list parameters of %s: %w", instance, err)
		}
		for _, p := range resp.GetParameters() {
			names = append(names, p.GetQualifiedName())
		}
		if resp.GetContinuationToken() == "" {
			return names, nil
		}
		req.Next = resp.ContinuationToken
	}
}

// Subscribe subscribes to names on processor. YAMCS first sends the last value
// of each parameter it has cached, then values as they change. Names YAMCS
// does not know are reported in the replies' invalid field rather than failing
// the subscription.
func Subscribe(ctx context.Context, conn grpc.ClientConnInterface, instance, processor string, names []string) (processing.ProcessingApi_SubscribeParametersClient, error) {
	ids := make([]*protobuf.NamedObjectId, len(names))
	for i, name := range names {
		ids[i] = &protobuf.NamedObjectId{Name: proto.String(name)}
	}
	stream, err := processing.NewProcessingApiClient(conn).SubscribeParameters(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to open parameter subscription: %w", err)
	}
	if err := stream.Send(&processing.SubscribeParametersRequest{
		Instance:       proto.String(instance),
		Processor:      proto.String(processor),
		Id:             ids,
		SendFromCache:  proto.Bool(true),
		AbortOnInvalid: proto.Bool(false),
	}); err != nil {
		// io.EOF means the server ended the stream; Recv has the reason.
		if errors.Is(err, io.EOF) {
			_, err = stream.Recv()
		}
		return nil, fmt.Errorf("failed to send parameter subscription: %w", err)
	}
	return stream, nil
}
