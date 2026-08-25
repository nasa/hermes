package socat

import (
	"encoding/json"
	"reflect"
	"strings"
	"testing"
)

// jsonTag returns a struct field's json name without options like ",omitempty".
func jsonTag(f reflect.StructField) string {
	return strings.Split(f.Tag.Get("json"), ",")[0]
}

func TestSchemaIsValidJSON(t *testing.T) {
	// schema.json is embedded as a raw string, so a malformed file is caught
	// neither at build time nor at startup — only here, before it breaks the
	// VSCode form silently.
	var s map[string]json.RawMessage
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}
	if err := json.Unmarshal([]byte(uiSchema), &s); err != nil {
		t.Fatalf("embedded uischema.json is not valid JSON: %v", err)
	}
}

func TestSchemaPropertiesMatchParams(t *testing.T) {
	// The form binds Params by json tag, so a field renamed in one place but
	// not the other drifts silently. Keep schema properties and Params tags
	// in exact correspondence.
	var s struct {
		Properties map[string]json.RawMessage `json:"properties"`
	}
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}

	tags := map[string]bool{}
	pt := reflect.TypeOf(Params{})
	for i := 0; i < pt.NumField(); i++ {
		tags[jsonTag(pt.Field(i))] = true
	}

	for name := range s.Properties {
		if !tags[name] {
			t.Errorf("schema property %q has no matching Params json tag", name)
		}
	}
	for name := range tags {
		if _, ok := s.Properties[name]; !ok {
			t.Errorf("Params field %q is missing from schema properties", name)
		}
	}
}

func TestSchemaRequiredReferencesRealProperties(t *testing.T) {
	// A required entry that names a non-existent property makes RJSF reject
	// every profile at form validation.
	var s struct {
		Properties map[string]json.RawMessage `json:"properties"`
		Required   []string                   `json:"required"`
	}
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}

	for _, name := range s.Required {
		if _, ok := s.Properties[name]; !ok {
			t.Errorf("required lists %q which is not a schema property", name)
		}
	}
}

func TestDefaultProtocolIsCcsds(t *testing.T) {
	if p := (&socatProvider{}).Default(); p.Protocol != protocolCcsds {
		t.Errorf("default protocol = %q, want %q", p.Protocol, protocolCcsds)
	}
}
