// Original file: proto/pb/type.proto

import type { NumberKind as _NumberKind, NumberKind__Output as _NumberKind__Output } from './NumberKind';
import type { BoundedArraySize as _BoundedArraySize, BoundedArraySize__Output as _BoundedArraySize__Output } from './BoundedArraySize';
import type { UIntKind as _UIntKind, UIntKind__Output as _UIntKind__Output } from './UIntKind';

export interface BytesType {
  'name'?: (string);
  'kind'?: (_NumberKind);
  'static'?: (number);
  'dynamic'?: (_BoundedArraySize | null);
  'lengthType'?: (_UIntKind);
  'size'?: "static"|"dynamic";
}

export interface BytesType__Output {
  'name'?: (string);
  'kind'?: (_NumberKind__Output);
  'static'?: (number);
  'dynamic'?: (_BoundedArraySize__Output);
  'lengthType'?: (_UIntKind__Output);
}
