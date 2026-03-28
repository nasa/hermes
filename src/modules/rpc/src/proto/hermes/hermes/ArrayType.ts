// Original file: proto/pb/type.proto

import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from '../hermes/Type';
import type { BoundedArraySize as _hermes_BoundedArraySize, BoundedArraySize__Output as _hermes_BoundedArraySize__Output } from '../hermes/BoundedArraySize';
import type { UIntKind as _hermes_UIntKind, UIntKind__Output as _hermes_UIntKind__Output } from '../hermes/UIntKind';

export interface ArrayType {
  'name'?: (string);
  'elType'?: (_hermes_Type | null);
  'static'?: (number);
  'dynamic'?: (_hermes_BoundedArraySize | null);
  'lengthType'?: (_hermes_UIntKind);
  'size'?: "static"|"dynamic";
}

export interface ArrayType__Output {
  'name'?: (string);
  'elType'?: (_hermes_Type__Output);
  'static'?: (number);
  'dynamic'?: (_hermes_BoundedArraySize__Output);
  'lengthType'?: (_hermes_UIntKind__Output);
}
