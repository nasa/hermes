// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { PolynomialCalibratorInfo as _yamcs_protobuf_mdb_PolynomialCalibratorInfo, PolynomialCalibratorInfo__Output as _yamcs_protobuf_mdb_PolynomialCalibratorInfo__Output } from '../../../yamcs/protobuf/mdb/PolynomialCalibratorInfo';
import type { SplineCalibratorInfo as _yamcs_protobuf_mdb_SplineCalibratorInfo, SplineCalibratorInfo__Output as _yamcs_protobuf_mdb_SplineCalibratorInfo__Output } from '../../../yamcs/protobuf/mdb/SplineCalibratorInfo';
import type { JavaExpressionCalibratorInfo as _yamcs_protobuf_mdb_JavaExpressionCalibratorInfo, JavaExpressionCalibratorInfo__Output as _yamcs_protobuf_mdb_JavaExpressionCalibratorInfo__Output } from '../../../yamcs/protobuf/mdb/JavaExpressionCalibratorInfo';

// Original file: proto/yamcs/protobuf/mdb/mdb.proto

export const _yamcs_protobuf_mdb_CalibratorInfo_Type = {
  POLYNOMIAL: 'POLYNOMIAL',
  SPLINE: 'SPLINE',
  MATH_OPERATION: 'MATH_OPERATION',
  JAVA_EXPRESSION: 'JAVA_EXPRESSION',
  ALGORITHM: 'ALGORITHM',
} as const;

export type _yamcs_protobuf_mdb_CalibratorInfo_Type =
  | 'POLYNOMIAL'
  | 0
  | 'SPLINE'
  | 1
  | 'MATH_OPERATION'
  | 2
  | 'JAVA_EXPRESSION'
  | 3
  | 'ALGORITHM'
  | 4

export type _yamcs_protobuf_mdb_CalibratorInfo_Type__Output = typeof _yamcs_protobuf_mdb_CalibratorInfo_Type[keyof typeof _yamcs_protobuf_mdb_CalibratorInfo_Type]

export interface CalibratorInfo {
  'polynomialCalibrator'?: (_yamcs_protobuf_mdb_PolynomialCalibratorInfo | null);
  'splineCalibrator'?: (_yamcs_protobuf_mdb_SplineCalibratorInfo | null);
  'javaExpressionCalibrator'?: (_yamcs_protobuf_mdb_JavaExpressionCalibratorInfo | null);
  'type'?: (_yamcs_protobuf_mdb_CalibratorInfo_Type);
}

export interface CalibratorInfo__Output {
  'polynomialCalibrator'?: (_yamcs_protobuf_mdb_PolynomialCalibratorInfo__Output);
  'splineCalibrator'?: (_yamcs_protobuf_mdb_SplineCalibratorInfo__Output);
  'javaExpressionCalibrator'?: (_yamcs_protobuf_mdb_JavaExpressionCalibratorInfo__Output);
  'type'?: (_yamcs_protobuf_mdb_CalibratorInfo_Type__Output);
}
