// Original file: proto/pb/dictionary.proto

import type { Type as _Type, Type__Output as _Type__Output } from './Type';

export interface TelemetryDef {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'type'?: (_Type | null);
  'metadata'?: (string);
}

export interface TelemetryDef__Output {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'type'?: (_Type__Output);
  'metadata'?: (string);
}
