// Original file: proto/yamcs/protobuf/config/config.proto

import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../google/protobuf/Value';

export interface WhenConditionInfo {
  'key'?: (string);
  'value'?: (_google_protobuf_Value | null);
  'requiredKeys'?: (string)[];
}

export interface WhenConditionInfo__Output {
  'key'?: (string);
  'value'?: (_google_protobuf_Value__Output);
  'requiredKeys'?: (string)[];
}
