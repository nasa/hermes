// Original file: proto/pb/type.proto

import type { IntKind as _IntKind, IntKind__Output as _IntKind__Output } from './IntKind';
import type { EnumItem as _EnumItem, EnumItem__Output as _EnumItem__Output } from './EnumItem';

export interface EnumType {
  'name'?: (string);
  'encodeType'?: (_IntKind);
  'items'?: (_EnumItem)[];
}

export interface EnumType__Output {
  'name'?: (string);
  'encodeType'?: (_IntKind__Output);
  'items'?: (_EnumItem__Output)[];
}
