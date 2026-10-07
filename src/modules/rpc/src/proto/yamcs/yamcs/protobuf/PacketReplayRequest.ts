// Original file: proto/yamcs/protobuf/yamcs.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../yamcs/protobuf/NamedObjectId';

export interface PacketReplayRequest {
  'nameFilter'?: (_yamcs_protobuf_NamedObjectId)[];
  'tmLinks'?: (string)[];
}

export interface PacketReplayRequest__Output {
  'nameFilter'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'tmLinks'?: (string)[];
}
