// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';

export interface ListFilesRequest {
  'instance'?: (string);
  'serviceName'?: (string);
  'source'?: (string);
  'destination'?: (string);
  'remotePath'?: (string);
  'options'?: (_google_protobuf_Struct | null);
}

export interface ListFilesRequest__Output {
  'instance'?: (string);
  'serviceName'?: (string);
  'source'?: (string);
  'destination'?: (string);
  'remotePath'?: (string);
  'options'?: (_google_protobuf_Struct__Output);
}
