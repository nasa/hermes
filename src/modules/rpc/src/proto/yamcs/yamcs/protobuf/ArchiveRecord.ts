// Original file: proto/yamcs/protobuf/yamcs.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../yamcs/protobuf/NamedObjectId';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface ArchiveRecord {
  'id'?: (_yamcs_protobuf_NamedObjectId | null);
  'num'?: (number);
  'seqFirst'?: (number | string | Long);
  'seqLast'?: (number | string | Long);
  'first'?: (_google_protobuf_Timestamp | null);
  'last'?: (_google_protobuf_Timestamp | null);
  'extra'?: ({[key: string]: string});
}

export interface ArchiveRecord__Output {
  'id'?: (_yamcs_protobuf_NamedObjectId__Output);
  'num'?: (number);
  'seqFirst'?: (string);
  'seqLast'?: (string);
  'first'?: (_google_protobuf_Timestamp__Output);
  'last'?: (_google_protobuf_Timestamp__Output);
  'extra'?: ({[key: string]: string});
}
