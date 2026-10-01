// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_MathElement_Type = {
  VALUE_OPERAND: 'VALUE_OPERAND',
  THIS_PARAMETER_OPERAND: 'THIS_PARAMETER_OPERAND',
  OPERATOR: 'OPERATOR',
  PARAMETER: 'PARAMETER',
} as const;

export type _yamcs_protobuf_mdb_MathElement_Type =
  | 'VALUE_OPERAND'
  | 1
  | 'THIS_PARAMETER_OPERAND'
  | 2
  | 'OPERATOR'
  | 3
  | 'PARAMETER'
  | 4

export type _yamcs_protobuf_mdb_MathElement_Type__Output = typeof _yamcs_protobuf_mdb_MathElement_Type[keyof typeof _yamcs_protobuf_mdb_MathElement_Type]

export interface MathElement {
  'type'?: (_yamcs_protobuf_mdb_MathElement_Type);
  'operator'?: (string);
  'value'?: (number | string);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'parameterInstance'?: (number);
}

export interface MathElement__Output {
  'type'?: (_yamcs_protobuf_mdb_MathElement_Type__Output);
  'operator'?: (string);
  'value'?: (number);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'parameterInstance'?: (number);
}
