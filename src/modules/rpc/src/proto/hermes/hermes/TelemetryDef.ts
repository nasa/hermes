// Original file: proto/pb/dictionary.proto

import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from '../hermes/Type';

export interface TelemetryDef {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'type'?: (_hermes_Type | null);
  'metadata'?: (string);
}

export interface TelemetryDef__Output {
  'id'?: (number);
  'name'?: (string);
  'component'?: (string);
  'type'?: (_hermes_Type__Output);
  'metadata'?: (string);
}
