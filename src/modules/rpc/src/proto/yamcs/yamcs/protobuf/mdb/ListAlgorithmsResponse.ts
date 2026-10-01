// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { AlgorithmInfo as _yamcs_protobuf_mdb_AlgorithmInfo, AlgorithmInfo__Output as _yamcs_protobuf_mdb_AlgorithmInfo__Output } from '../../../yamcs/protobuf/mdb/AlgorithmInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface ListAlgorithmsResponse {
  'algorithms'?: (_yamcs_protobuf_mdb_AlgorithmInfo)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
}

export interface ListAlgorithmsResponse__Output {
  'algorithms'?: (_yamcs_protobuf_mdb_AlgorithmInfo__Output)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
}
