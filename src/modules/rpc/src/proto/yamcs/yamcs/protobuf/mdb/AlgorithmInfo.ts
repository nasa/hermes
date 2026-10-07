// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { InputParameterInfo as _yamcs_protobuf_mdb_InputParameterInfo, InputParameterInfo__Output as _yamcs_protobuf_mdb_InputParameterInfo__Output } from '../../../yamcs/protobuf/mdb/InputParameterInfo';
import type { OutputParameterInfo as _yamcs_protobuf_mdb_OutputParameterInfo, OutputParameterInfo__Output as _yamcs_protobuf_mdb_OutputParameterInfo__Output } from '../../../yamcs/protobuf/mdb/OutputParameterInfo';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { MathElement as _yamcs_protobuf_mdb_MathElement, MathElement__Output as _yamcs_protobuf_mdb_MathElement__Output } from '../../../yamcs/protobuf/mdb/MathElement';
import type { Long } from '@grpc/proto-loader';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_AlgorithmInfo_Scope = {
  GLOBAL: 'GLOBAL',
  COMMAND_VERIFICATION: 'COMMAND_VERIFICATION',
  CONTAINER_PROCESSING: 'CONTAINER_PROCESSING',
} as const;

export type _yamcs_protobuf_mdb_AlgorithmInfo_Scope =
  | 'GLOBAL'
  | 0
  | 'COMMAND_VERIFICATION'
  | 1
  | 'CONTAINER_PROCESSING'
  | 2

export type _yamcs_protobuf_mdb_AlgorithmInfo_Scope__Output = typeof _yamcs_protobuf_mdb_AlgorithmInfo_Scope[keyof typeof _yamcs_protobuf_mdb_AlgorithmInfo_Scope]

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_AlgorithmInfo_Type = {
  CUSTOM: 'CUSTOM',
  MATH: 'MATH',
} as const;

export type _yamcs_protobuf_mdb_AlgorithmInfo_Type =
  | 'CUSTOM'
  | 1
  | 'MATH'
  | 2

export type _yamcs_protobuf_mdb_AlgorithmInfo_Type__Output = typeof _yamcs_protobuf_mdb_AlgorithmInfo_Type[keyof typeof _yamcs_protobuf_mdb_AlgorithmInfo_Type]

export interface AlgorithmInfo {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'scope'?: (_yamcs_protobuf_mdb_AlgorithmInfo_Scope);
  'language'?: (string);
  'text'?: (string);
  'inputParameter'?: (_yamcs_protobuf_mdb_InputParameterInfo)[];
  'outputParameter'?: (_yamcs_protobuf_mdb_OutputParameterInfo)[];
  'onParameterUpdate'?: (_yamcs_protobuf_mdb_ParameterInfo)[];
  'onPeriodicRate'?: (number | string | Long)[];
  'type'?: (_yamcs_protobuf_mdb_AlgorithmInfo_Type);
  'mathElements'?: (_yamcs_protobuf_mdb_MathElement)[];
}

export interface AlgorithmInfo__Output {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'scope'?: (_yamcs_protobuf_mdb_AlgorithmInfo_Scope__Output);
  'language'?: (string);
  'text'?: (string);
  'inputParameter'?: (_yamcs_protobuf_mdb_InputParameterInfo__Output)[];
  'outputParameter'?: (_yamcs_protobuf_mdb_OutputParameterInfo__Output)[];
  'onParameterUpdate'?: (_yamcs_protobuf_mdb_ParameterInfo__Output)[];
  'onPeriodicRate'?: (string)[];
  'type'?: (_yamcs_protobuf_mdb_AlgorithmInfo_Type__Output);
  'mathElements'?: (_yamcs_protobuf_mdb_MathElement__Output)[];
}
