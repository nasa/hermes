// Original file: proto/pb/file.proto

import type { FileHeader as _hermes_FileHeader, FileHeader__Output as _hermes_FileHeader__Output } from '../hermes/FileHeader';

export interface UplinkFileChunk {
  'header'?: (_hermes_FileHeader | null);
  'data'?: (Buffer | Uint8Array | string);
  'value'?: "header"|"data";
}

export interface UplinkFileChunk__Output {
  'header'?: (_hermes_FileHeader__Output);
  'data'?: (Buffer);
}
