// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface StreamCommandsRequest {
  'instance'?: (string);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'name'?: (string)[];
}

export interface StreamCommandsRequest__Output {
  'instance'?: (string);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'name'?: (string)[];
}
