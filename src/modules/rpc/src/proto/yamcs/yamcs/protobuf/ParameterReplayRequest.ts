// Original file: proto/yamcs/protobuf/yamcs.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../yamcs/protobuf/NamedObjectId';

export interface ParameterReplayRequest {
  'nameFilter'?: (_yamcs_protobuf_NamedObjectId)[];
  'sendRaw'?: (boolean);
  'performMonitoring'?: (boolean);
}

export interface ParameterReplayRequest__Output {
  'nameFilter'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'sendRaw'?: (boolean);
  'performMonitoring'?: (boolean);
}
