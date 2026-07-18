package timescaledb

import (
	"encoding/json"
	"testing"
	stdtime "time"

	"github.com/nasa/hermes/pkg/pb"
	"google.golang.org/protobuf/types/known/timestamppb"
)

func TestParamsWithoutDownlinksToggleKeepsItEnabled(t *testing.T) {
	// Settings saved before the toggle existed must start logging downlinks
	// automatically — that is the whole point of issue #110.
	var p Params
	if err := json.Unmarshal([]byte(`{"host":"localhost:5432","database":"tlm"}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if !p.DownlinksEnabled() {
		t.Error("downlinks should be enabled when the key is absent")
	}
}

func TestParamsCanDisableDownlinksOnly(t *testing.T) {
	var p Params
	if err := json.Unmarshal([]byte(`{"downlinks":false}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if p.DownlinksEnabled() {
		t.Error("downlinks should be disabled when set to false")
	}
	if !p.EventsEnabled() || !p.TelemetryEnabled() {
		t.Error("events and telemetry should stay enabled when only downlinks is set")
	}
}

func TestExplicitNullDownlinksMeansEnabled(t *testing.T) {
	off := false
	p := Params{Downlinks: &off}
	if err := json.Unmarshal([]byte(`{"downlinks":null}`), &p); err != nil {
		t.Fatalf("failed to decode settings: %v", err)
	}

	if !p.DownlinksEnabled() {
		t.Error("null downlinks should mean enabled")
	}
}

func TestDefaultEnablesDownlinks(t *testing.T) {
	if !(&timescaleDbProvider{}).Default().DownlinksEnabled() {
		t.Error("default profile should have downlinks enabled")
	}
}

func TestNilDownlinksToggleIsOmittedFromMarshaledSettings(t *testing.T) {
	b, err := json.Marshal((&timescaleDbProvider{}).Default())
	if err != nil {
		t.Fatalf("failed to marshal default params: %v", err)
	}

	var m map[string]json.RawMessage
	if err := json.Unmarshal(b, &m); err != nil {
		t.Fatalf("failed to decode marshaled params: %v", err)
	}

	if v, ok := m["downlinks"]; ok {
		t.Errorf("unset downlinks should be omitted from settings, got %s", v)
	}
}

func TestDownlinksToggleIsNotRequired(t *testing.T) {
	var s struct {
		Required []string `json:"required"`
	}
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}

	for _, name := range s.Required {
		if name == "downlinks" {
			t.Error("downlinks must not be a required property")
		}
	}
}

func TestSchemaOffersDownlinksToggleDefaultingOn(t *testing.T) {
	var s struct {
		Properties map[string]struct {
			Type    string          `json:"type"`
			Default json.RawMessage `json:"default"`
		} `json:"properties"`
	}
	if err := json.Unmarshal([]byte(schema), &s); err != nil {
		t.Fatalf("embedded schema.json is not valid JSON: %v", err)
	}

	prop, ok := s.Properties["downlinks"]
	if !ok {
		t.Fatal("schema.json should offer a downlinks property")
	}
	if prop.Type != "boolean" {
		t.Errorf("downlinks should be a boolean property, got %q", prop.Type)
	}
	if string(prop.Default) != "true" {
		t.Errorf("downlinks should default to true in the form, got %s", prop.Default)
	}
}

func TestDownlinkArgsMapsAllFields(t *testing.T) {
	start := stdtime.Date(2026, 7, 16, 10, 0, 0, 0, stdtime.UTC)
	end := start.Add(90 * stdtime.Second)
	msg := &pb.FileDownlink{
		Uid:             "dl-42",
		TimeStart:       timestamppb.New(start),
		TimeEnd:         timestamppb.New(end),
		Status:          pb.FileDownlinkCompletionStatus_DOWNLINK_PARTIAL,
		Source:          "flight-1",
		SourcePath:      "/seq/image.raw",
		DestinationPath: "/ground/image.raw",
		FilePath:        "/data/hermes/image.raw",
		MissingChunks: []*pb.FileDownlinkChunk{
			{Offset: 100, Size: 50},
			{Offset: 300, Size: 25},
		},
		DuplicateChunks: []*pb.FileDownlinkChunk{
			{Offset: 0, Size: 10},
		},
		Size:     2048,
		Metadata: map[string]string{"camera": `"nav"`},
	}

	args, err := downlinkArgs(msg)
	if err != nil {
		t.Fatalf("failed to build downlink args: %v", err)
	}
	if len(args) != 14 {
		t.Fatalf("expected 14 insert args, got %d", len(args))
	}

	if args[0] != "dl-42" {
		t.Errorf("uid: got %v", args[0])
	}
	if got := args[1].(stdtime.Time); !got.Equal(start) {
		t.Errorf("timeStart: got %v", got)
	}
	if got := args[2].(stdtime.Time); !got.Equal(end) {
		t.Errorf("timeEnd: got %v", got)
	}
	// The dashboard's value mappings key on the enum name, exactly what the
	// old OTEL log path exported via Record().
	if args[3] != "DOWNLINK_PARTIAL" {
		t.Errorf("status: got %v", args[3])
	}
	if args[4] != "flight-1" || args[5] != "/seq/image.raw" ||
		args[6] != "/ground/image.raw" || args[7] != "/data/hermes/image.raw" {
		t.Errorf("string fields: got %v %v %v %v", args[4], args[5], args[6], args[7])
	}
	if args[8] != int64(2048) {
		t.Errorf("fileSize should be int64 for the sql driver, got %T %v", args[8], args[8])
	}

	var missing []map[string]any
	if err := json.Unmarshal([]byte(args[9].(string)), &missing); err != nil {
		t.Fatalf("missingChunks is not valid JSON: %v", err)
	}
	if len(missing) != 2 {
		t.Errorf("missingChunks: got %v", args[9])
	}
	if args[10] != int64(75) {
		t.Errorf("missingBytes should sum chunk sizes, got %v", args[10])
	}

	var duplicate []map[string]any
	if err := json.Unmarshal([]byte(args[11].(string)), &duplicate); err != nil {
		t.Fatalf("duplicateChunks is not valid JSON: %v", err)
	}
	if len(duplicate) != 1 {
		t.Errorf("duplicateChunks: got %v", args[11])
	}
	if args[12] != int64(10) {
		t.Errorf("duplicateBytes should sum chunk sizes, got %v", args[12])
	}

	var metadata map[string]string
	if err := json.Unmarshal([]byte(args[13].(string)), &metadata); err != nil {
		t.Fatalf("metadata is not valid JSON: %v", err)
	}
	if metadata["camera"] != `"nav"` {
		t.Errorf("metadata: got %v", args[13])
	}
}

func TestDownlinkArgsWithNoChunksStayValid(t *testing.T) {
	// A clean completed downlink has no missing or duplicate chunks; JSONB
	// columns still need valid JSON, not SQL nulls born from Go nils.
	msg := &pb.FileDownlink{
		Uid:     "dl-clean",
		TimeEnd: timestamppb.New(stdtime.Date(2026, 7, 16, 11, 0, 0, 0, stdtime.UTC)),
		Status:  pb.FileDownlinkCompletionStatus_DOWNLINK_COMPLETED,
	}

	args, err := downlinkArgs(msg)
	if err != nil {
		t.Fatalf("failed to build downlink args: %v", err)
	}

	if args[3] != "DOWNLINK_COMPLETED" {
		t.Errorf("status: got %v", args[3])
	}
	if args[10] != int64(0) || args[12] != int64(0) {
		t.Errorf("byte sums should be zero, got %v %v", args[10], args[12])
	}
	for _, i := range []int{9, 11, 13} {
		if !json.Valid([]byte(args[i].(string))) {
			t.Errorf("args[%d] should be valid JSON, got %v", i, args[i])
		}
	}
}
