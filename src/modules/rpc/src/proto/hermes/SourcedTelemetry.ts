// Original file: proto/pb/bus.proto

import type { Telemetry as _Telemetry, Telemetry__Output as _Telemetry__Output } from './Telemetry';
import type { SourceContext as _SourceContext, SourceContext__Output as _SourceContext__Output } from './SourceContext';

export interface SourcedTelemetry {
  'telemetry'?: (_Telemetry | null);
  'source'?: (string);
  'context'?: (_SourceContext);
}

export interface SourcedTelemetry__Output {
  'telemetry'?: (_Telemetry__Output);
  'source'?: (string);
  'context'?: (_SourceContext__Output);
}
