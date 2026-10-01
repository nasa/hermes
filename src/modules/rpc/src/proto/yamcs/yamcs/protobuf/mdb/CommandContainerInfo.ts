// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { CommandContainerInfo as _yamcs_protobuf_mdb_CommandContainerInfo, CommandContainerInfo__Output as _yamcs_protobuf_mdb_CommandContainerInfo__Output } from '../../../yamcs/protobuf/mdb/CommandContainerInfo';
import type { SequenceEntryInfo as _yamcs_protobuf_mdb_SequenceEntryInfo, SequenceEntryInfo__Output as _yamcs_protobuf_mdb_SequenceEntryInfo__Output } from '../../../yamcs/protobuf/mdb/SequenceEntryInfo';

export interface CommandContainerInfo {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'sizeInBits'?: (number);
  'baseContainer'?: (_yamcs_protobuf_mdb_CommandContainerInfo | null);
  'entry'?: (_yamcs_protobuf_mdb_SequenceEntryInfo)[];
}

export interface CommandContainerInfo__Output {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'sizeInBits'?: (number);
  'baseContainer'?: (_yamcs_protobuf_mdb_CommandContainerInfo__Output);
  'entry'?: (_yamcs_protobuf_mdb_SequenceEntryInfo__Output)[];
}
