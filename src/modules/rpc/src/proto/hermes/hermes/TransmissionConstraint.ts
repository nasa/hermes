// Original file: proto/pb/dictionary.proto

import type { ParameterComparison as _hermes_ParameterComparison, ParameterComparison__Output as _hermes_ParameterComparison__Output } from '../hermes/ParameterComparison';
import type { TimeWindow as _hermes_TimeWindow, TimeWindow__Output as _hermes_TimeWindow__Output } from '../hermes/TimeWindow';
import type { BooleanExpression as _hermes_BooleanExpression, BooleanExpression__Output as _hermes_BooleanExpression__Output } from '../hermes/BooleanExpression';

export interface TransmissionConstraint {
  'description'?: (string);
  'parameterComparison'?: (_hermes_ParameterComparison | null);
  'timeWindow'?: (_hermes_TimeWindow | null);
  'booleanExpression'?: (_hermes_BooleanExpression | null);
  'constraint'?: "parameterComparison"|"timeWindow"|"booleanExpression";
}

export interface TransmissionConstraint__Output {
  'description'?: (string);
  'parameterComparison'?: (_hermes_ParameterComparison__Output);
  'timeWindow'?: (_hermes_TimeWindow__Output);
  'booleanExpression'?: (_hermes_BooleanExpression__Output);
}
