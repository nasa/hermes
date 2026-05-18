// Original file: proto/pb/type.proto

import type { FloatKind as _hermes_FloatKind, FloatKind__Output as _hermes_FloatKind__Output } from '../hermes/FloatKind';

export interface FloatType {
  'kind'?: (_hermes_FloatKind);
  'min'?: (number | string);
  'max'?: (number | string);
}

export interface FloatType__Output {
  'kind'?: (_hermes_FloatKind__Output);
  'min'?: (number);
  'max'?: (number);
}
