// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';
import type { AlgorithmInfo as _yamcs_protobuf_mdb_AlgorithmInfo, AlgorithmInfo__Output as _yamcs_protobuf_mdb_AlgorithmInfo__Output } from '../../../yamcs/protobuf/mdb/AlgorithmInfo';
import type { CheckWindowInfo as _yamcs_protobuf_mdb_CheckWindowInfo, CheckWindowInfo__Output as _yamcs_protobuf_mdb_CheckWindowInfo__Output } from '../../../yamcs/protobuf/mdb/CheckWindowInfo';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_VerifierInfo_TerminationActionType = {
  SUCCESS: 'SUCCESS',
  FAIL: 'FAIL',
} as const;

export type _yamcs_protobuf_mdb_VerifierInfo_TerminationActionType =
  | 'SUCCESS'
  | 1
  | 'FAIL'
  | 2

export type _yamcs_protobuf_mdb_VerifierInfo_TerminationActionType__Output = typeof _yamcs_protobuf_mdb_VerifierInfo_TerminationActionType[keyof typeof _yamcs_protobuf_mdb_VerifierInfo_TerminationActionType]

export interface VerifierInfo {
  'stage'?: (string);
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo | null);
  'algorithm'?: (_yamcs_protobuf_mdb_AlgorithmInfo | null);
  'onSuccess'?: (_yamcs_protobuf_mdb_VerifierInfo_TerminationActionType);
  'onFail'?: (_yamcs_protobuf_mdb_VerifierInfo_TerminationActionType);
  'onTimeout'?: (_yamcs_protobuf_mdb_VerifierInfo_TerminationActionType);
  'checkWindow'?: (_yamcs_protobuf_mdb_CheckWindowInfo | null);
  'expression'?: (string);
}

export interface VerifierInfo__Output {
  'stage'?: (string);
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo__Output);
  'algorithm'?: (_yamcs_protobuf_mdb_AlgorithmInfo__Output);
  'onSuccess'?: (_yamcs_protobuf_mdb_VerifierInfo_TerminationActionType__Output);
  'onFail'?: (_yamcs_protobuf_mdb_VerifierInfo_TerminationActionType__Output);
  'onTimeout'?: (_yamcs_protobuf_mdb_VerifierInfo_TerminationActionType__Output);
  'checkWindow'?: (_yamcs_protobuf_mdb_CheckWindowInfo__Output);
  'expression'?: (string);
}
