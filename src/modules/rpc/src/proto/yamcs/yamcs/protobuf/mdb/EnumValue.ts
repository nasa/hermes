// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { Long } from '@grpc/proto-loader';

export interface EnumValue {
  'value'?: (number | string | Long);
  'label'?: (string);
  'description'?: (string);
}

export interface EnumValue__Output {
  'value'?: (string);
  'label'?: (string);
  'description'?: (string);
}
