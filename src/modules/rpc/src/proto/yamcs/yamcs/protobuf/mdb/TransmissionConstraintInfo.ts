// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { Long } from '@grpc/proto-loader';

export interface TransmissionConstraintInfo {
  'timeout'?: (number | string | Long);
  'expression'?: (string);
}

export interface TransmissionConstraintInfo__Output {
  'timeout'?: (string);
  'expression'?: (string);
}
