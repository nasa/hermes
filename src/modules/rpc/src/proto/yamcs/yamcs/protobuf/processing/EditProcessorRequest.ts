// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface EditProcessorRequest {
  'instance'?: (string);
  'processor'?: (string);
  'state'?: (string);
  'seek'?: (_google_protobuf_Timestamp | null);
  'speed'?: (string);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'loop'?: (boolean);
}

export interface EditProcessorRequest__Output {
  'instance'?: (string);
  'processor'?: (string);
  'state'?: (string);
  'seek'?: (_google_protobuf_Timestamp__Output);
  'speed'?: (string);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'loop'?: (boolean);
}
