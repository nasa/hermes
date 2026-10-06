// Package yamcs is the recorder's client for YAMCS, which it reaches through
// the yamcs-grpc plugin. It lists the parameters to record and streams their
// values and the instance's events.
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
	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/mdb"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/services"
)

// Dial sets up a connection to the yamcs-grpc plugin at addr (host:port). The
// connection opens on first use.
func Dial(addr string) (*grpc.ClientConn, error) {
	return grpc.NewClient(addr,
		// The plugin doesn't use TLS.
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		// Ping the plugin after 5 quiet minutes so we notice a dead connection.
		// The plugin, like any grpc-java server, closes the connection of a client
		// that pings more often than that.
		grpc.WithKeepaliveParams(keepalive.ClientParameters{Time: 5 * time.Minute}),
	)
}

// TelemeteredParameters returns the full names of instance's TELEMETERED
// parameters, the ones YAMCS decodes from telemetry. YAMCS lists them a page at
// a time, so we keep asking, passing back each page's continuation token, until
// a page comes without one.
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

// Subscribe streams the values of the named parameters from processor, the
// part of the YAMCS instance that decodes its telemetry. YAMCS first sends the
// last value it has of each parameter, then every new one. Names it doesn't
// know come back in the invalid field of its messages.
//
// When the processor stops, for example because someone restarted the
// instance, YAMCS leaves the parameter stream open but silent. So we also watch
// the processor, end the stream ourselves when it stops, and make Recv return
// why.
func Subscribe(ctx context.Context, conn grpc.ClientConnInterface, instance, processor string, names []string) (processing.ProcessingApi_SubscribeParametersClient, error) {
	client := processing.NewProcessingApiClient(conn)

	// We open two streams on this context: one for the parameter values, and one
	// for the processor's state. Calling end closes both and records why.
	ctx, end := context.WithCancelCause(ctx)

	values, err := openParameterStream(ctx, client, instance, processor, names)
	if err != nil {
		end(err)
		return nil, err
	}
	if err := watchProcessor(ctx, client, instance, processor, end); err != nil {
		end(err)
		return nil, err
	}
	return subscription{values, ctx}, nil
}

// openParameterStream opens a SubscribeParameters stream and sends it the
// request for names.
func openParameterStream(ctx context.Context, client processing.ProcessingApiClient, instance, processor string, names []string) (processing.ProcessingApi_SubscribeParametersClient, error) {
	stream, err := client.SubscribeParameters(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to open parameter subscription: %w", err)
	}
	ids := make([]*protobuf.NamedObjectId, len(names))
	for i, name := range names {
		ids[i] = &protobuf.NamedObjectId{Name: proto.String(name)}
	}
	err = stream.Send(&processing.SubscribeParametersRequest{
		Instance:       proto.String(instance),
		Processor:      proto.String(processor),
		Id:             ids,
		SendFromCache:  proto.Bool(true),
		AbortOnInvalid: proto.Bool(false),
	})
	// Send returns io.EOF when YAMCS has already ended the stream, and only
	// Recv returns YAMCS's error, so we ask Recv for it.
	if errors.Is(err, io.EOF) {
		_, err = stream.Recv()
	}
	if err != nil {
		return nil, fmt.Errorf("failed to send parameter subscription: %w", err)
	}
	return stream, nil
}

// watchProcessor follows processor's state in the background and calls end
// with the reason once the processor is stopping, has stopped or has failed, or
// once the watch itself breaks.
func watchProcessor(ctx context.Context, client processing.ProcessingApiClient, instance, processor string, end context.CancelCauseFunc) error {
	states, err := client.SubscribeProcessors(ctx, &processing.SubscribeProcessorsRequest{
		Instance:  proto.String(instance),
		Processor: proto.String(processor),
	})
	if err != nil {
		return fmt.Errorf("failed to watch processor %s: %w", processor, err)
	}
	go func() {
		for {
			info, err := states.Recv()
			if err != nil {
				end(fmt.Errorf("processor watch ended: %w", err))
				return
			}
			switch info.GetState() {
			case services.ServiceState_STOPPING, services.ServiceState_TERMINATED, services.ServiceState_FAILED:
				end(fmt.Errorf("processor %s is %s", processor, info.GetState()))
				return
			}
		}
	}()
	return nil
}

// subscription is the parameter stream Subscribe returns. Once watchProcessor
// has ended it, Recv returns the reason, such as "processor realtime is
// STOPPING", instead of gRPC's bare "context canceled".
type subscription struct {
	processing.ProcessingApi_SubscribeParametersClient
	ctx context.Context
}

func (s subscription) Recv() (*processing.SubscribeParametersData, error) {
	data, err := s.ProcessingApi_SubscribeParametersClient.Recv()
	if err != nil && s.ctx.Err() != nil {
		return nil, context.Cause(s.ctx)
	}
	return data, err
}

// SubscribeEvents streams instance's events as YAMCS raises them, without
// replaying its archive. When the instance restarts, YAMCS leaves the event
// stream open but silent, as it does the parameter stream. Subscribe already
// watches the processor, so we don't watch it again here, and the caller
// should end the event stream when the parameter stream ends.
func SubscribeEvents(ctx context.Context, conn grpc.ClientConnInterface, instance string) (events.EventsApi_SubscribeEventsClient, error) {
	stream, err := events.NewEventsApiClient(conn).SubscribeEvents(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to open event subscription: %w", err)
	}
	err = stream.Send(&events.SubscribeEventsRequest{Instance: proto.String(instance)})
	// Send returns io.EOF when YAMCS has already ended the stream, and only
	// Recv returns YAMCS's error, so we ask Recv for it.
	if errors.Is(err, io.EOF) {
		_, err = stream.Recv()
	}
	if err != nil {
		return nil, fmt.Errorf("failed to send event subscription: %w", err)
	}
	return stream, nil
}
