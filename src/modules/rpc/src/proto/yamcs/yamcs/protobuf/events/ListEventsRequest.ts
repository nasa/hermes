// Original file: proto/yamcs/protobuf/events/events_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface ListEventsRequest {
  'instance'?: (string);
  'pos'?: (number | string | Long);
  'limit'?: (number);
  'order'?: (string);
  'severity'?: (string);
  'source'?: (string)[];
  'next'?: (string);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'q'?: (string);
  'filter'?: (string);
}

export interface ListEventsRequest__Output {
  'instance'?: (string);
  'pos'?: (string);
  'limit'?: (number);
  'order'?: (string);
  'severity'?: (string);
  'source'?: (string)[];
  'next'?: (string);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'q'?: (string);
  'filter'?: (string);
}
