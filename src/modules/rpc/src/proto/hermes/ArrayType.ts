// Original file: proto/pb/type.proto

import type { Type as _Type, Type__Output as _Type__Output } from './Type';
import type { BoundedArraySize as _BoundedArraySize, BoundedArraySize__Output as _BoundedArraySize__Output } from './BoundedArraySize';
import type { UIntKind as _UIntKind, UIntKind__Output as _UIntKind__Output } from './UIntKind';

export interface ArrayType {
  'name'?: (string);
  'elType'?: (_Type | null);
  'static'?: (number);
  'dynamic'?: (_BoundedArraySize | null);
  'lengthType'?: (_UIntKind);
  'size'?: "static"|"dynamic";
}

export interface ArrayType__Output {
  'name'?: (string);
  'elType'?: (_Type__Output);
  'static'?: (number);
  'dynamic'?: (_BoundedArraySize__Output);
  'lengthType'?: (_UIntKind__Output);
}
