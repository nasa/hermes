// Original file: proto/pb/bus.proto

import type { Long } from '@grpc/proto-loader';

export interface FileDownlinkChunk {
  'offset'?: (number | string | Long);
  'size'?: (number | string | Long);
}

export interface FileDownlinkChunk__Output {
  'offset'?: (Long);
  'size'?: (Long);
}
