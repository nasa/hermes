// Original file: proto/yamcs/protobuf/filetransfer/filetransfer.proto

import type { EntityInfo as _yamcs_protobuf_filetransfer_EntityInfo, EntityInfo__Output as _yamcs_protobuf_filetransfer_EntityInfo__Output } from '../../../yamcs/protobuf/filetransfer/EntityInfo';
import type { FileTransferCapabilities as _yamcs_protobuf_filetransfer_FileTransferCapabilities, FileTransferCapabilities__Output as _yamcs_protobuf_filetransfer_FileTransferCapabilities__Output } from '../../../yamcs/protobuf/filetransfer/FileTransferCapabilities';
import type { FileTransferOption as _yamcs_protobuf_filetransfer_FileTransferOption, FileTransferOption__Output as _yamcs_protobuf_filetransfer_FileTransferOption__Output } from '../../../yamcs/protobuf/filetransfer/FileTransferOption';

export interface FileTransferServiceInfo {
  'instance'?: (string);
  'name'?: (string);
  'localEntities'?: (_yamcs_protobuf_filetransfer_EntityInfo)[];
  'remoteEntities'?: (_yamcs_protobuf_filetransfer_EntityInfo)[];
  'capabilities'?: (_yamcs_protobuf_filetransfer_FileTransferCapabilities | null);
  'transferOptions'?: (_yamcs_protobuf_filetransfer_FileTransferOption)[];
}

export interface FileTransferServiceInfo__Output {
  'instance'?: (string);
  'name'?: (string);
  'localEntities'?: (_yamcs_protobuf_filetransfer_EntityInfo__Output)[];
  'remoteEntities'?: (_yamcs_protobuf_filetransfer_EntityInfo__Output)[];
  'capabilities'?: (_yamcs_protobuf_filetransfer_FileTransferCapabilities__Output);
  'transferOptions'?: (_yamcs_protobuf_filetransfer_FileTransferOption__Output)[];
}
