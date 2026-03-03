// Original file: proto/pb/bus.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { Long } from '@grpc/proto-loader';

export interface FileUplink {
  'uid'?: (string);
  'timeStart'?: (_google_protobuf_Timestamp | null);
  'timeEnd'?: (_google_protobuf_Timestamp | null);
  'fswId'?: (string);
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'error'?: (string);
  'size'?: (number | string | Long);
  'metadata'?: ({[key: string]: string});
}

export interface FileUplink__Output {
  'uid'?: (string);
  'timeStart'?: (_google_protobuf_Timestamp__Output);
  'timeEnd'?: (_google_protobuf_Timestamp__Output);
  'fswId'?: (string);
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'error'?: (string);
  'size'?: (Long);
  'metadata'?: ({[key: string]: string});
}
