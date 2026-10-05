// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { Long } from '@grpc/proto-loader';

export interface GetParameterValueRequest {
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'fromCache'?: (boolean);
  'timeout'?: (number | string | Long);
}

export interface GetParameterValueRequest__Output {
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'fromCache'?: (boolean);
  'timeout'?: (string);
}
