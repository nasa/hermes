// Original file: proto/pb/type.proto

import type { EnumValue as _EnumValue, EnumValue__Output as _EnumValue__Output } from './EnumValue';
import type { ObjectValue as _ObjectValue, ObjectValue__Output as _ObjectValue__Output } from './ObjectValue';
import type { ArrayValue as _ArrayValue, ArrayValue__Output as _ArrayValue__Output } from './ArrayValue';
import type { BytesValue as _BytesValue, BytesValue__Output as _BytesValue__Output } from './BytesValue';
import type { Long } from '@grpc/proto-loader';

export interface Value {
  'i'?: (number | string | Long);
  'u'?: (number | string | Long);
  'f'?: (number | string);
  'b'?: (boolean);
  's'?: (string);
  'e'?: (_EnumValue | null);
  'o'?: (_ObjectValue | null);
  'a'?: (_ArrayValue | null);
  'r'?: (_BytesValue | null);
  'value'?: "i"|"u"|"f"|"b"|"s"|"e"|"o"|"a"|"r";
}

export interface Value__Output {
  'i'?: (Long);
  'u'?: (Long);
  'f'?: (number);
  'b'?: (boolean);
  's'?: (string);
  'e'?: (_EnumValue__Output);
  'o'?: (_ObjectValue__Output);
  'a'?: (_ArrayValue__Output);
  'r'?: (_BytesValue__Output);
}
