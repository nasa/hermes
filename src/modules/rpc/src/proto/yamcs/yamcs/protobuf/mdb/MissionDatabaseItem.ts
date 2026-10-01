// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';
import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';
import type { ParameterInfo as _yamcs_protobuf_mdb_ParameterInfo, ParameterInfo__Output as _yamcs_protobuf_mdb_ParameterInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterInfo';
import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterTypeInfo';
import type { CommandInfo as _yamcs_protobuf_mdb_CommandInfo, CommandInfo__Output as _yamcs_protobuf_mdb_CommandInfo__Output } from '../../../yamcs/protobuf/mdb/CommandInfo';
import type { AlgorithmInfo as _yamcs_protobuf_mdb_AlgorithmInfo, AlgorithmInfo__Output as _yamcs_protobuf_mdb_AlgorithmInfo__Output } from '../../../yamcs/protobuf/mdb/AlgorithmInfo';

export interface MissionDatabaseItem {
  'spaceSystem'?: (_yamcs_protobuf_mdb_SpaceSystemInfo | null);
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo | null);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo | null);
  'parameterType'?: (_yamcs_protobuf_mdb_ParameterTypeInfo | null);
  'command'?: (_yamcs_protobuf_mdb_CommandInfo | null);
  'algorithm'?: (_yamcs_protobuf_mdb_AlgorithmInfo | null);
  'item'?: "spaceSystem"|"container"|"parameter"|"parameterType"|"command"|"algorithm";
}

export interface MissionDatabaseItem__Output {
  'spaceSystem'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output);
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo__Output);
  'parameter'?: (_yamcs_protobuf_mdb_ParameterInfo__Output);
  'parameterType'?: (_yamcs_protobuf_mdb_ParameterTypeInfo__Output);
  'command'?: (_yamcs_protobuf_mdb_CommandInfo__Output);
  'algorithm'?: (_yamcs_protobuf_mdb_AlgorithmInfo__Output);
  'item'?: "spaceSystem"|"container"|"parameter"|"parameterType"|"command"|"algorithm";
}
