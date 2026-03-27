// Original file: proto/pb/type.proto

import type { EnumValue as _hermes_EnumValue, EnumValue__Output as _hermes_EnumValue__Output } from '../hermes/EnumValue';
import type { ObjectValue as _hermes_ObjectValue, ObjectValue__Output as _hermes_ObjectValue__Output } from '../hermes/ObjectValue';
import type { ArrayValue as _hermes_ArrayValue, ArrayValue__Output as _hermes_ArrayValue__Output } from '../hermes/ArrayValue';
import type { BytesValue as _hermes_BytesValue, BytesValue__Output as _hermes_BytesValue__Output } from '../hermes/BytesValue';
import type { Long } from '@grpc/proto-loader';

export interface Value {
  'i'?: (number | string | Long);
  'u'?: (number | string | Long);
  'f'?: (number | string);
  'b'?: (boolean);
  's'?: (string);
  'e'?: (_hermes_EnumValue | null);
  'o'?: (_hermes_ObjectValue | null);
  'a'?: (_hermes_ArrayValue | null);
  'r'?: (_hermes_BytesValue | null);
  'value'?: "i"|"u"|"f"|"b"|"s"|"e"|"o"|"a"|"r";
}

export interface Value__Output {
  'i'?: (Long);
  'u'?: (Long);
  'f'?: (number);
  'b'?: (boolean);
  's'?: (string);
  'e'?: (_hermes_EnumValue__Output);
  'o'?: (_hermes_ObjectValue__Output);
  'a'?: (_hermes_ArrayValue__Output);
  'r'?: (_hermes_BytesValue__Output);
}
