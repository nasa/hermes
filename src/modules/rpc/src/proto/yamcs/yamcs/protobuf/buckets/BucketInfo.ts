// Original file: proto/yamcs/protobuf/buckets/buckets.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { BucketLocation as _yamcs_protobuf_buckets_BucketLocation, BucketLocation__Output as _yamcs_protobuf_buckets_BucketLocation__Output } from '../../../yamcs/protobuf/buckets/BucketLocation';
import type { Long } from '@grpc/proto-loader';

export interface BucketInfo {
  'name'?: (string);
  'size'?: (number | string | Long);
  'numObjects'?: (number);
  'maxSize'?: (number | string | Long);
  'maxObjects'?: (number);
  'created'?: (_google_protobuf_Timestamp | null);
  'directory'?: (string);
  'location'?: (_yamcs_protobuf_buckets_BucketLocation | null);
}

export interface BucketInfo__Output {
  'name'?: (string);
  'size'?: (string);
  'numObjects'?: (number);
  'maxSize'?: (string);
  'maxObjects'?: (number);
  'created'?: (_google_protobuf_Timestamp__Output);
  'directory'?: (string);
  'location'?: (_yamcs_protobuf_buckets_BucketLocation__Output);
}
