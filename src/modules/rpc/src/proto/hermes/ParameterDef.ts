// Original file: proto/pb/dictionary.proto

import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from '../hermes/Type';

export interface ParameterDef {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'type'?: (_hermes_Type | null);
  'metadata'?: (string);
}

export interface ParameterDef__Output {
  'id'?: (number);
  'component'?: (string);
  'name'?: (string);
  'type'?: (_hermes_Type__Output);
  'metadata'?: (string);
}
