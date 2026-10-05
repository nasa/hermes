// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterTypeInfo';
import type { ParameterDimensionInfo as _yamcs_protobuf_mdb_ParameterDimensionInfo, ParameterDimensionInfo__Output as _yamcs_protobuf_mdb_ParameterDimensionInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterDimensionInfo';

export interface ArrayInfo {
  'type'?: (_yamcs_protobuf_mdb_ParameterTypeInfo | null);
  'dimensions'?: (_yamcs_protobuf_mdb_ParameterDimensionInfo)[];
}

export interface ArrayInfo__Output {
  'type'?: (_yamcs_protobuf_mdb_ParameterTypeInfo__Output);
  'dimensions'?: (_yamcs_protobuf_mdb_ParameterDimensionInfo__Output)[];
}
