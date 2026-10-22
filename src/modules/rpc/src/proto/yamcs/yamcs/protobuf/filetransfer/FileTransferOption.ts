// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto


// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

export const _yamcs_protobuf_filetransfer_FileTransferOption_Type = {
  BOOLEAN: 'BOOLEAN',
  DOUBLE: 'DOUBLE',
  STRING: 'STRING',
} as const;

export type _yamcs_protobuf_filetransfer_FileTransferOption_Type =
  | 'BOOLEAN'
  | 0
  | 'DOUBLE'
  | 1
  | 'STRING'
  | 2

export type _yamcs_protobuf_filetransfer_FileTransferOption_Type__Output = typeof _yamcs_protobuf_filetransfer_FileTransferOption_Type[keyof typeof _yamcs_protobuf_filetransfer_FileTransferOption_Type]

export interface _yamcs_protobuf_filetransfer_FileTransferOption_Value {
  'value'?: (string);
  'verboseName'?: (string);
}

export interface _yamcs_protobuf_filetransfer_FileTransferOption_Value__Output {
  'value'?: (string);
  'verboseName'?: (string);
}

export interface FileTransferOption {
  'name'?: (string);
  'type'?: (_yamcs_protobuf_filetransfer_FileTransferOption_Type);
  'title'?: (string);
  'description'?: (string);
  'associatedText'?: (string);
  'default'?: (string);
  'values'?: (_yamcs_protobuf_filetransfer_FileTransferOption_Value)[];
  'allowCustomOption'?: (boolean);
}

export interface FileTransferOption__Output {
  'name'?: (string);
  'type'?: (_yamcs_protobuf_filetransfer_FileTransferOption_Type__Output);
  'title'?: (string);
  'description'?: (string);
  'associatedText'?: (string);
  'default'?: (string);
  'values'?: (_yamcs_protobuf_filetransfer_FileTransferOption_Value__Output)[];
  'allowCustomOption'?: (boolean);
}
