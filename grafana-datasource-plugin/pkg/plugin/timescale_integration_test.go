package plugin

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"math/rand"
	"net"
	"os/exec"
	"testing"
	"time"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/protobuf/types/known/timestamppb"

	"github.com/grafana/grafana-plugin-sdk-go/backend"
	hermesGrpc "github.com/nasa/hermes/pkg/grpc"
	pb "github.com/nasa/hermes/pkg/pb"
)

const (
	timescaleConnStr  = "postgres://postgres:password@localhost:5432/hermes?sslmode=disable"
	hermesGrpcConnStr = "localhost:50051"
)

func BenchmarkTimescaleQueries(b *testing.B) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	hermesConn := startHermesBackend(b, ctx)
	defer func() { _ = hermesConn.Close() }()

	hermesClient := hermesGrpc.NewApiClient(hermesConn)

	db := startTimescaleGrafana(b, ctx, hermesClient)
	defer func() { _ = db.Close() }()

	timeNow := time.Now()

	emitData(b, ctx, hermesClient, timeNow.Add(-1*time.Hour), 1*time.Hour)
	query(b, ctx, db, "1Hour")

	emitData(b, ctx, hermesClient, timeNow.Add(-24*time.Hour), 23*time.Hour)
	query(b, ctx, db, "1Day")
}

func startCommand(b *testing.B, ctx context.Context, dir, name string, args ...string) {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir
	if err := cmd.Start(); err != nil {
		b.Fatalf("Command start failed [%s %v]: %v", name, args, err)
	}

	// Stop littering hermes backends on my comupter
	b.Cleanup(func() {
		if cmd.Process != nil {
			_ = cmd.Process.Kill()
			_, _ = cmd.Process.Wait()
		}
	})
}

func runCommand(b *testing.B, ctx context.Context, dir, name string, args ...string) {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Dir = dir
	if err := cmd.Run(); err != nil {
		b.Fatalf("Command run failed [%s %v]: %v", name, args, err)
	}
}

func waitPort(b *testing.B, target string) {
	for range 10 {
		if conn, err := net.DialTimeout("tcp", target, 500*time.Millisecond); err == nil {
			_ = conn.Close()
			return
		}
		time.Sleep(1 * time.Second)
	}
	b.Fatalf("Network connection timed out: %s\n", target)
}

func startHermesBackend(b *testing.B, ctx context.Context) *grpc.ClientConn {
	b.Log("Starting Hermes backend")

	runCommand(b, ctx, "../../..", "make", "out/backend")
	startCommand(b, ctx, "../../..", "./out/backend", "--bind-type", "tcp", "--bind", hermesGrpcConnStr)
	waitPort(b, hermesGrpcConnStr)

	hermesConn, err := grpc.NewClient(hermesGrpcConnStr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		b.Fatalf("Hermes backend gRPC connection failed: %v", err)
	}
	b.Log("Hermes backend started")
	return hermesConn
}

func startTimescaleGrafana(b *testing.B, ctx context.Context, hermesClient hermesGrpc.ApiClient) *sql.DB {
	b.Log("Starting TimescaleDB Grafana Docker")

	runCommand(b, ctx, "../..", "docker", "compose", "up", "-d")
	b.Cleanup(func() {
		runCommand(b, context.Background(), "../..", "docker", "compose", "down", "-v")
	})
	waitPort(b, "localhost:5432")

	b.Log("TimescaleDB Grafana Docker Started")
	b.Log("Connecting to TimescaleDB")

	db, err := sql.Open("postgres", timescaleConnStr)
	if err != nil {
		b.Fatalf("Failed to open database pool: %v", err)
	}
	for range 10 {
		if err := db.PingContext(ctx); err == nil {
			break
		}
		time.Sleep(1 * time.Second)
	}

	b.Log("Connected to TimescaleDB")
	b.Log("Hermes connecting to TimescaleDB")

	timescaleConfig := map[string]interface{}{
		"host":     "localhost",
		"port":     5432,
		"user":     "postgres",
		"password": "password",
		"database": "hermes",
		"sslmode":  "disable",
	}

	timescaleConfigBytes, err := json.Marshal(timescaleConfig)
	if err != nil {
		b.Fatalf("Failed to marshal database config map: %v", err)
	}

	timescaleProfile := &pb.Profile{
		Name:     "TimescaleDB",
		Provider: "TimescaleDB",
		Settings: string(timescaleConfigBytes),
	}

	timescaleProfileID, err := hermesClient.AddProfile(ctx, timescaleProfile)
	if err != nil {
		b.Fatalf("Hermes failed to add profile: %v", err)
	}

	_, err = hermesClient.StartProfile(ctx, timescaleProfileID)
	if err != nil {
		b.Fatalf("Hermes failed to start profile: %v", err)
	}

	b.Log("Hermes connected to TimescaleDB")
	return db
}

func emitData(b *testing.B, ctx context.Context, hermesClient hermesGrpc.ApiClient, timeStart time.Time, timeDuration time.Duration) {
	timeSecondsTotal := int(timeDuration.Seconds())

	sources := []string{"source-alpha", "source-beta"}

	telemetryStream, err := hermesClient.EmitTelemetry(ctx)
	if err != nil {
		b.Fatalf("Failed to open telemetry stream: %v", err)
	}
	eventStream, err := hermesClient.EmitEvent(ctx)
	if err != nil {
		b.Fatalf("Failed to open event stream: %v", err)
	}

	for timeSeconds := 0; timeSeconds < timeSecondsTotal; timeSeconds++ {
		timeUnix := timeStart.Add(time.Duration(timeSeconds) * time.Second)
		source := sources[timeSeconds%len(sources)]

		timeProto := &pb.Time{
			Unix: timestamppb.New(timeUnix),
			Sclk: float64(timeSeconds),
		}

		telemetryPacket := &pb.SourcedTelemetry{
			Source: source,
			Telemetry: &pb.Telemetry{
				Ref: &pb.TelemetryRef{
					Component: "TimescaleDB",
					Name:      "TestTelemetry1",
				},
				Time: timeProto,
				Value: &pb.Value{
					Value: &pb.Value_F{
						F: rand.Float64() * 100.0,
					},
				},
				Labels: map[string]string{
					"key": "test_key_1",
				},
			},
		}
		if err := telemetryStream.Send(telemetryPacket); err != nil {
			b.Fatalf("Hermes failed to emit telemetry at index %d: %v", timeSeconds, err)
		}

		if timeSeconds%60 == 0 {
			eventPacket := &pb.SourcedEvent{
				Source: source,
				Event: &pb.Event{
					Ref: &pb.EventRef{
						Component: "TimescaleDB",
						Name:      "TestTelemetry1",
					},
					Time:    timeProto,
					Message: "Test Event Message",
				},
			}
			if err := eventStream.Send(eventPacket); err != nil {
				b.Fatalf("Hermes failed to emit event at index %d: %v", timeSeconds, err)
			}
		}

		if timeSeconds%(60*60) == 0 {
			b.Logf("Emitted %d/%d seconds of data", timeSeconds, timeSecondsTotal)
		}
	}

	if _, err := telemetryStream.CloseAndRecv(); err != nil {
		b.Fatalf("Telemetry stream close acknowledgment failed: %v", err)
	}
	if _, err := eventStream.CloseAndRecv(); err != nil {
		b.Fatalf("Event stream close acknowledgment failed: %v", err)
	}
}

func query(b *testing.B, ctx context.Context, db *sql.DB, name string) {
	ds := &Datasource{
		db: db,
	}

	timeNow := time.Now()
	rawSql := fmt.Sprintf(`
SELECT
	time_bucket($__interval, t.ert) AS time_bucket,
	d.component,
	d.name,
	t.source,
	t.valueType,
	t.key,
	AVG(t.integral::double precision) AS val_int,
	AVG(t.floating::double precision) AS val_float,
	AVG(t.boolval::int::double precision) AS val_bool,
	MAX(t.string) AS val_str
FROM telemetryDefs d
JOIN telemetry t ON t.telemetryDefId = d.id
WHERE ((d.component = 'TimescaleDB' AND d.name = 'TestTelemetry1'))
  AND ('{}'::text[] = '{}' OR t.source = ANY('{}'))
  AND t.ert >= '%s' AND t.ert <= '%s'
GROUP BY time_bucket, d.component, d.name, t.source, t.valueType, t.key
ORDER BY time_bucket ASC;`, timeNow.AddDate(-1, 0, 0).Format(time.RFC3339Nano), timeNow.Format(time.RFC3339Nano))

	queryModel := queryModel{
		QueryType: "telemetry",
		TimeField: "time",
		RawSql:    &rawSql,
	}
	queryJSON, err := json.Marshal(queryModel)
	if err != nil {
		b.Fatalf("Failed to marshal queryModel: %v", err)
	}

	request := &backend.QueryDataRequest{
		Queries: []backend.DataQuery{
			{
				RefID:    "TestQueryId1",
				JSON:     queryJSON,
				Interval: 1 * time.Second,
			},
		},
	}

	b.Run(name, func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			response, err := ds.QueryData(ctx, request)
			if err != nil {
				b.Fatalf("Failed to query data: %v", err)
			}

			if queryResp, exists := response.Responses["TestQueryId1"]; exists {
				if queryResp.Status != backend.StatusOK && queryResp.Error != nil {
					b.Fatalf("Error returned by query data: %v", queryResp.Error)
				}
			} else {
				b.Fatal("Missing expected data from query data")
			}
		}
	})
}
