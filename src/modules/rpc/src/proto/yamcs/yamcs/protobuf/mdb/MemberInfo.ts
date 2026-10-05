// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterTypeInfo';

export interface MemberInfo {
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'type'?: (_yamcs_protobuf_mdb_ParameterTypeInfo | null);
}

export interface MemberInfo__Output {
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'type'?: (_yamcs_protobuf_mdb_ParameterTypeInfo__Output);
}
