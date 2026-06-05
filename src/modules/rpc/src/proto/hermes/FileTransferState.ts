// Original file: proto/pb/bus.proto

import type { FileDownlink as _hermes_FileDownlink, FileDownlink__Output as _hermes_FileDownlink__Output } from '../hermes/FileDownlink';
import type { FileUplink as _hermes_FileUplink, FileUplink__Output as _hermes_FileUplink__Output } from '../hermes/FileUplink';
import type { FileTransfer as _hermes_FileTransfer, FileTransfer__Output as _hermes_FileTransfer__Output } from '../hermes/FileTransfer';

export interface FileTransferState {
  'downlinkCompleted'?: (_hermes_FileDownlink)[];
  'uplinkCompleted'?: (_hermes_FileUplink)[];
  'downlinkInProgress'?: (_hermes_FileTransfer)[];
  'uplinkInProgress'?: (_hermes_FileTransfer)[];
}

export interface FileTransferState__Output {
  'downlinkCompleted'?: (_hermes_FileDownlink__Output)[];
  'uplinkCompleted'?: (_hermes_FileUplink__Output)[];
  'downlinkInProgress'?: (_hermes_FileTransfer__Output)[];
  'uplinkInProgress'?: (_hermes_FileTransfer__Output)[];
}
