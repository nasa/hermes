// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface ListCommandsRequest {
  'instance'?: (string);
  'pos'?: (number | string | Long);
  'limit'?: (number);
  'order'?: (string);
  'q'?: (string);
  'next'?: (string);
  'start'?: (_google_protobuf_Timestamp | null);
  'stop'?: (_google_protobuf_Timestamp | null);
  'queue'?: (string);
}

export interface ListCommandsRequest__Output {
  'instance'?: (string);
  'pos'?: (string);
  'limit'?: (number);
  'order'?: (string);
  'q'?: (string);
  'next'?: (string);
  'start'?: (_google_protobuf_Timestamp__Output);
  'stop'?: (_google_protobuf_Timestamp__Output);
  'queue'?: (string);
}
