// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { AlgorithmInfo as _yamcs_protobuf_mdb_AlgorithmInfo, AlgorithmInfo__Output as _yamcs_protobuf_mdb_AlgorithmInfo__Output } from '../../../yamcs/protobuf/mdb/AlgorithmInfo';
import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';

export interface UsedByInfo {
  'algorithm'?: (_yamcs_protobuf_mdb_AlgorithmInfo)[];
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo)[];
}

export interface UsedByInfo__Output {
  'algorithm'?: (_yamcs_protobuf_mdb_AlgorithmInfo__Output)[];
  'container'?: (_yamcs_protobuf_mdb_ContainerInfo__Output)[];
}
