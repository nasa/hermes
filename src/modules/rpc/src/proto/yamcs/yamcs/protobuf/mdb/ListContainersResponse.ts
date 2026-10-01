// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface ListContainersResponse {
  'containers'?: (_yamcs_protobuf_mdb_ContainerInfo)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
}

export interface ListContainersResponse__Output {
  'containers'?: (_yamcs_protobuf_mdb_ContainerInfo__Output)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
}
