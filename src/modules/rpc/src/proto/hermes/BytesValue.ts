// Original file: proto/pb/type.proto

import type { NumberKind as _hermes_NumberKind, NumberKind__Output as _hermes_NumberKind__Output } from '../hermes/NumberKind';

export interface BytesValue {
  'kind'?: (_hermes_NumberKind);
  'bigEndian'?: (boolean);
  'value'?: (Buffer | Uint8Array | string);
}

export interface BytesValue__Output {
  'kind'?: (_hermes_NumberKind__Output);
  'bigEndian'?: (boolean);
  'value'?: (Buffer);
}
