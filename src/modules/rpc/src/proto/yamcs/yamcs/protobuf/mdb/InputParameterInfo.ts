// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { ArgumentInfo as _yamcs_protobuf_mdb_ArgumentInfo, ArgumentInfo__Output as _yamcs_protobuf_mdb_ArgumentInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentInfo';

export interface InputParameterInfo {
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'inputName'?: (string);
  'parameterInstance'?: (number);
  'mandatory'?: (boolean);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo | null);
}

export interface InputParameterInfo__Output {
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'inputName'?: (string);
  'parameterInstance'?: (number);
  'mandatory'?: (boolean);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo__Output);
}
