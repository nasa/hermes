package integration

import (
	"sync"
	"testing"
	"time"

	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	"github.com/nasa/hermes/pkg/pb"
	"github.com/stretchr/testify/require"
)

type TestApi struct {
	Client hermesGrpc.ApiClient

	mux       sync.RWMutex
	events    []*pb.SourcedEvent
	telemetry []*pb.SourcedTelemetry
}

func NewTestApi(t *testing.T, client hermesGrpc.ApiClient) *TestApi {
	api := &TestApi{
		Client:    client,
		events:    []*pb.SourcedEvent{},
		telemetry: []*pb.SourcedTelemetry{},
	}

	eventStream, err := client.SubEvent(t.Context(), &pb.BusFilter{})
	require.NoError(t, err, "Failed to subscribe to event stream")

	tlmStream, err := client.SubTelemetry(t.Context(), &pb.BusFilter{})
	require.NoError(t, err, "Failed to subscribe to telemetry stream")

	time.Sleep(500 * time.Millisecond)

	go func() {
		for {
			msg, err := eventStream.Recv()
			if err != nil {
				break
			} else {
				api.mux.Lock()
				api.events = append(api.events, msg)
				api.mux.Unlock()
			}
		}
	}()

	go func() {
		for {
			msg, err := tlmStream.Recv()
			if err != nil {
				break
			} else {
				api.mux.Lock()
				api.telemetry = append(api.telemetry, msg)
				api.mux.Unlock()
			}
		}
	}()

	return api
}

func (api *TestApi) RequireEvent(t *testing.T, pred func(ev *pb.SourcedEvent) bool) *pb.SourcedEvent {
	api.mux.RLock()
	defer api.mux.RUnlock()

	for _, ev := range api.events {
		if pred(ev) {
			return ev
		}
	}

	eventNames := []string{}
	for _, ev := range api.events {
		eventNames = append(eventNames, ev.GetEvent().GetRef().GetName())
	}

	t.Fatal("Event not found", eventNames)
	return nil
}

func (api *TestApi) RequireNoWarningHi(t *testing.T) {
	api.mux.RLock()
	defer api.mux.RUnlock()

	for _, ev := range api.events {
		if ev.GetEvent().GetRef().GetSeverity() == pb.EvrSeverity_EVR_WARNING_HIGH {
			t.Fatal("Event found with severity EVR_WARNING_HIGH", ev)
		}
	}
}
