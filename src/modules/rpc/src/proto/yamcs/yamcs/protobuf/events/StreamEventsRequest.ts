// Original file: proto/yamcs/protobuf/events/events_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface StreamEventsRequest {
  'instance'?: (string);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'source'?: (string)[];
  'severity'?: (string);
  'q'?: (string);
  'filter'?: (string);
}

export interface StreamEventsRequest__Output {
  'instance'?: (string);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'source'?: (string)[];
  'severity'?: (string);
  'q'?: (string);
  'filter'?: (string);
}
