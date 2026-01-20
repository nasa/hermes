// Original file: proto/pb/bus.proto

import type { TelemetryRef as _TelemetryRef, TelemetryRef__Output as _TelemetryRef__Output } from './TelemetryRef';
import type { Time as _Time, Time__Output as _Time__Output } from './Time';
import type { Value as _Value, Value__Output as _Value__Output } from './Value';

export interface Telemetry {
  'ref'?: (_TelemetryRef | null);
  'time'?: (_Time | null);
  'value'?: (_Value | null);
  'labels'?: ({[key: string]: string});
}

export interface Telemetry__Output {
  'ref'?: (_TelemetryRef__Output);
  'time'?: (_Time__Output);
  'value'?: (_Value__Output);
  'labels'?: ({[key: string]: string});
}
