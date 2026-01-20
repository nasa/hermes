package infra

import "go.opentelemetry.io/otel"

var Meter = otel.Meter("hermes")
var Tracer = otel.Tracer("hermes")
