// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';

export interface BatchGetParametersRequest {
  'id'?: (_yamcs_protobuf_NamedObjectId)[];
  'instance'?: (string);
}

export interface BatchGetParametersRequest__Output {
  'id'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'instance'?: (string);
}
