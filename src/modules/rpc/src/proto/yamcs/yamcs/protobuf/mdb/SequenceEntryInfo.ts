// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { RepeatInfo as _yamcs_protobuf_mdb_RepeatInfo, RepeatInfo__Output as _yamcs_protobuf_mdb_RepeatInfo__Output } from '../../../yamcs/protobuf/mdb/RepeatInfo';
import type { ArgumentInfo as _yamcs_protobuf_mdb_ArgumentInfo, ArgumentInfo__Output as _yamcs_protobuf_mdb_ArgumentInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentInfo';
import type { FixedValueInfo as _yamcs_protobuf_mdb_FixedValueInfo, FixedValueInfo__Output as _yamcs_protobuf_mdb_FixedValueInfo__Output } from '../../../yamcs/protobuf/mdb/FixedValueInfo';
import type { IndirectParameterRefInfo as _yamcs_protobuf_mdb_IndirectParameterRefInfo, IndirectParameterRefInfo__Output as _yamcs_protobuf_mdb_IndirectParameterRefInfo__Output } from '../../../yamcs/protobuf/mdb/IndirectParameterRefInfo';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType = {
  CONTAINER_START: 'CONTAINER_START',
  PREVIOUS_ENTRY: 'PREVIOUS_ENTRY',
} as const;

export type _yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType =
  | 'CONTAINER_START'
  | 1
  | 'PREVIOUS_ENTRY'
  | 2

export type _yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType__Output = typeof _yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType[keyof typeof _yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType]

export interface SequenceEntryInfo {
  'locationInBits'?: (number);
  'referenceLocation'?: (_yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType);
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo | null);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'repeat'?: (_yamcs_protobuf_mdb_RepeatInfo | null);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo | null);
  'fixedValue'?: (_yamcs_protobuf_mdb_FixedValueInfo | null);
  'indirectParameterRef'?: (_yamcs_protobuf_mdb_IndirectParameterRefInfo | null);
}

export interface SequenceEntryInfo__Output {
  'locationInBits'?: (number);
  'referenceLocation'?: (_yamcs_protobuf_mdb_SequenceEntryInfo_ReferenceLocationType__Output);
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo__Output);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'repeat'?: (_yamcs_protobuf_mdb_RepeatInfo__Output);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo__Output);
  'fixedValue'?: (_yamcs_protobuf_mdb_FixedValueInfo__Output);
  'indirectParameterRef'?: (_yamcs_protobuf_mdb_IndirectParameterRefInfo__Output);
}
