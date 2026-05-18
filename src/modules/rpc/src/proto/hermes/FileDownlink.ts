// Original file: proto/pb/bus.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import type { FileDownlinkCompletionStatus as _hermes_FileDownlinkCompletionStatus, FileDownlinkCompletionStatus__Output as _hermes_FileDownlinkCompletionStatus__Output } from '../hermes/FileDownlinkCompletionStatus';
import type { FileDownlinkChunk as _hermes_FileDownlinkChunk, FileDownlinkChunk__Output as _hermes_FileDownlinkChunk__Output } from '../hermes/FileDownlinkChunk';
import type { Long } from '@grpc/proto-loader';

export interface FileDownlink {
  'uid'?: (string);
  'timeStart'?: (_google_protobuf_Timestamp | null);
  'timeEnd'?: (_google_protobuf_Timestamp | null);
  'status'?: (_hermes_FileDownlinkCompletionStatus);
  'source'?: (string);
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'filePath'?: (string);
  'missingChunks'?: (_hermes_FileDownlinkChunk)[];
  'duplicateChunks'?: (_hermes_FileDownlinkChunk)[];
  'size'?: (number | string | Long);
  'metadata'?: ({[key: string]: string});
}

export interface FileDownlink__Output {
  'uid'?: (string);
  'timeStart'?: (_google_protobuf_Timestamp__Output);
  'timeEnd'?: (_google_protobuf_Timestamp__Output);
  'status'?: (_hermes_FileDownlinkCompletionStatus__Output);
  'source'?: (string);
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'filePath'?: (string);
  'missingChunks'?: (_hermes_FileDownlinkChunk__Output)[];
  'duplicateChunks'?: (_hermes_FileDownlinkChunk__Output)[];
  'size'?: (Long);
  'metadata'?: ({[key: string]: string});
}
