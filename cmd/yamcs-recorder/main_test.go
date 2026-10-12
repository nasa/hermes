package main

import (
	"bytes"
	"context"
	"errors"
	"io"
	"log/slog"
	"net"
	"sync"
	"testing"
	"time"

	"github.com/lib/pq"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	otellog "go.opentelemetry.io/otel/log"
	"go.opentelemetry.io/otel/log/logtest"
	collogspb "go.opentelemetry.io/proto/otlp/collector/logs/v1"
	commonpb "go.opentelemetry.io/proto/otlp/common/v1"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/nasa/hermes/internal/recorder/convert"
	"github.com/nasa/hermes/internal/recorder/store"
	"github.com/nasa/hermes/internal/yamcspb/protobuf"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/processing"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/pvalue"
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
	st.droppedRows.Add(1)
	var logs bytes.Buffer
	st.log(slog.New(slog.NewTextHandler(&logs, nil)))
	assert.Contains(t, logs.String(),
		"rows=0 events=4 unmapped=0 incomplete=3 already_stored=2 insert_errors=0 dropped_rows=1")
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

func TestWriteStoresWaitingMessagesInOneInsert(t *testing.T) {
	row := func(value float64) store.Row { return store.Row{Value: store.DoubleValue(value)} }
	ctx, cancel := context.WithCancel(context.Background())
	queue := make(chan []store.Row, 3)
	var inserts [][]store.Row
	r := &recorder{insert: func(insertCtx context.Context, rows []store.Row) error {
		inserts = append(inserts, rows)
		switch len(inserts) {
		case 1:
			// While the first insert is in flight, three more messages arrive.
			// Then statement_timeout cancels the insert. A retry would be
			// cancelled too, so we drop its row.
			queue <- []store.Row{row(2)}
			queue <- []store.Row{row(3)}
			queue <- []store.Row{row(4)}
			close(queue)
			return &pq.Error{Code: "57014"} // query_canceled
		case 2, 4:
			// The database rejects message 3, so it rejects the insert of all
			// three messages and then the insert of message 3 alone.
			return &pq.Error{Code: "22008"} // datetime_field_overflow
		}
		// A signal arrives while we insert message 2. The inserts of messages
		// 2 and 4 fail only if the signal cancelled their context.
		cancel()
		return insertCtx.Err()
	}}
	queue <- []store.Row{row(1)}

	r.write(ctx, queue)

	assert.Equal(t, [][]store.Row{{row(1)}, {row(2), row(3), row(4)}, {row(2)}, {row(3)}, {row(4)}}, inserts)
	assert.EqualValues(t, 3, r.stats.insertErrors.Load())
	assert.EqualValues(t, 2, r.stats.droppedRows.Load())
	assert.EqualValues(t, 2, r.stats.rows.Load())
}

func TestWriteRetriesWhileDatabaseIsUnreachable(t *testing.T) {
	rows := []store.Row{{Value: store.DoubleValue(1)}, {Value: store.DoubleValue(2)}}
	// Both messages wait on queue, so each attempt inserts them together.
	queue := make(chan []store.Row, 2)
	queue <- rows[:1]
	queue <- rows[1:]
	close(queue)
	errs := []error{
		errors.New("dial tcp 127.0.0.1:5432: connect: connection refused"),
		&pq.Error{Code: "08006"}, // connection_failure
		&pq.Error{Code: "53100"}, // disk_full
		&pq.Error{Code: "57P03"}, // cannot_connect_now, while the database starts up
	}
	attempts := 0
	r := &recorder{insert: func(_ context.Context, got []store.Row) error {
		attempts++
		assert.Equal(t, rows, got)
		if attempts <= len(errs) {
			return errs[attempts-1]
		}
		return nil
	}}

	r.write(context.Background(), queue)

	assert.Equal(t, len(errs)+1, attempts)
	assert.EqualValues(t, len(errs), r.stats.insertErrors.Load())
	assert.Zero(t, r.stats.droppedRows.Load())
	assert.EqualValues(t, 2, r.stats.rows.Load())
}

// scriptedParameters returns the messages in queue from Recv, then closes ended
// and returns io.EOF.
type scriptedParameters struct {
	processing.ProcessingApi_SubscribeParametersClient
	queue []*processing.SubscribeParametersData
	ended chan struct{}
}

func (s *scriptedParameters) Recv() (*processing.SubscribeParametersData, error) {
	if len(s.queue) == 0 {
		close(s.ended)
		return nil, io.EOF
	}
	data := s.queue[0]
	s.queue = s.queue[1:]
	return data, nil
}

// threeMessages returns a stream of three messages with one value each.
func threeMessages() *scriptedParameters {
	data := &processing.SubscribeParametersData{
		Mapping: map[uint32]*protobuf.NamedObjectId{1: {Name: proto.String("/Ref/systemResources/CPU")}},
		Values: []*pvalue.ParameterValue{{
			NumericId:      proto.Uint32(1),
			GenerationTime: timestamppb.Now(),
			EngValue:       &protobuf.Value{Type: protobuf.Value_DOUBLE.Enum(), DoubleValue: proto.Float64(1)},
		}},
	}
	return &scriptedParameters{queue: []*processing.SubscribeParametersData{data, data, data}, ended: make(chan struct{})}
}

func TestRecordParametersStoresWhatItReadBeforeReturning(t *testing.T) {
	stream := threeMessages()
	r := &recorder{
		conv: convert.New("fprime-project", slog.New(slog.DiscardHandler)),
		insert: func(ctx context.Context, _ []store.Row) error {
			// The first insert finishes only after the subscription ends, and
			// like a real insert, it fails if ctx is cancelled.
			<-stream.ended
			return ctx.Err()
		},
	}

	err := recordParameters(context.Background(), stream, r)
	assert.ErrorIs(t, err, io.EOF)
	assert.EqualValues(t, 3, r.stats.rows.Load())
	assert.Zero(t, r.stats.droppedRows.Load())
}

func TestRecordParametersTriesToStoreWhatItReadBeforeReturning(t *testing.T) {
	stream := threeMessages()
	r := &recorder{
		conv: convert.New("fprime-project", slog.New(slog.DiscardHandler)),
		insert: func(context.Context, []store.Row) error {
			// The database is down for the whole test, and each insert takes a
			// moment to fail.
			time.Sleep(10 * time.Millisecond)
			return errors.New("dial tcp 127.0.0.1:5432: connect: connection refused")
		},
	}

	// Once the subscription ends, we try the rows once more, drop them and
	// return rather than wait for the database.
	err := recordParameters(context.Background(), stream, r)
	assert.ErrorIs(t, err, io.EOF)
	assert.EqualValues(t, 3, r.stats.droppedRows.Load())
	assert.Zero(t, r.stats.rows.Load())
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
