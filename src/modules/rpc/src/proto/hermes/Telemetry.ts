// Original file: proto/pb/bus.proto

import type { TelemetryRef as _hermes_TelemetryRef, TelemetryRef__Output as _hermes_TelemetryRef__Output } from '../hermes/TelemetryRef';
import type { Time as _hermes_Time, Time__Output as _hermes_Time__Output } from '../hermes/Time';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from '../hermes/Value';

export interface Telemetry {
  'ref'?: (_hermes_TelemetryRef | null);
  'time'?: (_hermes_Time | null);
  'value'?: (_hermes_Value | null);
  'labels'?: ({[key: string]: string});
}

export interface Telemetry__Output {
  'ref'?: (_hermes_TelemetryRef__Output);
  'time'?: (_hermes_Time__Output);
  'value'?: (_hermes_Value__Output);
  'labels'?: ({[key: string]: string});
}
