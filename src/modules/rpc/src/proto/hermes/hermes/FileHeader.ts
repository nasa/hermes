// Original file: proto/pb/file.proto

import type { Long } from '@grpc/proto-loader';

export interface FileHeader {
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'size'?: (number | string | Long);
  'metadata'?: ({[key: string]: string});
}

export interface FileHeader__Output {
  'sourcePath'?: (string);
  'destinationPath'?: (string);
  'size'?: (Long);
  'metadata'?: ({[key: string]: string});
}
