// Original file: proto/pb/type.proto

import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from '../hermes/Type';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from '../hermes/Value';

export interface Field {
  'name'?: (string);
  'type'?: (_hermes_Type | null);
  'metadata'?: (string);
  'value'?: (_hermes_Value | null);
}

export interface Field__Output {
  'name'?: (string);
  'type'?: (_hermes_Type__Output);
  'metadata'?: (string);
  'value'?: (_hermes_Value__Output);
}
