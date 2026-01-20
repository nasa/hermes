// Original file: proto/pb/dictionary.proto

import type { Type as _Type, Type__Output as _Type__Output } from './Type';

export interface ParameterDef {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'type'?: (_Type | null);
  'metadata'?: (string);
}

export interface ParameterDef__Output {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'type'?: (_Type__Output);
  'metadata'?: (string);
}
