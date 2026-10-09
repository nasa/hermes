package main

import (
	"bytes"
	"context"
	"io"
	"log/slog"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	otellog "go.opentelemetry.io/otel/log"
	"go.opentelemetry.io/otel/log/logtest"
	collogspb "go.opentelemetry.io/proto/otlp/collector/logs/v1"
	commonpb "go.opentelemetry.io/proto/otlp/common/v1"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"

	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
)

func TestRecordedParametersExcludesTopLevel(t *testing.T) {
	// recordedParameters filters in place, so each call gets a fresh slice.
	names := func() []string {
		return []string{
			"/Dep/FPrimeTime",
			"/Dep/CdhCore/version/FrameworkVersion",
			"/Dep/systemResources/CPU",
			"/P",
		}
	}

	kept, excluded := recordedParameters(names(), false)
	assert.Equal(t, []string{"/Dep/CdhCore/version/FrameworkVersion", "/Dep/systemResources/CPU", "/P"}, kept)
	assert.Equal(t, 1, excluded)

	kept, excluded = recordedParameters(names(), true)
	assert.Equal(t, names(), kept)
	assert.Zero(t, excluded)
}

func TestDropStoredKeepsNewerRows(t *testing.T) {
	cutoff := time.Date(2026, 9, 29, 12, 0, 0, 0, time.UTC)
	version := store.Parameter{Instance: "fprime-project", SpaceSystem: "/Ref_Ref/CdhCore/version", Name: "FrameworkVersion"}
	health := store.Parameter{Instance: "fprime-project", SpaceSystem: "/Ref_Ref/CdhCore/health", Name: "PingLateWarnings"}
	noHistory := store.Parameter{Instance: "fprime-project", SpaceSystem: "/Ref_Ref/Ref/systemResources", Name: "CPU"}

	row := func(p store.Parameter, member string, offset time.Duration) store.Row {
		return store.Row{Parameter: p, MemberPath: member, GenerationTime: cutoff.Add(offset)}
	}
	rows := []store.Row{
		row(version, "", -time.Hour),
		row(version, "", 0),
		row(version, "", time.Millisecond),
		row(health, ".a", 0),
		row(health, ".b", 0),
		row(health, ".a", time.Second),
		row(noHistory, "", -24*time.Hour),
		row(noHistory, "", 0),
	}
	want := []store.Row{rows[2], rows[5], rows[6], rows[7]}

	stored := map[store.Parameter]time.Time{version: cutoff, health: cutoff}
	kept, alreadyStored := dropStored(rows, stored)
	assert.Equal(t, want, kept)
	assert.Equal(t, 4, alreadyStored)

	// Only the first message with a parameter is checked, so a clock that
	// restarts behind the stored data does not drop later values.
	older := row(version, "", -time.Hour)
	kept, alreadyStored = dropStored([]store.Row{older}, stored)
	assert.Equal(t, []store.Row{older}, kept)
	assert.Zero(t, alreadyStored)
}

func TestStatsLineNamesEachCount(t *testing.T) {
	var st stats
	st.events.Add(4)
	st.incomplete.Add(3)
	st.alreadyStored.Add(2)
	var logs bytes.Buffer
	st.log(slog.New(slog.NewTextHandler(&logs, nil)))
	assert.Contains(t, logs.String(), "rows=0 events=4 unmapped=0 incomplete=3 already_stored=2 insert_errors=0")
}

// scriptedEvents returns the events in queue from Recv, then io.EOF. It embeds
// the stream interface so we only write Recv, the one method exportEvents calls.
type scriptedEvents struct {
	events.EventsApi_SubscribeEventsClient
	queue []*events.Event
}

func (s *scriptedEvents) Recv() (*events.Event, error) {
	if len(s.queue) == 0 {
		return nil, io.EOF
	}
	e := s.queue[0]
	s.queue = s.queue[1:]
	return e, nil
}

func TestExportEventsEmitsEachEvent(t *testing.T) {
	sent := []*events.Event{
		{Message: proto.String("[OpCodeDispatched] Opcode 0x1000000 dispatched to port 4")},
		{Message: proto.String("Sequence count jump for APID: 4 old seq: 0 newseq: 0")},
	}
	logs := logtest.NewRecorder()
	var st stats

	err := exportEvents(context.Background(), &scriptedEvents{queue: sent}, logs.Logger("yamcs-recorder"), &st)
	assert.ErrorIs(t, err, io.EOF)
	records := logs.Result()[0].Records // one entry per Logger, and we made one
	require.Len(t, records, len(sent))
	for i, e := range sent {
		assert.Equal(t, e.GetMessage(), records[i].Body().AsString())
	}
	assert.EqualValues(t, len(sent), st.events.Load())
}

// logsReceiver stands in for the OpenTelemetry collector. It accepts OTLP log
// exports and keeps each request.
type logsReceiver struct {
	collogspb.UnimplementedLogsServiceServer
	mu       sync.Mutex
	requests []*collogspb.ExportLogsServiceRequest
}

func (r *logsReceiver) Export(_ context.Context, req *collogspb.ExportLogsServiceRequest) (*collogspb.ExportLogsServiceResponse, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.requests = append(r.requests, req)
	return &collogspb.ExportLogsServiceResponse{}, nil
}

// serveLogs starts an in-process logsReceiver and returns it with its address.
func serveLogs(t *testing.T) (*logsReceiver, string) {
	t.Helper()
	lis, err := net.Listen("tcp", "127.0.0.1:0")
	require.NoError(t, err)
	server := grpc.NewServer()
	receiver := &logsReceiver{}
	collogspb.RegisterLogsServiceServer(server, receiver)
	go server.Serve(lis)
	t.Cleanup(server.Stop)
	return receiver, lis.Addr().String()
}

// attributes maps each OTLP attribute's key to its value.
func attributes(kvs []*commonpb.KeyValue) map[string]*commonpb.AnyValue {
	m := make(map[string]*commonpb.AnyValue, len(kvs))
	for _, kv := range kvs {
		m[kv.GetKey()] = kv.GetValue()
	}
	return m
}

func TestNewLoggerProviderExportsToCollector(t *testing.T) {
	receiver, addr := serveLogs(t)
	ctx := context.Background()
	const body = "Sequence count jump for APID: 4 old seq: 0 newseq: 0"

	provider, err := newLoggerProvider(ctx, addr, "fprime-project")
	require.NoError(t, err)
	var r otellog.Record
	r.SetBody(otellog.StringValue(body))
	provider.Logger("yamcs-recorder").Emit(ctx, r)
	// Shutdown exports the record, which the provider still holds in its batch.
	require.NoError(t, provider.Shutdown(ctx))

	receiver.mu.Lock()
	defer receiver.mu.Unlock()
	require.Len(t, receiver.requests, 1)
	resourceLogs := receiver.requests[0].GetResourceLogs()
	require.Len(t, resourceLogs, 1)
	resource := attributes(resourceLogs[0].GetResource().GetAttributes())
	assert.Equal(t, "fprime-project", resource["service.name"].GetStringValue())
	scopeLogs := resourceLogs[0].GetScopeLogs()
	require.Len(t, scopeLogs, 1)
	require.Len(t, scopeLogs[0].GetLogRecords(), 1)
	assert.Equal(t, body, scopeLogs[0].GetLogRecords()[0].GetBody().GetStringValue())
}
