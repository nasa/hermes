// Original file: proto/pb/bus.proto

import type { Telemetry as _hermes_Telemetry, Telemetry__Output as _hermes_Telemetry__Output } from '../hermes/Telemetry';
import type { SourceContext as _hermes_SourceContext, SourceContext__Output as _hermes_SourceContext__Output } from '../hermes/SourceContext';

export interface SourcedTelemetry {
  'telemetry'?: (_hermes_Telemetry | null);
  'source'?: (string);
  'context'?: (_hermes_SourceContext);
}

export interface SourcedTelemetry__Output {
  'telemetry'?: (_hermes_Telemetry__Output);
  'source'?: (string);
  'context'?: (_hermes_SourceContext__Output);
}
