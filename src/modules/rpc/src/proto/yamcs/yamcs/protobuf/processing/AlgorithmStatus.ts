// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface AlgorithmStatus {
  'active'?: (boolean);
  'traceEnabled'?: (boolean);
  'runCount'?: (number);
  'lastRun'?: (_google_protobuf_Timestamp | null);
  'errorCount'?: (number);
  'errorMessage'?: (string);
  'errorTime'?: (_google_protobuf_Timestamp | null);
  'execTimeNs'?: (number | string | Long);
}

export interface AlgorithmStatus__Output {
  'active'?: (boolean);
  'traceEnabled'?: (boolean);
  'runCount'?: (number);
  'lastRun'?: (_google_protobuf_Timestamp__Output);
  'errorCount'?: (number);
  'errorMessage'?: (string);
  'errorTime'?: (_google_protobuf_Timestamp__Output);
  'execTimeNs'?: (string);
}
