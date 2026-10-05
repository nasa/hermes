// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface ListSpaceSystemsResponse {
  'spaceSystems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
}

export interface ListSpaceSystemsResponse__Output {
  'spaceSystems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
}
