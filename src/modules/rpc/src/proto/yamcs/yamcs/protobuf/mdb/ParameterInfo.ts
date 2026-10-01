// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { ParameterTypeInfo as _yamcs_protobuf_mdb_ParameterTypeInfo, ParameterTypeInfo__Output as _yamcs_protobuf_mdb_ParameterTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ParameterTypeInfo';
import type { DataSourceType as _yamcs_protobuf_mdb_DataSourceType, DataSourceType__Output as _yamcs_protobuf_mdb_DataSourceType__Output } from '../../../yamcs/protobuf/mdb/DataSourceType';
import type { UsedByInfo as _yamcs_protobuf_mdb_UsedByInfo, UsedByInfo__Output as _yamcs_protobuf_mdb_UsedByInfo__Output } from '../../../yamcs/protobuf/mdb/UsedByInfo';
import type { AncillaryDataInfo as _yamcs_protobuf_mdb_AncillaryDataInfo, AncillaryDataInfo__Output as _yamcs_protobuf_mdb_AncillaryDataInfo__Output } from '../../../yamcs/protobuf/mdb/AncillaryDataInfo';

export interface ParameterInfo {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'type'?: (_yamcs_protobuf_mdb_ParameterTypeInfo | null);
  'dataSource'?: (_yamcs_protobuf_mdb_DataSourceType);
  'usedBy'?: (_yamcs_protobuf_mdb_UsedByInfo | null);
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo});
  'path'?: (string)[];
}

export interface ParameterInfo__Output {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'type'?: (_yamcs_protobuf_mdb_ParameterTypeInfo__Output);
  'dataSource'?: (_yamcs_protobuf_mdb_DataSourceType__Output);
  'usedBy'?: (_yamcs_protobuf_mdb_UsedByInfo__Output);
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo__Output});
  'path'?: (string)[];
}
