package main

import (
	"log"
	"os"
	"testing"
	"time"

	"github.com/nasa/hermes/pkg/pb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func BenchmarkTimescaleInserts(b *testing.B) {
	dataSource := os.Getenv("DATA_SOURCE_URL")
	if dataSource == "" {
		b.Skip("failed to get data source url")
		return
	}

	recorder, err := NewPGRecorder(dataSource, nil)
	if err != nil {
		log.Fatalf("failed to create testing recorder: %v", err)
	}

	testTelemetry := &pb.SourcedTelemetry{
		Telemetry: &pb.Telemetry{
			Ref: &pb.TelemetryRef{
				Id:        4242,
				Name:      "john",
				Component: "doe",
			},
			Time: &pb.Time{
				Unix: timestamppb.Now(),
				Sclk: float64(time.Now().UnixNano()) / 1e6,
			},
			Value: &pb.Value{
				Value: &pb.Value_S{
					S: "johnanon",
				},
			},
		},
		Source: "fprime",
	}

	tx, err := recorder.StartTransaction()
	if err != nil {
		b.Fatalf("failed to start benchmark transaction")
	}
	for b.Loop() {
		err = recorder.InsertTelemetry(tx, testTelemetry)
		if err != nil {
			b.Fatalf("failed to insert telemetry")
		}
	}
	err = tx.Commit()
	if err != nil {
		b.Fatalf("failed to commit benchmark transaction")
	}
}
