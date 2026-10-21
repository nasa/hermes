// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { RemoteFile as _yamcs_protobuf_filetransfer_RemoteFile, RemoteFile__Output as _yamcs_protobuf_filetransfer_RemoteFile__Output } from '../../../yamcs/protobuf/filetransfer/RemoteFile';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';

export interface ListFilesResponse {
  'files'?: (_yamcs_protobuf_filetransfer_RemoteFile)[];
  'destination'?: (string);
  'remotePath'?: (string);
  'listTime'?: (_google_protobuf_Timestamp | null);
  'state'?: (string);
  'progressMessage'?: (string);
}

export interface ListFilesResponse__Output {
  'files'?: (_yamcs_protobuf_filetransfer_RemoteFile__Output)[];
  'destination'?: (string);
  'remotePath'?: (string);
  'listTime'?: (_google_protobuf_Timestamp__Output);
  'state'?: (string);
  'progressMessage'?: (string);
}
