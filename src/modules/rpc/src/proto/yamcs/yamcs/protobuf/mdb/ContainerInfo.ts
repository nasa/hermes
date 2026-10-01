// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { ContainerInfo as _yamcs_protobuf_mdb_ContainerInfo, ContainerInfo__Output as _yamcs_protobuf_mdb_ContainerInfo__Output } from '../../../yamcs/protobuf/mdb/ContainerInfo';
import type { ComparisonInfo as _yamcs_protobuf_mdb_ComparisonInfo, ComparisonInfo__Output as _yamcs_protobuf_mdb_ComparisonInfo__Output } from '../../../yamcs/protobuf/mdb/ComparisonInfo';
import type { SequenceEntryInfo as _yamcs_protobuf_mdb_SequenceEntryInfo, SequenceEntryInfo__Output as _yamcs_protobuf_mdb_SequenceEntryInfo__Output } from '../../../yamcs/protobuf/mdb/SequenceEntryInfo';
import type { UsedByInfo as _yamcs_protobuf_mdb_UsedByInfo, UsedByInfo__Output as _yamcs_protobuf_mdb_UsedByInfo__Output } from '../../../yamcs/protobuf/mdb/UsedByInfo';
import type { AncillaryDataInfo as _yamcs_protobuf_mdb_AncillaryDataInfo, AncillaryDataInfo__Output as _yamcs_protobuf_mdb_AncillaryDataInfo__Output } from '../../../yamcs/protobuf/mdb/AncillaryDataInfo';
import type { Long } from '@grpc/proto-loader';

export interface ContainerInfo {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'maxInterval'?: (number | string | Long);
  'sizeInBits'?: (number);
  'baseContainer'?: (_yamcs_protobuf_mdb_ContainerInfo | null);
  'restrictionCriteria'?: (_yamcs_protobuf_mdb_ComparisonInfo)[];
  'entry'?: (_yamcs_protobuf_mdb_SequenceEntryInfo)[];
  'usedBy'?: (_yamcs_protobuf_mdb_UsedByInfo | null);
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo});
  'restrictionCriteriaExpression'?: (string);
  'archivePartition'?: (boolean);
}

export interface ContainerInfo__Output {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'maxInterval'?: (string);
  'sizeInBits'?: (number);
  'baseContainer'?: (_yamcs_protobuf_mdb_ContainerInfo__Output);
  'restrictionCriteria'?: (_yamcs_protobuf_mdb_ComparisonInfo__Output)[];
  'entry'?: (_yamcs_protobuf_mdb_SequenceEntryInfo__Output)[];
  'usedBy'?: (_yamcs_protobuf_mdb_UsedByInfo__Output);
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo__Output});
  'restrictionCriteriaExpression'?: (string);
  'archivePartition'?: (boolean);
}
