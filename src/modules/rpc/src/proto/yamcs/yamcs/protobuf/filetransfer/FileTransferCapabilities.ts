// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { ExtraColumnInfo as _yamcs_protobuf_filetransfer_ExtraColumnInfo, ExtraColumnInfo__Output as _yamcs_protobuf_filetransfer_ExtraColumnInfo__Output } from '../../../yamcs/protobuf/filetransfer/ExtraColumnInfo';
import type { ActionInfo as _yamcs_protobuf_actions_ActionInfo, ActionInfo__Output as _yamcs_protobuf_actions_ActionInfo__Output } from '../../../yamcs/protobuf/actions/ActionInfo';

export interface FileTransferCapabilities {
  'upload'?: (boolean);
  'download'?: (boolean);
  'remotePath'?: (boolean);
  'fileList'?: (boolean);
  'hasTransferType'?: (boolean);
  'fileListExtraColumns'?: (_yamcs_protobuf_filetransfer_ExtraColumnInfo)[];
  'fileActions'?: (_yamcs_protobuf_actions_ActionInfo)[];
  'pauseResume'?: (boolean);
}

export interface FileTransferCapabilities__Output {
  'upload'?: (boolean);
  'download'?: (boolean);
  'remotePath'?: (boolean);
  'fileList'?: (boolean);
  'hasTransferType'?: (boolean);
  'fileListExtraColumns'?: (_yamcs_protobuf_filetransfer_ExtraColumnInfo__Output)[];
  'fileActions'?: (_yamcs_protobuf_actions_ActionInfo__Output)[];
  'pauseResume'?: (boolean);
}
