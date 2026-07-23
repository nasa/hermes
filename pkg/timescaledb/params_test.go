package timescaledb

import (
	"encoding/json"
	"testing"
)

func TestParamsWithoutTogglesKeepsBothEnabled(t *testing.T) {
	// Settings saved before the toggles existed must keep logging both.
	var p Params
	if err := json.Unmarshal([]byte(`{"host":"localhost:5432","database":"tlm"}`), &p); err != nil {
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

func TestNilTogglesAreOmittedFromMarshaledSettings(t *testing.T) {
	// The frontend renders settings JSON straight into the form. A literal
	// null bypasses the schema's default:true and draws an unchecked box
	// while the backend keeps logging — nil pointers must serialize as
	// absent keys, not null.
	b, err := json.Marshal((&timescaleDbProvider{}).Default())
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

func TestSchemaAndUiOrderStayInSync(t *testing.T) {
	// RJSF replaces the entire form with a config-error box when ui:order
	// misses a property, so schema.json and the ui:order list must never
	// drift apart.
	var s struct {
		Properties map[string]json.RawMessage `json:"properties"`
	}
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}

	var u struct {
		Order []string `json:"ui:order"`
	}
	if err := json.Unmarshal([]byte(uiSchema), &u); err != nil {
		t.Fatalf("uiSchema is not valid JSON: %v", err)
	}

	ordered := map[string]bool{}
	for _, name := range u.Order {
		ordered[name] = true
		if _, ok := s.Properties[name]; !ok {
			t.Errorf("ui:order lists %q which is not a schema property", name)
		}
	}
	for name := range s.Properties {
		if !ordered[name] {
			t.Errorf("schema property %q is missing from ui:order", name)
		}
	}
}

func TestTogglesAreNotRequired(t *testing.T) {
	// Profiles saved before the toggles existed have no keys; requiring
	// them would make every legacy profile fail form validation.
	var s struct {
		Required []string `json:"required"`
	}
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}

	for _, name := range s.Required {
		if name == "events" || name == "telemetry" {
			t.Errorf("%q must not be a required property", name)
		}
	}
}

func TestExplicitNullMeansEnabled(t *testing.T) {
	// A literal null must reset a previously-disabled toggle back to the
	// enabled default — this tri-state contract (null == absent == enabled)
	// is what makes old settings round-trips safe.
	off := false
	p := Params{Events: &off, Telemetry: &off}
	if err := json.Unmarshal([]byte(`{"events":null,"telemetry":null}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if !p.EventsEnabled() {
		t.Error("null events should mean enabled")
	}
	if !p.TelemetryEnabled() {
		t.Error("null telemetry should mean enabled")
	}
}

func TestBothTogglesCanBeDisabled(t *testing.T) {
	var p Params
	if err := json.Unmarshal([]byte(`{"events":false,"telemetry":false}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if p.EventsEnabled() || p.TelemetryEnabled() {
		t.Error("both toggles should be disabled when both are false")
	}
}

func TestExplicitTrueSurvivesMarshal(t *testing.T) {
	// omitempty must only drop nil pointers — an explicit true has to
	// round-trip as a real boolean, not vanish.
	var p Params
	if err := json.Unmarshal([]byte(`{"events":true,"telemetry":true}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	b, err := json.Marshal(p)
	if err != nil {
		t.Fatalf("failed to marshal params: %v", err)
	}

	var m map[string]json.RawMessage
	if err := json.Unmarshal(b, &m); err != nil {
		t.Fatalf("failed to decode marshaled params: %v", err)
	}

	if string(m["events"]) != "true" || string(m["telemetry"]) != "true" {
		t.Errorf("explicit true should marshal as true, got events=%s telemetry=%s", m["events"], m["telemetry"])
	}
}

func TestDefaultEnablesBothToggles(t *testing.T) {
	p := (&timescaleDbProvider{}).Default()

	if !p.EventsEnabled() {
		t.Error("default profile should have events enabled")
	}
	if !p.TelemetryEnabled() {
		t.Error("default profile should have telemetry enabled")
	}
}
