// Original file: proto/pb/type.proto

import type { NumberKind as _NumberKind, NumberKind__Output as _NumberKind__Output } from './NumberKind';

export interface BytesValue {
  'kind'?: (_NumberKind);
  'bigEndian'?: (boolean);
  'value'?: (Buffer | Uint8Array | string);
}

export interface BytesValue__Output {
  'kind'?: (_NumberKind__Output);
  'bigEndian'?: (boolean);
  'value'?: (Buffer);
}
