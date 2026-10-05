// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { CommandInfo as _yamcs_protobuf_mdb_CommandInfo, CommandInfo__Output as _yamcs_protobuf_mdb_CommandInfo__Output } from '../../../yamcs/protobuf/mdb/CommandInfo';
import type { ArgumentInfo as _yamcs_protobuf_mdb_ArgumentInfo, ArgumentInfo__Output as _yamcs_protobuf_mdb_ArgumentInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentInfo';
import type { ArgumentAssignmentInfo as _yamcs_protobuf_mdb_ArgumentAssignmentInfo, ArgumentAssignmentInfo__Output as _yamcs_protobuf_mdb_ArgumentAssignmentInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentAssignmentInfo';
import type { SignificanceInfo as _yamcs_protobuf_mdb_SignificanceInfo, SignificanceInfo__Output as _yamcs_protobuf_mdb_SignificanceInfo__Output } from '../../../yamcs/protobuf/mdb/SignificanceInfo';
import type { TransmissionConstraintInfo as _yamcs_protobuf_mdb_TransmissionConstraintInfo, TransmissionConstraintInfo__Output as _yamcs_protobuf_mdb_TransmissionConstraintInfo__Output } from '../../../yamcs/protobuf/mdb/TransmissionConstraintInfo';
import type { CommandContainerInfo as _yamcs_protobuf_mdb_CommandContainerInfo, CommandContainerInfo__Output as _yamcs_protobuf_mdb_CommandContainerInfo__Output } from '../../../yamcs/protobuf/mdb/CommandContainerInfo';
import type { VerifierInfo as _yamcs_protobuf_mdb_VerifierInfo, VerifierInfo__Output as _yamcs_protobuf_mdb_VerifierInfo__Output } from '../../../yamcs/protobuf/mdb/VerifierInfo';
import type { AncillaryDataInfo as _yamcs_protobuf_mdb_AncillaryDataInfo, AncillaryDataInfo__Output as _yamcs_protobuf_mdb_AncillaryDataInfo__Output } from '../../../yamcs/protobuf/mdb/AncillaryDataInfo';

export interface CommandInfo {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId)[];
  'baseCommand'?: (_yamcs_protobuf_mdb_CommandInfo | null);
  'abstract'?: (boolean);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo)[];
  'argumentAssignment'?: (_yamcs_protobuf_mdb_ArgumentAssignmentInfo)[];
  'significance'?: (_yamcs_protobuf_mdb_SignificanceInfo | null);
  'constraint'?: (_yamcs_protobuf_mdb_TransmissionConstraintInfo)[];
  'commandContainer'?: (_yamcs_protobuf_mdb_CommandContainerInfo | null);
  'verifier'?: (_yamcs_protobuf_mdb_VerifierInfo)[];
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo});
  'effectiveSignificance'?: (_yamcs_protobuf_mdb_SignificanceInfo | null);
}

export interface CommandInfo__Output {
  'name'?: (string);
  'qualifiedName'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'alias'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'baseCommand'?: (_yamcs_protobuf_mdb_CommandInfo__Output);
  'abstract'?: (boolean);
  'argument'?: (_yamcs_protobuf_mdb_ArgumentInfo__Output)[];
  'argumentAssignment'?: (_yamcs_protobuf_mdb_ArgumentAssignmentInfo__Output)[];
  'significance'?: (_yamcs_protobuf_mdb_SignificanceInfo__Output);
  'constraint'?: (_yamcs_protobuf_mdb_TransmissionConstraintInfo__Output)[];
  'commandContainer'?: (_yamcs_protobuf_mdb_CommandContainerInfo__Output);
  'verifier'?: (_yamcs_protobuf_mdb_VerifierInfo__Output)[];
  'ancillaryData'?: ({[key: string]: _yamcs_protobuf_mdb_AncillaryDataInfo__Output});
  'effectiveSignificance'?: (_yamcs_protobuf_mdb_SignificanceInfo__Output);
}
