// Original file: proto/pb/type.proto

import type { NumberKind as _hermes_NumberKind, NumberKind__Output as _hermes_NumberKind__Output } from '../hermes/NumberKind';
import type { BoundedArraySize as _hermes_BoundedArraySize, BoundedArraySize__Output as _hermes_BoundedArraySize__Output } from '../hermes/BoundedArraySize';
import type { UIntKind as _hermes_UIntKind, UIntKind__Output as _hermes_UIntKind__Output } from '../hermes/UIntKind';

export interface BytesType {
  'name'?: (string);
  'kind'?: (_hermes_NumberKind);
  'static'?: (number);
  'dynamic'?: (_hermes_BoundedArraySize | null);
  'lengthType'?: (_hermes_UIntKind);
  'size'?: "static"|"dynamic";
}

export interface BytesType__Output {
  'name'?: (string);
  'kind'?: (_hermes_NumberKind__Output);
  'static'?: (number);
  'dynamic'?: (_hermes_BoundedArraySize__Output);
  'lengthType'?: (_hermes_UIntKind__Output);
}
