// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';
import type { Long } from '@grpc/proto-loader';

export interface RemoteFile {
  'name'?: (string);
  'isDirectory'?: (boolean);
  'size'?: (number | string | Long);
  'modified'?: (_google_protobuf_Timestamp | null);
  'displayName'?: (string);
  'extra'?: (_google_protobuf_Struct | null);
}

export interface RemoteFile__Output {
  'name'?: (string);
  'isDirectory'?: (boolean);
  'size'?: (string);
  'modified'?: (_google_protobuf_Timestamp__Output);
  'displayName'?: (string);
  'extra'?: (_google_protobuf_Struct__Output);
}
