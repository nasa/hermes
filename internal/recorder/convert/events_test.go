package convert

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	otellog "go.opentelemetry.io/otel/log"
	"google.golang.org/protobuf/encoding/protojson"

	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
)

func parseEvent(t *testing.T, s string) *events.Event {
	t.Helper()
	e := &events.Event{}
	require.NoError(t, protojson.Unmarshal([]byte(s), e))
	return e
}

// attributes returns the attributes of r as strings and int64s, failing on
// duplicate keys and on other kinds.
func attributes(t *testing.T, r otellog.Record) map[string]any {
	t.Helper()
	out := make(map[string]any)
	r.WalkAttributes(func(kv otellog.KeyValue) bool {
		require.NotContains(t, out, kv.Key)
		switch kv.Value.Kind() {
		case otellog.KindString:
			out[kv.Key] = kv.Value.AsString()
		case otellog.KindInt64:
			out[kv.Key] = kv.Value.AsInt64()
		default:
			t.Errorf("attribute %s has kind %s", kv.Key, kv.Value.Kind())
		}
		return true
	})
	return out
}

// dispatchedEvent comes from the YAMCS archive of the fprime-project instance.
// fprime-yamcs's event processor decoded it from an F Prime event and posted it
// through the YAMCS API, which set createdBy.
const dispatchedEvent = `{"source": "FPrimeEventProcessor", "generationTime": "2026-10-05T22:56:34.620Z",
	"receptionTime": "2026-10-05T22:56:34.591Z", "seqNumber": 6, "type": "CdhCore.cmdDisp.OpCodeDispatched",
	"message": "[OpCodeDispatched] Opcode 0x1000000 dispatched to port 4", "severity": "INFO", "createdBy": "guest",
	"extra": {"Opcode": "16777216", "fprime_event_id": "16777217", "fprime_event_name": "CdhCore.cmdDisp.OpCodeDispatched",
	"fprime_severity": "COMMAND", "port": "4"}}`

// seqCountJumpEvent comes from the same archive. fprime-yamcs's packet
// preprocessor raises it inside YAMCS, so it has no extra and no createdBy.
const seqCountJumpEvent = `{"source": "FprimePacketPreprocessor", "generationTime": "2026-09-29T22:54:28.095Z",
	"receptionTime": "2026-09-29T22:54:28.095Z", "seqNumber": 1, "type": "SEQ_COUNT_JUMP",
	"message": "Sequence count jump for APID: 4 old seq: 0 newseq: 0", "severity": "WARNING"}`

func TestLogRecordKeepsYamcsFields(t *testing.T) {
	r := LogRecord(parseEvent(t, dispatchedEvent))
	assert.Equal(t, utc("2026-10-05T22:56:34.620Z"), r.Timestamp())
	assert.Equal(t, utc("2026-10-05T22:56:34.591Z"), r.ObservedTimestamp())
	assert.Equal(t, otellog.SeverityInfo1, r.Severity())
	assert.Empty(t, r.SeverityText())
	assert.Equal(t, "[OpCodeDispatched] Opcode 0x1000000 dispatched to port 4", r.Body().AsString())
	assert.Equal(t, map[string]any{
		"yamcs.severity":                "INFO",
		"yamcs.source":                  "FPrimeEventProcessor",
		"yamcs.type":                    "CdhCore.cmdDisp.OpCodeDispatched",
		"yamcs.seq_number":              int64(6),
		"yamcs.created_by":              "guest",
		"yamcs.extra.Opcode":            "16777216",
		"yamcs.extra.fprime_event_id":   "16777217",
		"yamcs.extra.fprime_event_name": "CdhCore.cmdDisp.OpCodeDispatched",
		"yamcs.extra.fprime_severity":   "COMMAND",
		"yamcs.extra.port":              "4",
	}, attributes(t, r))
}

func TestLogRecordWithoutTypeExtraOrCreatedBy(t *testing.T) {
	r := LogRecord(parseEvent(t, seqCountJumpEvent))
	assert.Equal(t, otellog.SeverityWarn2, r.Severity())
	assert.Equal(t, map[string]any{
		"yamcs.severity":   "WARNING",
		"yamcs.source":     "FprimePacketPreprocessor",
		"yamcs.type":       "SEQ_COUNT_JUMP",
		"yamcs.seq_number": int64(1),
	}, attributes(t, r))

	// We clear the archived event's type to check that yamcs.type is left out.
	e := parseEvent(t, seqCountJumpEvent)
	e.Type = nil
	assert.NotContains(t, attributes(t, LogRecord(e)), "yamcs.type")
}

// We write out the severity numbers rather than otellog's names for them,
// since Loki stores the numbers as severity_number and queries filter on them.
func TestLogRecordSeverities(t *testing.T) {
	for s, want := range map[events.Event_EventSeverity]struct {
		number otellog.Severity
		name   string
	}{
		events.Event_INFO:        {9, "INFO"},
		events.Event_WATCH:       {13, "WATCH"},
		events.Event_WARNING:     {14, "WARNING"},
		events.Event_WARNING_NEW: {14, "WARNING"},
		events.Event_DISTRESS:    {17, "DISTRESS"},
		events.Event_CRITICAL:    {21, "CRITICAL"},
		events.Event_SEVERE:      {22, "SEVERE"},
		events.Event_ERROR:       {22, "SEVERE"},
	} {
		e := parseEvent(t, seqCountJumpEvent)
		e.Severity = s.Enum()
		r := LogRecord(e)
		assert.Equal(t, want.number, r.Severity(), s.String())
		assert.Equal(t, want.name, attributes(t, r)["yamcs.severity"], s.String())
	}
	assert.Len(t, events.Event_EventSeverity_name, 8, "a new YAMCS severity needs a number in severityNumbers")

	// An unset severity reads as INFO, the default events.proto declares.
	e := parseEvent(t, seqCountJumpEvent)
	e.Severity = nil
	r := LogRecord(e)
	assert.Equal(t, otellog.Severity(9), r.Severity())
	assert.Equal(t, "INFO", attributes(t, r)["yamcs.severity"])
}

// We keep events that lack a time, leaving that timestamp unset.
func TestLogRecordTimes(t *testing.T) {
	e := parseEvent(t, dispatchedEvent)
	e.ReceptionTime = nil
	r := LogRecord(e)
	assert.Equal(t, utc("2026-10-05T22:56:34.620Z"), r.Timestamp())
	assert.Zero(t, r.ObservedTimestamp())

	e.GenerationTime = nil
	r = LogRecord(e)
	assert.Zero(t, r.Timestamp())
	assert.Equal(t, "[OpCodeDispatched] Opcode 0x1000000 dispatched to port 4", r.Body().AsString())
}
