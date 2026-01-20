package pb

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"time"
)

func (e EvrSeverity) LogLevel() string {
	switch e {
	case EvrSeverity_EVR_DIAGNOSTIC:
		return "trace"
	case EvrSeverity_EVR_WARNING_LOW:
		return "warning"
	case EvrSeverity_EVR_WARNING_HIGH:
		return "error"
	case EvrSeverity_EVR_COMMAND:
		return "debug"
	case EvrSeverity_EVR_ACTIVITY_LOW, EvrSeverity_EVR_ACTIVITY_HIGH:
		return "info"
	case EvrSeverity_EVR_FATAL:
		return "fatal"
	}

	return "unknown"
}

func (e EvrSeverity) LogLevelRaw() string {
	switch e {
	case EvrSeverity_EVR_DIAGNOSTIC:
		return "DIAGNOSTIC"
	case EvrSeverity_EVR_WARNING_LOW:
		return "WARNING_LO"
	case EvrSeverity_EVR_WARNING_HIGH:
		return "WARNING_HI"
	case EvrSeverity_EVR_COMMAND:
		return "COMMAND"
	case EvrSeverity_EVR_ACTIVITY_LOW:
		return "ACTIVITY_LO"
	case EvrSeverity_EVR_ACTIVITY_HIGH:
		return "ACTIVITY_HI"
	case EvrSeverity_EVR_FATAL:
		return "FATAL"
	}

	return "UNKNOWN"
}

func (e *Event) Record() slog.Record {
	if e == nil {
		return slog.NewRecord(time.Now(), slog.LevelError, "invalid event record <nil>", 0)
	}

	rec := slog.NewRecord(
		e.GetTime().AsTime(),
		// Overriden by "severity" field
		// Slog does not support all the levels OTEL does
		-10,
		e.GetMessage(),
		0,
	)

	rec.Add(
		"severity", e.GetRef().GetSeverity().LogLevel(),
		"id", e.GetRef().GetId(),
		"severity_text", e.GetRef().GetSeverity().LogLevelRaw(),
		"component", e.GetRef().GetComponent(),
		"name", e.GetRef().GetName(),
		"args", ArgsToMap(e.GetArgs(), e.GetRef().GetArguments()),
	)

	if e.GetTime().HasSclk() {
		rec.Add("sclk", e.GetTime().SclkS())
	}

	for k, v := range e.Tags {
		v, err := ValueToAny(v, ConversionOptions{})
		if err == nil {
			rec.Add(k, v)
		}
	}

	return rec
}

func (t *Telemetry) Record() slog.Record {
	if t == nil {
		return slog.NewRecord(time.Now(), slog.LevelError, "invalid telemetry record <nil>", 0)
	}

	rec := slog.NewRecord(
		t.GetTime().AsTime(),
		// Overriden by "severity" field
		// Slog does not support all the levels OTEL does
		slog.LevelDebug,
		fmt.Sprintf("%s.%s", t.GetRef().GetComponent(), t.GetRef().GetName()),
		0,
	)

	v, err := ValueToAny(t.GetValue(), ConversionOptions{})
	if err != nil {
		rec.Add("err", err)
	} else {
		rec.Add(
			"id", t.GetRef().GetId(),
			"component", t.GetRef().GetComponent(),
			"name", t.GetRef().GetName(),
			"value", v,
		)

		if t.GetTime().HasSclk() {
			rec.Add("sclk", t.GetTime().SclkS())
		}
	}

	return rec
}

func (downlink *FileDownlink) Record() slog.Record {
	if downlink == nil {
		return slog.NewRecord(time.Now(), slog.LevelError, "invalid downlink record <nil>", 0)
	}

	// Calculate and format data for missing chunks
	missingBytes := 0
	for _, chunk := range downlink.MissingChunks {
		missingBytes += int(chunk.Size)
	}

	var missingChunksStr string
	missingChunks, err := json.Marshal(downlink.GetMissingChunks())
	if err != nil {
		missingChunksStr = fmt.Sprintf("error: %v", err)
	} else {
		missingChunksStr = string(missingChunks)
	}

	// Calculate and format data for duplicate chunks
	duplicateBytes := 0
	for _, chunk := range downlink.DuplicateChunks {
		duplicateBytes += int(chunk.Size)
	}

	var duplicateChunksStr string
	duplicateChunks, err := json.Marshal(downlink.GetDuplicateChunks())
	if err != nil {
		duplicateChunksStr = fmt.Sprintf("error: %v", err)
	} else {
		duplicateChunksStr = string(duplicateChunks)
	}

	// Create grafana log record with custom labels
	record := slog.NewRecord(
		downlink.GetTimeEnd().AsTime(),
		0,
		downlink.GetStatus().String(),
		0,
	)
	record.Add(
		"uid", downlink.GetUid(),
		"time_start", downlink.GetTimeStart().AsTime().UnixMilli(),
		"time_end", downlink.GetTimeEnd().AsTime().UnixMilli(),
		"status", downlink.GetStatus().String(),
		"source", downlink.GetSource(),
		"source_path", downlink.GetSourcePath(),
		"destination_path", downlink.GetDestinationPath(),
		"file_path", downlink.GetFilePath(),
		"missing_chunks", missingChunksStr,
		"missing_bytes", missingBytes,
		"duplicate_chunks", duplicateChunksStr,
		"duplicate_bytes", duplicateBytes,
		"file_size", downlink.GetSize(),
	)

	return record
}
