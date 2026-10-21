// Original file: proto/yamcs/protobuf/buckets/buckets.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface ObjectInfo {
  'name'?: (string);
  'created'?: (_google_protobuf_Timestamp | null);
  'size'?: (number | string | Long);
  'metadata'?: ({[key: string]: string});
  'contentType'?: (string);
}

export interface ObjectInfo__Output {
  'name'?: (string);
  'created'?: (_google_protobuf_Timestamp__Output);
  'size'?: (string);
  'metadata'?: ({[key: string]: string});
  'contentType'?: (string);
}
