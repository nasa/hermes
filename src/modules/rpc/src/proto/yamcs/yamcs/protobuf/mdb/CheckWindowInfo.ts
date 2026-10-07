// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { Long } from '@grpc/proto-loader';

export interface CheckWindowInfo {
  'timeToStartChecking'?: (number | string | Long);
  'timeToStopChecking'?: (number | string | Long);
  'relativeTo'?: (string);
}

export interface CheckWindowInfo__Output {
  'timeToStartChecking'?: (string);
  'timeToStopChecking'?: (string);
  'relativeTo'?: (string);
}
