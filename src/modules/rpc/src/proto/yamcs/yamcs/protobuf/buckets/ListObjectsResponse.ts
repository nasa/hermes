// Original file: proto/yamcs/protobuf/buckets/buckets.proto

import type { ObjectInfo as _yamcs_protobuf_buckets_ObjectInfo, ObjectInfo__Output as _yamcs_protobuf_buckets_ObjectInfo__Output } from '../../../yamcs/protobuf/buckets/ObjectInfo';

export interface ListObjectsResponse {
  'prefixes'?: (string)[];
  'objects'?: (_yamcs_protobuf_buckets_ObjectInfo)[];
}

export interface ListObjectsResponse__Output {
  'prefixes'?: (string)[];
  'objects'?: (_yamcs_protobuf_buckets_ObjectInfo__Output)[];
}
