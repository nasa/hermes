// Original file: proto/pb/bus.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from './google/protobuf/Timestamp';
import type { FileDownlinkCompletionStatus as _FileDownlinkCompletionStatus, FileDownlinkCompletionStatus__Output as _FileDownlinkCompletionStatus__Output } from './FileDownlinkCompletionStatus';
import type { FileDownlinkChunk as _FileDownlinkChunk, FileDownlinkChunk__Output as _FileDownlinkChunk__Output } from './FileDownlinkChunk';
import type { Long } from '@grpc/proto-loader';

export interface FileDownlink {
  'uid'?: (string);
  'timeStart'?: (_google_protobuf_Timestamp | null);
  'timeEnd'?: (_google_protobuf_Timestamp | null);
  'status'?: (_FileDownlinkCompletionStatus);
  'source'?: (string);
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'filePath'?: (string);
  'missingChunks'?: (_FileDownlinkChunk)[];
  'duplicateChunks'?: (_FileDownlinkChunk)[];
  'size'?: (number | string | Long);
  'metadata'?: ({[key: string]: string});
}

export interface FileDownlink__Output {
  'uid'?: (string);
  'timeStart'?: (_google_protobuf_Timestamp__Output);
  'timeEnd'?: (_google_protobuf_Timestamp__Output);
  'status'?: (_FileDownlinkCompletionStatus__Output);
  'source'?: (string);
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'filePath'?: (string);
  'missingChunks'?: (_FileDownlinkChunk__Output)[];
  'duplicateChunks'?: (_FileDownlinkChunk__Output)[];
  'size'?: (Long);
  'metadata'?: ({[key: string]: string});
}
