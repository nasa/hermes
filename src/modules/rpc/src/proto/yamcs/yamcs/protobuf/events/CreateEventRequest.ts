// Original file: proto/yamcs/protobuf/events/events_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface CreateEventRequest {
  'instance'?: (string);
  'type'?: (string);
  'message'?: (string);
  'severity'?: (string);
  'time'?: (_google_protobuf_Timestamp | null);
  'source'?: (string);
  'sequenceNumber'?: (number);
  'extra'?: ({[key: string]: string});
}

export interface CreateEventRequest__Output {
  'instance'?: (string);
  'type'?: (string);
  'message'?: (string);
  'severity'?: (string);
  'time'?: (_google_protobuf_Timestamp__Output);
  'source'?: (string);
  'sequenceNumber'?: (number);
  'extra'?: ({[key: string]: string});
}
