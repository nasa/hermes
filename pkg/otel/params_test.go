package otel

import (
	"encoding/json"
	"testing"
)

func TestParamsWithoutTogglesKeepsBothEnabled(t *testing.T) {
	// Settings saved before the toggles existed must keep logging both.
	var p Params
	if err := json.Unmarshal([]byte(`{"endpoint":"localhost:4317","serviceName":"hermes"}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if !p.EventsEnabled() {
		t.Error("events should be enabled when the key is absent")
	}
	if !p.TelemetryEnabled() {
		t.Error("telemetry should be enabled when the key is absent")
	}
}

func TestParamsCanDisableEventsOnly(t *testing.T) {
	var p Params
	if err := json.Unmarshal([]byte(`{"events":false,"telemetry":true}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if p.EventsEnabled() {
		t.Error("events should be disabled when set to false")
	}
	if !p.TelemetryEnabled() {
		t.Error("telemetry should stay enabled when set to true")
	}
}

func TestParamsCanDisableTelemetryOnly(t *testing.T) {
	var p Params
	if err := json.Unmarshal([]byte(`{"events":true,"telemetry":false}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if !p.EventsEnabled() {
		t.Error("events should stay enabled when set to true")
	}
	if p.TelemetryEnabled() {
		t.Error("telemetry should be disabled when set to false")
	}
}

func TestParamsCanDisableBoth(t *testing.T) {
	var p Params
	if err := json.Unmarshal([]byte(`{"events":false,"telemetry":false}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if p.EventsEnabled() {
		t.Error("events should be disabled when set to false")
	}
	if p.TelemetryEnabled() {
		t.Error("telemetry should be disabled when set to false")
	}
}

func TestNilTogglesAreOmittedFromMarshaledSettings(t *testing.T) {
	// The frontend renders settings JSON straight into the form. A literal
	// null bypasses the schema's default:true and draws an unchecked box
	// while the backend keeps logging — nil pointers must serialize as
	// absent keys, not null.
	b, err := json.Marshal((&otelProvider{}).Default())
	if err != nil {
		t.Fatalf("failed to marshal default params: %v", err)
	}

	var m map[string]json.RawMessage
	if err := json.Unmarshal(b, &m); err != nil {
		t.Fatalf("failed to decode marshaled params: %v", err)
	}

	if v, ok := m["events"]; ok {
		t.Errorf("unset events should be omitted from settings, got %s", v)
	}
	if v, ok := m["telemetry"]; ok {
		t.Errorf("unset telemetry should be omitted from settings, got %s", v)
	}
}

func TestExplicitNullParsesAsNilAndEnablesLogging(t *testing.T) {
	// Literal null in stored settings (perhaps from corrupted state or
	// manual edit) must behave the same as absent.
	var p Params
	if err := json.Unmarshal([]byte(`{"events":null,"telemetry":null}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if !p.EventsEnabled() {
		t.Error("events should be enabled when the key is null")
	}
	if !p.TelemetryEnabled() {
		t.Error("telemetry should be enabled when the key is null")
	}
}

func TestSchemaAndUiOrderStayInSync(t *testing.T) {
	// Every key in schema.json properties must appear in ui:order, and vice
	// versa. If we add a field but forget to update the ui:order list, the
	// form renders it at the end and looks broken.
	var sch struct {
		Properties map[string]any `json:"properties"`
	}
	if err := json.Unmarshal([]byte(schema), &sch); err != nil {
		t.Fatalf("failed to decode schema.json: %v", err)
	}

	var uiOrder struct {
		Order []string `json:"ui:order"`
	}
	if err := json.Unmarshal([]byte(uiSchema), &uiOrder); err != nil {
		t.Fatalf("failed to decode uiSchema: %v", err)
	}

	schemaKeys := make(map[string]bool)
	for k := range sch.Properties {
		schemaKeys[k] = true
	}

	orderKeys := make(map[string]bool)
	for _, k := range uiOrder.Order {
		orderKeys[k] = true
	}

	for k := range schemaKeys {
		if !orderKeys[k] {
			t.Errorf("schema.json property %q is missing from ui:order", k)
		}
	}

	for k := range orderKeys {
		if !schemaKeys[k] {
			t.Errorf("ui:order lists %q but schema.json has no such property", k)
		}
	}
}
