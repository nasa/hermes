// Original file: proto/pb/bus.proto

import type { FileDownlink as _FileDownlink, FileDownlink__Output as _FileDownlink__Output } from './FileDownlink';
import type { FileUplink as _FileUplink, FileUplink__Output as _FileUplink__Output } from './FileUplink';
import type { FileTransfer as _FileTransfer, FileTransfer__Output as _FileTransfer__Output } from './FileTransfer';

export interface FileTransferState {
  'downlinkCompleted'?: (_FileDownlink)[];
  'uplinkCompleted'?: (_FileUplink)[];
  'downlinkInProgress'?: (_FileTransfer)[];
  'uplinkInProgress'?: (_FileTransfer)[];
}

export interface FileTransferState__Output {
  'downlinkCompleted'?: (_FileDownlink__Output)[];
  'uplinkCompleted'?: (_FileUplink__Output)[];
  'downlinkInProgress'?: (_FileTransfer__Output)[];
  'uplinkInProgress'?: (_FileTransfer__Output)[];
}
