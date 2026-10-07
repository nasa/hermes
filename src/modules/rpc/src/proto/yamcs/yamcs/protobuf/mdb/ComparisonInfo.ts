// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { ArgumentInfo as _yamcs_protobuf_mdb_ArgumentInfo, ArgumentInfo__Output as _yamcs_protobuf_mdb_ArgumentInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentInfo';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_ComparisonInfo_OperatorType = {
  EQUAL_TO: 'EQUAL_TO',
  NOT_EQUAL_TO: 'NOT_EQUAL_TO',
  GREATER_THAN: 'GREATER_THAN',
  GREATER_THAN_OR_EQUAL_TO: 'GREATER_THAN_OR_EQUAL_TO',
  SMALLER_THAN: 'SMALLER_THAN',
  SMALLER_THAN_OR_EQUAL_TO: 'SMALLER_THAN_OR_EQUAL_TO',
} as const;

export type _yamcs_protobuf_mdb_ComparisonInfo_OperatorType =
  | 'EQUAL_TO'
  | 1
  | 'NOT_EQUAL_TO'
  | 2
  | 'GREATER_THAN'
  | 3
  | 'GREATER_THAN_OR_EQUAL_TO'
  | 4
  | 'SMALLER_THAN'
  | 5
  | 'SMALLER_THAN_OR_EQUAL_TO'
  | 6

export type _yamcs_protobuf_mdb_ComparisonInfo_OperatorType__Output = typeof _yamcs_protobuf_mdb_ComparisonInfo_OperatorType[keyof typeof _yamcs_protobuf_mdb_ComparisonInfo_OperatorType]

export interface ComparisonInfo {
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'operator'?: (_yamcs_protobuf_mdb_ComparisonInfo_OperatorType);
  'value'?: (string);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo | null);
}

export interface ComparisonInfo__Output {
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'operator'?: (_yamcs_protobuf_mdb_ComparisonInfo_OperatorType__Output);
  'value'?: (string);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo__Output);
}
