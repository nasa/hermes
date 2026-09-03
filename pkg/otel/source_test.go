package otel

import (
	"context"
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

func TestResourceCacheUsesSourceAsServiceName(t *testing.T) {
	// Every record used to carry the profile's static service name, so Loki
	// labelled all sources "hermes" no matter where the data came from.
	cache := newResourceCache("hermes")

	res, err := cache.get(context.Background(), "fsw-1")
	if err != nil {
		t.Fatalf("failed to build resource: %v", err)
	}

	if got := resourceServiceName(res); got != "fsw-1" {
		t.Errorf("service.name = %q, want %q", got, "fsw-1")
	}
}

func TestResourceCacheFallsBackWhenSourceIsEmpty(t *testing.T) {
	cache := newResourceCache("hermes")

	res, err := cache.get(context.Background(), "")
	if err != nil {
		t.Fatalf("failed to build resource: %v", err)
	}

	if got := resourceServiceName(res); got != "hermes" {
		t.Errorf("service.name = %q, want %q", got, "hermes")
	}
}

func TestResourceCacheReusesResourcePerSource(t *testing.T) {
	cache := newResourceCache("hermes")

	first, err := cache.get(context.Background(), "fsw-1")
	if err != nil {
		t.Fatalf("failed to build resource: %v", err)
	}

	second, err := cache.get(context.Background(), "fsw-1")
	if err != nil {
		t.Fatalf("failed to build resource: %v", err)
	}

	if first != second {
		t.Error("expected the same resource instance to be reused for a source")
	}
}

func TestLogRouterExportsRecordsUnderTheirSource(t *testing.T) {
	exporter := &recordingLogExporter{}
	router := newLogRouter(newResourceCache("hermes"), exporter)

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

func TestLogRouterShutdownLeavesSharedExporterOpen(t *testing.T) {
	// Providers share one exporter; letting a provider's batch processor
	// shut it down would kill exports for every other source.
	exporter := &recordingLogExporter{}
	router := newLogRouter(newResourceCache("hermes"), exporter)

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
