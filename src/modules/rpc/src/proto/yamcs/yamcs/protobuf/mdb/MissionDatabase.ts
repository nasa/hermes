// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';

export interface MissionDatabase {
  'configName'?: (string);
  'name'?: (string);
  'version'?: (string);
  'spaceSystem'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
  'parameterCount'?: (number);
  'containerCount'?: (number);
  'commandCount'?: (number);
  'algorithmCount'?: (number);
  'parameterTypeCount'?: (number);
  'spaceSystems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
}

export interface MissionDatabase__Output {
  'configName'?: (string);
  'name'?: (string);
  'version'?: (string);
  'spaceSystem'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
  'parameterCount'?: (number);
  'containerCount'?: (number);
  'commandCount'?: (number);
  'algorithmCount'?: (number);
  'parameterTypeCount'?: (number);
  'spaceSystems'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
}
