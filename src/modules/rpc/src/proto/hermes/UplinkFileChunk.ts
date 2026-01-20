// Original file: proto/pb/file.proto

import type { FileHeader as _FileHeader, FileHeader__Output as _FileHeader__Output } from './FileHeader';

export interface UplinkFileChunk {
  'header'?: (_FileHeader | null);
  'data'?: (Buffer | Uint8Array | string);
  'value'?: "header"|"data";
}

export interface UplinkFileChunk__Output {
  'header'?: (_FileHeader__Output);
  'data'?: (Buffer);
}
