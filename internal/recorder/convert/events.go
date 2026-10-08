package convert

import (
	"maps"
	"slices"

	otellog "go.opentelemetry.io/otel/log"

	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
)

// severityNumbers puts each YAMCS severity in an OpenTelemetry band (info,
// warn, error or fatal), which Loki turns into the level Grafana shows, and
// numbers them in YAMCS's order so queries can filter on severity_number. We
// put CRITICAL in fatal so it shows apart from DISTRESS, since fprime-yamcs
// sends F Prime's FATAL as CRITICAL and WARNING_HI as DISTRESS. YAMCS already
// sends its deprecated ERROR as SEVERE, so we number ERROR the same.
var severityNumbers = map[events.Event_EventSeverity]otellog.Severity{
	events.Event_INFO:        otellog.SeverityInfo1,
	events.Event_WATCH:       otellog.SeverityWarn1,
	events.Event_WARNING:     otellog.SeverityWarn2,
	events.Event_WARNING_NEW: otellog.SeverityWarn2,
	events.Event_DISTRESS:    otellog.SeverityError1,
	events.Event_CRITICAL:    otellog.SeverityFatal1,
	events.Event_SEVERE:      otellog.SeverityFatal2,
	events.Event_ERROR:       otellog.SeverityFatal2,
}

// LogRecord converts an event to an OpenTelemetry log record with the message
// as its body. The timestamp is the generation time and the observed timestamp
// the reception time. The SDK sets a missing observed timestamp to the time we
// emit the record, and Loki uses the observed timestamp when the timestamp is
// missing, so we keep an event that lacks either time and leave that timestamp
// unset. The other fields become attributes under "yamcs.", and each extra
// entry becomes one under "yamcs.extra.".
func LogRecord(e *events.Event) otellog.Record {
	var r otellog.Record
	if e.GenerationTime != nil {
		r.SetTimestamp(e.GetGenerationTime().AsTime())
	}
	if e.ReceptionTime != nil {
		r.SetObservedTimestamp(e.GetReceptionTime().AsTime())
	}
	// Loki reads the level from the severity text when there is one, and it does
	// not know WATCH, DISTRESS or SEVERE, so Grafana would show those with no
	// level. We leave the text unset and keep the YAMCS name in yamcs.severity.
	r.SetSeverity(severityNumbers[e.GetSeverity()])
	r.SetBody(otellog.StringValue(e.GetMessage()))

	r.AddAttributes(
		otellog.String("yamcs.severity", severityName(e.GetSeverity())),
		otellog.String("yamcs.source", e.GetSource()),
		otellog.Int64("yamcs.seq_number", int64(e.GetSeqNumber())),
	)
	// Not every YAMCS event has a type, and only events posted through the YAMCS
	// API have createdBy, so we add yamcs.type and yamcs.created_by only when set.
	if e.GetType() != "" {
		r.AddAttributes(otellog.String("yamcs.type", e.GetType()))
	}
	if e.GetCreatedBy() != "" {
		r.AddAttributes(otellog.String("yamcs.created_by", e.GetCreatedBy()))
	}
	// fprime-yamcs puts each F Prime event argument in extra under its own name.
	// Loki reads the level from an attribute named level or severity, among
	// others, before the severity number, and the SDK keeps only the last of two
	// attributes with the same name. So we put extra under "yamcs.extra.", where
	// an argument can neither set the level nor replace a YAMCS field. We add the
	// entries in key order so the same event always gives an identical record,
	// which Loki stores only once if two recorders export it.
	for _, k := range slices.Sorted(maps.Keys(e.GetExtra())) {
		r.AddAttributes(otellog.String("yamcs.extra."+k, e.GetExtra()[k]))
	}
	return r
}

// severityName returns the name of s, with WARNING_NEW named WARNING and ERROR
// named SEVERE. YAMCS already sends ERROR as SEVERE. It plans to move WARNING
// to number 4, which our copy of events.proto calls WARNING_NEW, so its
// warnings will then arrive as WARNING_NEW.
func severityName(s events.Event_EventSeverity) string {
	switch s {
	case events.Event_WARNING_NEW:
		return events.Event_WARNING.String()
	case events.Event_ERROR:
		return events.Event_SEVERE.String()
	}
	return s.String()
}
