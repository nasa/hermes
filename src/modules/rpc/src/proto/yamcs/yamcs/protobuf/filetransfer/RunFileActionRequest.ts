// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';

export interface RunFileActionRequest {
  'instance'?: (string);
  'serviceName'?: (string);
  'remoteEntity'?: (string);
  'file'?: (string);
  'action'?: (string);
  'message'?: (_google_protobuf_Struct | null);
}

export interface RunFileActionRequest__Output {
  'instance'?: (string);
  'serviceName'?: (string);
  'remoteEntity'?: (string);
  'file'?: (string);
  'action'?: (string);
  'message'?: (_google_protobuf_Struct__Output);
}
