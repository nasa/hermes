// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { CommandInfo as _yamcs_protobuf_mdb_CommandInfo, CommandInfo__Output as _yamcs_protobuf_mdb_CommandInfo__Output } from '../../../yamcs/protobuf/mdb/CommandInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface ListCommandsResponse {
  'commands'?: (_yamcs_protobuf_mdb_CommandInfo)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
}

export interface ListCommandsResponse__Output {
  'commands'?: (_yamcs_protobuf_mdb_CommandInfo__Output)[];
  'continuationToken'?: (string);
  'totalSize'?: (number);
  'spaceSystems'?: (string)[];
  'systems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
}
