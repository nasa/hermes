// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';
import type { Long } from '@grpc/proto-loader';

export interface CommandHistoryAttribute {
  'name'?: (string);
  'value'?: (_yamcs_protobuf_Value | null);
  'time'?: (number | string | Long);
}

export interface CommandHistoryAttribute__Output {
  'name'?: (string);
  'value'?: (_yamcs_protobuf_Value__Output);
  'time'?: (string);
}
