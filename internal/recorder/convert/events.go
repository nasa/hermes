package convert

import (
	"maps"
	"slices"
	"time"

	otellog "go.opentelemetry.io/otel/log"

	"github.com/nasa/hermes/internal/yamcspb/protobuf/events"
)

// fprimeSeverities gives each F Prime severity the level that LogLevel in
// pkg/pb/log.go gives it, as an OpenTelemetry severity number that Loki turns
// into the level Grafana shows. Higher numbers are more severe, so queries can
// filter on severity_number.
var fprimeSeverities = map[string]otellog.Severity{
	"DIAGNOSTIC":  otellog.SeverityTrace1,
	"COMMAND":     otellog.SeverityDebug1,
	"ACTIVITY_LO": otellog.SeverityInfo1,
	"ACTIVITY_HI": otellog.SeverityInfo2,
	"WARNING_LO":  otellog.SeverityWarn1,
	"WARNING_HI":  otellog.SeverityError1,
	"FATAL":       otellog.SeverityFatal1,
}

// fprimeCounterparts reverses how fprime-yamcs converts F Prime severities to
// YAMCS ones, such as ACTIVITY_HI to WATCH. An event raised inside YAMCS has no
// F Prime severity, so we give it the level of the F Prime severity listed here
// for its YAMCS severity.
var fprimeCounterparts = map[events.Event_EventSeverity]string{
	// fprime-yamcs converts COMMAND and DIAGNOSTIC to INFO too
	events.Event_INFO:        "ACTIVITY_LO",
	events.Event_WATCH:       "ACTIVITY_HI",
	events.Event_WARNING:     "WARNING_LO",
	events.Event_WARNING_NEW: "WARNING_LO",
	events.Event_DISTRESS:    "WARNING_HI",
	events.Event_CRITICAL:    "FATAL",
	events.Event_SEVERE:      "FATAL",
	events.Event_ERROR:       "FATAL",
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
		// YAMCS gives the generation time to the millisecond. We add the last six
		// digits of the sequence number as nanoseconds so events from one millisecond
		// stay in order.
		r.SetTimestamp(e.GetGenerationTime().AsTime().Add(time.Duration(e.GetSeqNumber() % 1_000_000)))
	}
	if e.ReceptionTime != nil {
		r.SetObservedTimestamp(e.GetReceptionTime().AsTime())
	}
	// Loki reads the level from the severity text when there is one, and it does
	// not know names like ACTIVITY_HI or WATCH, so Grafana would show those with
	// no level. We leave the text unset and keep the names in yamcs.severity and
	// yamcs.extra.fprime_severity.
	r.SetSeverity(severity(e))
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

// severity returns the OpenTelemetry severity number of e.
func severity(e *events.Event) otellog.Severity {
	// fprime-yamcs puts an F Prime event's own severity, like ACTIVITY_HI, in extra
	if s, ok := fprimeSeverities[e.GetExtra()["fprime_severity"]]; ok {
		return s
	}
	return fprimeSeverities[fprimeCounterparts[e.GetSeverity()]]
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
