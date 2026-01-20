// Original file: proto/pb/file.proto

import type { Long } from '@grpc/proto-loader';

export interface DownlinkFileData {
  'offset'?: (number | string | Long);
  'data'?: (Buffer | Uint8Array | string);
  'md'?: ({[key: string]: string});
}

export interface DownlinkFileData__Output {
  'offset'?: (Long);
  'data'?: (Buffer);
  'md'?: ({[key: string]: string});
}
