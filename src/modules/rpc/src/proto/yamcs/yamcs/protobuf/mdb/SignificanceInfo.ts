// Original file: proto/yamcs/protobuf/mdb/mdb.proto


// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType = {
  NONE: 'NONE',
  WATCH: 'WATCH',
  WARNING: 'WARNING',
  DISTRESS: 'DISTRESS',
  CRITICAL: 'CRITICAL',
  SEVERE: 'SEVERE',
} as const;

export type _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType =
  | 'NONE'
  | 1
  | 'WATCH'
  | 2
  | 'WARNING'
  | 3
  | 'DISTRESS'
  | 4
  | 'CRITICAL'
  | 5
  | 'SEVERE'
  | 6

export type _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType__Output = typeof _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType[keyof typeof _yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType]

export interface SignificanceInfo {
  'consequenceLevel'?: (_yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType);
  'reasonForWarning'?: (string);
}

export interface SignificanceInfo__Output {
  'consequenceLevel'?: (_yamcs_protobuf_mdb_SignificanceInfo_SignificanceLevelType__Output);
  'reasonForWarning'?: (string);
}
