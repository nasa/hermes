// Original file: proto/pb/type.proto

import type { IntKind as _hermes_IntKind, IntKind__Output as _hermes_IntKind__Output } from '../hermes/IntKind';
import type { Long } from '@grpc/proto-loader';

export interface IntType {
  'kind'?: (_hermes_IntKind);
  'min'?: (number | string | Long);
  'max'?: (number | string | Long);
}

export interface IntType__Output {
  'kind'?: (_hermes_IntKind__Output);
  'min'?: (Long);
  'max'?: (Long);
}
