// Original file: proto/pb/type.proto

import type { IntKind as _hermes_IntKind, IntKind__Output as _hermes_IntKind__Output } from '../hermes/IntKind';
import type { EnumItem as _hermes_EnumItem, EnumItem__Output as _hermes_EnumItem__Output } from '../hermes/EnumItem';

export interface EnumType {
  'name'?: (string);
  'encodeType'?: (_hermes_IntKind);
  'items'?: (_hermes_EnumItem)[];
}

export interface EnumType__Output {
  'name'?: (string);
  'encodeType'?: (_hermes_IntKind__Output);
  'items'?: (_hermes_EnumItem__Output)[];
}
