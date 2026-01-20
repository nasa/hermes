// Original file: proto/pb/file.proto

import type { FileHeader as _FileHeader, FileHeader__Output as _FileHeader__Output } from './FileHeader';
import type { DownlinkFileData as _DownlinkFileData, DownlinkFileData__Output as _DownlinkFileData__Output } from './DownlinkFileData';
import type { DownlinkFileMetadata as _DownlinkFileMetadata, DownlinkFileMetadata__Output as _DownlinkFileMetadata__Output } from './DownlinkFileMetadata';
import type { DownlinkFileValidation as _DownlinkFileValidation, DownlinkFileValidation__Output as _DownlinkFileValidation__Output } from './DownlinkFileValidation';

export interface DownlinkFileChunk {
  'header'?: (_FileHeader | null);
  'data'?: (_DownlinkFileData | null);
  'metadata'?: (_DownlinkFileMetadata | null);
  'validation'?: (_DownlinkFileValidation | null);
  'value'?: "header"|"data"|"metadata"|"validation";
}

export interface DownlinkFileChunk__Output {
  'header'?: (_FileHeader__Output);
  'data'?: (_DownlinkFileData__Output);
  'metadata'?: (_DownlinkFileMetadata__Output);
  'validation'?: (_DownlinkFileValidation__Output);
}
