// Original file: proto/yamcs/protobuf/mdb/mdb.proto


export interface _yamcs_protobuf_mdb_SplineCalibratorInfo_SplinePointInfo {
  'raw'?: (number | string);
  'calibrated'?: (number | string);
}

export interface _yamcs_protobuf_mdb_SplineCalibratorInfo_SplinePointInfo__Output {
  'raw'?: (number);
  'calibrated'?: (number);
}

export interface SplineCalibratorInfo {
  'point'?: (_yamcs_protobuf_mdb_SplineCalibratorInfo_SplinePointInfo)[];
  'points'?: (_yamcs_protobuf_mdb_SplineCalibratorInfo_SplinePointInfo)[];
}

export interface SplineCalibratorInfo__Output {
  'point'?: (_yamcs_protobuf_mdb_SplineCalibratorInfo_SplinePointInfo__Output)[];
  'points'?: (_yamcs_protobuf_mdb_SplineCalibratorInfo_SplinePointInfo__Output)[];
}
