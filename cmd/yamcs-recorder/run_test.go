package main

import (
	"cmp"
	"context"
	"database/sql"
	"fmt"
	"log/slog"
	"net/url"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	commonpb "go.opentelemetry.io/proto/otlp/common/v1"
	"google.golang.org/protobuf/proto"

	"github.com/nasa/hermes/internal/recorder/yamcs"
	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
)

// Runs the recorder against a live YAMCS, e.g. YAMCS_GRPC_ADDRESS=localhost:8091,
// and a scratch database on the TimescaleDB at HERMES_TEST_TIMESCALE_DSN.
// YAMCS_INSTANCE defaults to fprime-project. We wait for a parameter row, so
// YAMCS must have a value to send: either telemetry is arriving or it has a
// cached value from earlier telemetry. Raises one event with CreateEvent,
// which stays in the instance's archive.
func TestRunRecordsParametersAndExportsEvents(t *testing.T) {
	addr := os.Getenv("YAMCS_GRPC_ADDRESS")
	dsn := os.Getenv("HERMES_TEST_TIMESCALE_DSN")
	if addr == "" || dsn == "" {
		t.Skip("YAMCS_GRPC_ADDRESS or HERMES_TEST_TIMESCALE_DSN not set")
	}
	instance := cmp.Or(os.Getenv("YAMCS_INSTANCE"), "fprime-project")
	dbURL := freshDatabase(t, dsn)
	db, err := sql.Open("postgres", dbURL)
	require.NoError(t, err)
	t.Cleanup(func() { _ = db.Close() })

	receiver, otlp := serveLogs(t)

	ctx, cancel := context.WithCancel(context.Background())
	t.Cleanup(cancel)
	cfg := config{yamcs: addr, instance: instance, processor: "realtime", postgresql: dbURL, otlp: otlp}
	stopped := make(chan error, 1)
	// If the test fails early, it ends without waiting for run, which keeps
	// logging as it shuts down. Logging to t after the test ends panics, so
	// we log to stderr.
	go func() { stopped <- run(ctx, cfg, slog.New(slog.NewTextHandler(os.Stderr, nil))) }()

	// waitFor polls done until it reports true. If run returns first, it fails
	// straight away with run's error. require.Eventually would wait out the
	// full 30 seconds and not say why.
	waitFor := func(what string, done func() bool) {
		t.Helper()
		timeout := time.After(30 * time.Second)
		for !done() {
			select {
			case err := <-stopped:
				t.Fatalf("run returned before %s: %v", what, err)
			case <-timeout:
				t.Fatalf("timed out waiting for %s", what)
			case <-time.After(100 * time.Millisecond):
			}
		}
	}

	// run creates the tables when it starts, so until then the query fails.
	// The join also checks that run stored the rows under our instance.
	waitFor("rows for "+instance+" in parameter_values", func() bool {
		var n int
		err := db.QueryRowContext(ctx, `SELECT COUNT(*) FROM parameter_values v
			JOIN parameters p ON p.id = v.parameter_id WHERE p.instance = $1`, instance).Scan(&n)
		return err == nil && n > 0
	})

	// run sent its event subscription before it recorded any rows, but YAMCS
	// does not acknowledge a subscription, so we give it a second to start.
	time.Sleep(time.Second)
	conn, err := yamcs.Dial(addr)
	require.NoError(t, err)
	defer conn.Close()
	_, err = events.NewEventsApiClient(conn).CreateEvent(ctx, &events.CreateEventRequest{
		Instance: proto.String(instance),
		Source:   proto.String("yamcs-recorder test"),
		Message:  proto.String(t.Name()),
	})
	require.NoError(t, err)
	var resource map[string]*commonpb.AnyValue
	waitFor("the event at the receiver", func() bool {
		resource = receiver.find(t.Name())
		return resource != nil
	})
	assert.Equal(t, instance, resource["service.name"].GetStringValue())

	// main ignores run's error once its context is cancelled, so we only
	// check that run returns.
	cancel()
	select {
	case <-stopped:
	case <-time.After(30 * time.Second):
		t.Fatal("run did not return after cancel")
	}
}

// find returns the attributes of the resource that carried the record whose
// body is body, or nil if no such record has arrived.
func (r *logsReceiver) find(body string) map[string]*commonpb.AnyValue {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, req := range r.requests {
		for _, rl := range req.GetResourceLogs() {
			for _, sl := range rl.GetScopeLogs() {
				for _, lr := range sl.GetLogRecords() {
					if lr.GetBody().GetStringValue() == body {
						return attributes(rl.GetResource().GetAttributes())
					}
				}
			}
		}
	}
	return nil
}

// freshDatabase creates an empty database for one test and returns its URL.
// It follows freshDatabase in internal/recorder/store/migrate_test.go, since
// we can't import a helper from another package's test file. dsn must name a
// user that can create databases. We copy template0 because TimescaleDB
// briefly connects to template1 after a database is dropped, which makes
// copying template1 fail now and then.
func freshDatabase(t *testing.T, dsn string) string {
	t.Helper()
	admin, err := sql.Open("postgres", dsn)
	require.NoError(t, err)
	t.Cleanup(func() { _ = admin.Close() })

	name := fmt.Sprintf("yamcs_recorder_run_test_%d", os.Getpid())
	ctx := context.Background()
	_, err = admin.ExecContext(ctx, `DROP DATABASE IF EXISTS `+name)
	require.NoError(t, err)
	_, err = admin.ExecContext(ctx, `CREATE DATABASE `+name+` TEMPLATE template0`)
	require.NoError(t, err)
	t.Cleanup(func() {
		_, _ = admin.ExecContext(context.Background(), `DROP DATABASE IF EXISTS `+name+` WITH (FORCE)`)
	})

	u, err := url.Parse(dsn)
	require.NoError(t, err)
	u.Path = "/" + name
	return u.String()
}
