// Original file: proto/pb/file.proto

import type { FileHeader as _hermes_FileHeader, FileHeader__Output as _hermes_FileHeader__Output } from '../hermes/FileHeader';
import type { DownlinkFileData as _hermes_DownlinkFileData, DownlinkFileData__Output as _hermes_DownlinkFileData__Output } from '../hermes/DownlinkFileData';
import type { DownlinkFileMetadata as _hermes_DownlinkFileMetadata, DownlinkFileMetadata__Output as _hermes_DownlinkFileMetadata__Output } from '../hermes/DownlinkFileMetadata';
import type { DownlinkFileValidation as _hermes_DownlinkFileValidation, DownlinkFileValidation__Output as _hermes_DownlinkFileValidation__Output } from '../hermes/DownlinkFileValidation';

export interface DownlinkFileChunk {
  'header'?: (_hermes_FileHeader | null);
  'data'?: (_hermes_DownlinkFileData | null);
  'metadata'?: (_hermes_DownlinkFileMetadata | null);
  'validation'?: (_hermes_DownlinkFileValidation | null);
  'value'?: "header"|"data"|"metadata"|"validation";
}

export interface DownlinkFileChunk__Output {
  'header'?: (_hermes_FileHeader__Output);
  'data'?: (_hermes_DownlinkFileData__Output);
  'metadata'?: (_hermes_DownlinkFileMetadata__Output);
  'validation'?: (_hermes_DownlinkFileValidation__Output);
}
