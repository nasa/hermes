// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface ListParametersResponse {
  'parameters'?: (_yamcs_protobuf_mdb_ParameterInfo)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
}

export interface ListParametersResponse__Output {
  'parameters'?: (_yamcs_protobuf_mdb_ParameterInfo__Output)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
}
