package host

import (
	"github.com/nasa/hermes/pkg/pb"
)

// Configured profiles, their providers and their connection state
var Profiles = newProfileRegistry()

// Registered dictionaries
var Dictionaries = newDictionaryRegistry()

// EVR message bus
var Event = NewBus[*pb.SourcedEvent]("EventBus")

// Telemetry message bus
var Telemetry = NewBus[*pb.SourcedTelemetry]("TelemetryBus")

// File downlink message bus
var Downlink = NewBus[*pb.FileDownlink]("DownlinkBus")
