package otel

import (
	"context"
	"fmt"
	"log/slog"
	"sync"
	"testing"
	"time"

	"go.opentelemetry.io/otel/sdk/log"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

type recordingLogExporter struct {
	mu        sync.Mutex
	records   []log.Record
	shutdowns int
}

func (e *recordingLogExporter) Export(_ context.Context, records []log.Record) error {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.records = append(e.records, records...)
	return nil
}

func (e *recordingLogExporter) Shutdown(context.Context) error {
	e.mu.Lock()
	defer e.mu.Unlock()
	e.shutdowns++
	return nil
}

func (e *recordingLogExporter) ForceFlush(context.Context) error { return nil }

func (e *recordingLogExporter) serviceNames() []string {
	e.mu.Lock()
	defer e.mu.Unlock()

	names := make([]string, 0, len(e.records))
	for i := range e.records {
		res := e.records[i].Resource()
		names = append(names, resourceServiceName(&res))
	}
	return names
}

func resourceServiceName(res *resource.Resource) string {
	for _, attr := range res.Attributes() {
		if attr.Key == semconv.ServiceNameKey {
			return attr.Value.AsString()
		}
	}
	return ""
}

func TestServiceNameUsesSourceAndFallsBackWhenAbsent(t *testing.T) {
	// Records used to carry a static name, so Loki labelled every source "hermes".
	for _, tt := range []struct {
		source, fallback, want string
	}{
		{source: "fsw-1", fallback: "hermes", want: "fsw-1"},
		{source: "", fallback: "hermes", want: "hermes"},
		{source: "", fallback: "", want: "hermes"},
	} {
		if got := serviceName(tt.source, tt.fallback); got != tt.want {
			t.Errorf("serviceName(%q, %q) = %q, want %q", tt.source, tt.fallback, got, tt.want)
		}
	}
}

func TestLogRouterExportsRecordsUnderTheirSource(t *testing.T) {
	exporter := &recordingLogExporter{}
	router := newLogRouter("hermes", exporter)

	ctx := context.Background()
	for _, source := range []string{"fsw-1", "fsw-2"} {
		rec := slog.NewRecord(time.Now(), slog.LevelInfo, "event", 0)
		if err := router.handle(ctx, source, rec); err != nil {
			t.Fatalf("failed to handle record for %q: %v", source, err)
		}
	}

	router.shutdown(ctx)

	seen := map[string]bool{}
	for _, name := range exporter.serviceNames() {
		seen[name] = true
	}

	for _, want := range []string{"fsw-1", "fsw-2"} {
		if !seen[want] {
			t.Errorf("no record exported with service.name %q, got %v", want, exporter.serviceNames())
		}
	}
}

func TestLogRouterCapsProvidersAndKeepsLiveSources(t *testing.T) {
	// A high-cardinality source stream used to leak a provider goroutine per source.
	router := newLogRouter("hermes", &recordingLogExporter{})
	ctx := context.Background()
	defer router.shutdown(ctx)

	rec := func() slog.Record {
		return slog.NewRecord(time.Now(), slog.LevelInfo, "event", 0)
	}

	for i := range maxLogSources {
		if err := router.handle(ctx, fmt.Sprintf("fsw-%d", i), rec()); err != nil {
			t.Fatalf("failed to handle record for source %d: %v", i, err)
		}
	}

	// The first record past the cap reports why; repeats stay quiet.
	if err := router.handle(ctx, "overflow", rec()); err == nil {
		t.Error("expected an error for the first record from a source past the cap")
	}
	if err := router.handle(ctx, "overflow", rec()); err != nil {
		t.Errorf("expected repeat records past the cap to be silent, got %v", err)
	}

	router.mu.Lock()
	defer router.mu.Unlock()

	if len(router.targets) != maxLogSources {
		t.Errorf("cached %d providers, want %d", len(router.targets), maxLogSources)
	}

	// Sources admitted before the cap keep exporting.
	if _, ok := router.targets["fsw-0"]; !ok {
		t.Error("expected an already-exporting source to be retained")
	}
	if _, ok := router.targets["overflow"]; ok {
		t.Error("expected the source past the cap not to displace a live one")
	}
}

func TestLogRouterShutdownLeavesSharedExporterOpen(t *testing.T) {
	// Providers share one exporter, so one shutting it down would kill the rest.
	exporter := &recordingLogExporter{}
	router := newLogRouter("hermes", exporter)

	ctx := context.Background()
	if err := router.handle(ctx, "fsw-1", slog.NewRecord(time.Now(), slog.LevelInfo, "event", 0)); err != nil {
		t.Fatalf("failed to handle record: %v", err)
	}

	router.shutdown(ctx)

	exporter.mu.Lock()
	defer exporter.mu.Unlock()
	if exporter.shutdowns != 0 {
		t.Errorf("shared exporter was shut down %d times by provider shutdown", exporter.shutdowns)
	}
}
