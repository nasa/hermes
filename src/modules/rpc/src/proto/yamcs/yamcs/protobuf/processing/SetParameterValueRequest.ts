// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface SetParameterValueRequest {
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'value'?: (_yamcs_protobuf_Value | null);
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'expiresIn'?: (number | string | Long);
}

export interface SetParameterValueRequest__Output {
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'value'?: (_yamcs_protobuf_Value__Output);
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'expiresIn'?: (string);
}
