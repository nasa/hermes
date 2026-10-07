// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { Long } from '@grpc/proto-loader';

export interface BatchGetParameterValuesRequest {
  'id'?: (_yamcs_protobuf_NamedObjectId)[];
  'fromCache'?: (boolean);
  'timeout'?: (number | string | Long);
  'instance'?: (string);
  'processor'?: (string);
}

export interface BatchGetParameterValuesRequest__Output {
  'id'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'fromCache'?: (boolean);
  'timeout'?: (string);
  'instance'?: (string);
  'processor'?: (string);
}
