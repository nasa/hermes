// Original file: proto/pb/type.proto

import type { FloatKind as _FloatKind, FloatKind__Output as _FloatKind__Output } from './FloatKind';

export interface FloatType {
  'kind'?: (_FloatKind);
  'min'?: (number | string);
  'max'?: (number | string);
}

export interface FloatType__Output {
  'kind'?: (_FloatKind__Output);
  'min'?: (number);
  'max'?: (number);
}
