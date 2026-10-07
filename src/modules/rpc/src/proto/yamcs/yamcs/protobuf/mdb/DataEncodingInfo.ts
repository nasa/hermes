// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { CalibratorInfo as _yamcs_protobuf_mdb_CalibratorInfo, CalibratorInfo__Output as _yamcs_protobuf_mdb_CalibratorInfo__Output } from '../../../yamcs/protobuf/mdb/CalibratorInfo';
import type { ContextCalibratorInfo as _yamcs_protobuf_mdb_ContextCalibratorInfo, ContextCalibratorInfo__Output as _yamcs_protobuf_mdb_ContextCalibratorInfo__Output } from '../../../yamcs/protobuf/mdb/ContextCalibratorInfo';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_DataEncodingInfo_Type = {
  BINARY: 'BINARY',
  BOOLEAN: 'BOOLEAN',
  FLOAT: 'FLOAT',
  INTEGER: 'INTEGER',
  STRING: 'STRING',
} as const;

export type _yamcs_protobuf_mdb_DataEncodingInfo_Type =
  | 'BINARY'
  | 0
  | 'BOOLEAN'
  | 1
  | 'FLOAT'
  | 2
  | 'INTEGER'
  | 3
  | 'STRING'
  | 4

export type _yamcs_protobuf_mdb_DataEncodingInfo_Type__Output = typeof _yamcs_protobuf_mdb_DataEncodingInfo_Type[keyof typeof _yamcs_protobuf_mdb_DataEncodingInfo_Type]

export interface DataEncodingInfo {
  'type'?: (_yamcs_protobuf_mdb_DataEncodingInfo_Type);
  'littleEndian'?: (boolean);
  'sizeInBits'?: (number);
  'encoding'?: (string);
  'defaultCalibrator'?: (_yamcs_protobuf_mdb_CalibratorInfo | null);
  'contextCalibrator'?: (_yamcs_protobuf_mdb_ContextCalibratorInfo)[];
  'contextCalibrators'?: (_yamcs_protobuf_mdb_ContextCalibratorInfo)[];
}

export interface DataEncodingInfo__Output {
  'type'?: (_yamcs_protobuf_mdb_DataEncodingInfo_Type__Output);
  'littleEndian'?: (boolean);
  'sizeInBits'?: (number);
  'encoding'?: (string);
  'defaultCalibrator'?: (_yamcs_protobuf_mdb_CalibratorInfo__Output);
  'contextCalibrator'?: (_yamcs_protobuf_mdb_ContextCalibratorInfo__Output)[];
  'contextCalibrators'?: (_yamcs_protobuf_mdb_ContextCalibratorInfo__Output)[];
}
