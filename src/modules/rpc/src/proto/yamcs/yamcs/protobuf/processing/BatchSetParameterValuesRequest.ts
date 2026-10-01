// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface _yamcs_protobuf_processing_BatchSetParameterValuesRequest_SetParameterValueRequest {
  'id'?: (_yamcs_protobuf_NamedObjectId | null);
  'value'?: (_yamcs_protobuf_Value | null);
  'generationTime'?: (_google_protobuf_Timestamp | null);
  'expiresIn'?: (number | string | Long);
}

export interface _yamcs_protobuf_processing_BatchSetParameterValuesRequest_SetParameterValueRequest__Output {
  'id'?: (_yamcs_protobuf_NamedObjectId__Output);
  'value'?: (_yamcs_protobuf_Value__Output);
  'generationTime'?: (_google_protobuf_Timestamp__Output);
  'expiresIn'?: (string);
}

export interface BatchSetParameterValuesRequest {
  'request'?: (_yamcs_protobuf_processing_BatchSetParameterValuesRequest_SetParameterValueRequest)[];
  'instance'?: (string);
  'processor'?: (string);
}

export interface BatchSetParameterValuesRequest__Output {
  'request'?: (_yamcs_protobuf_processing_BatchSetParameterValuesRequest_SetParameterValueRequest__Output)[];
  'instance'?: (string);
  'processor'?: (string);
}
