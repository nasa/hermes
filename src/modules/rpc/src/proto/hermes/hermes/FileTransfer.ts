// Original file: proto/pb/bus.proto

import type { Long } from '@grpc/proto-loader';

export interface FileTransfer {
  'uid'?: (string);
  'fswId'?: (string);
  'sourcePath'?: (string);
  'targetPath'?: (string);
  'size'?: (number | string | Long);
  'progress'?: (number | string | Long);
}

export interface FileTransfer__Output {
  'uid'?: (string);
  'fswId'?: (string);
  'sourcePath'?: (string);
  'targetPath'?: (string);
  'size'?: (Long);
  'progress'?: (Long);
}
