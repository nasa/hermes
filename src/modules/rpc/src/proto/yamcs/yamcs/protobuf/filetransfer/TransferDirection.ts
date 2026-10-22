// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

export const TransferDirection = {
  UPLOAD: 'UPLOAD',
  DOWNLOAD: 'DOWNLOAD',
} as const;

export type TransferDirection =
  | 'UPLOAD'
  | 1
  | 'DOWNLOAD'
  | 2

export type TransferDirection__Output = typeof TransferDirection[keyof typeof TransferDirection]
