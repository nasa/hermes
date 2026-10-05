// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterTypeInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface ListParameterTypesResponse {
  'parameterTypes'?: (_yamcs_protobuf_mdb_ParameterTypeInfo)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
}

export interface ListParameterTypesResponse__Output {
  'parameterTypes'?: (_yamcs_protobuf_mdb_ParameterTypeInfo__Output)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
}
