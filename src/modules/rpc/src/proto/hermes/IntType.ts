// Original file: proto/pb/type.proto

import type { IntKind as _IntKind, IntKind__Output as _IntKind__Output } from './IntKind';
import type { Long } from '@grpc/proto-loader';

export interface IntType {
  'kind'?: (_IntKind);
  'min'?: (number | string | Long);
  'max'?: (number | string | Long);
}

export interface IntType__Output {
  'kind'?: (_IntKind__Output);
  'min'?: (Long);
  'max'?: (Long);
}
