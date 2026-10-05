// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { HistoryInfo as _yamcs_protobuf_mdb_HistoryInfo, HistoryInfo__Output as _yamcs_protobuf_mdb_HistoryInfo__Output } from '../../../yamcs/protobuf/mdb/HistoryInfo';
import type { SpaceSystemInfo as _yamcs_protobuf_mdb_SpaceSystemInfo, SpaceSystemInfo__Output as _yamcs_protobuf_mdb_SpaceSystemInfo__Output } from '../../../yamcs/protobuf/mdb/SpaceSystemInfo';
import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { AncillaryDataInfo as _yamcs_protobuf_mdb_AncillaryDataInfo, AncillaryDataInfo__Output as _yamcs_protobuf_mdb_AncillaryDataInfo__Output } from '../../../yamcs/protobuf/mdb/AncillaryDataInfo';

export interface SpaceSystemInfo {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'version'?: (string);
  'history'?: (_yamcs_protobuf_mdb_HistoryInfo)[];
  'sub'?: (_yamcs_protobuf_mdb_SpaceSystemInfo)[];
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo});
}

export interface SpaceSystemInfo__Output {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'version'?: (string);
  'history'?: (_yamcs_protobuf_mdb_HistoryInfo__Output)[];
  'sub'?: (_yamcs_protobuf_mdb_SpaceSystemInfo__Output)[];
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo__Output});
}
