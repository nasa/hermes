// Original file: proto/pb/type.proto

import type { Type as _Type, Type__Output as _Type__Output } from './Type';
import type { Value as _Value, Value__Output as _Value__Output } from './Value';

export interface Field {
  'name'?: (string);
  'type'?: (_Type | null);
  'metadata'?: (string);
  'value'?: (_Value | null);
}

export interface Field__Output {
  'name'?: (string);
  'type'?: (_Type__Output);
  'metadata'?: (string);
  'value'?: (_Value__Output);
}
