// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';

export interface _yamcs_protobuf_mdb_BatchGetParametersResponse_GetParameterResponse {
  'id'?: (_yamcs_protobuf_NamedObjectId | null);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
}

export interface _yamcs_protobuf_mdb_BatchGetParametersResponse_GetParameterResponse__Output {
  'id'?: (_yamcs_protobuf_NamedObjectId__Output);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
}

export interface BatchGetParametersResponse {
  'response'?: (_yamcs_protobuf_mdb_BatchGetParametersResponse_GetParameterResponse)[];
}

export interface BatchGetParametersResponse__Output {
  'response'?: (_yamcs_protobuf_mdb_BatchGetParametersResponse_GetParameterResponse__Output)[];
}
