// Original file: proto/pb/dictionary.proto

import type { ComparisonOperator as _hermes_ComparisonOperator, ComparisonOperator__Output as _hermes_ComparisonOperator__Output } from '../hermes/ComparisonOperator';
import type { Value as _hermes_Value, Value__Output as _hermes_Value__Output } from '../hermes/Value';

export interface ParameterComparison {
  'parameterRef'?: (string);
  'operator'?: (_hermes_ComparisonOperator);
  'value'?: (_hermes_Value | null);
}

export interface ParameterComparison__Output {
  'parameterRef'?: (string);
  'operator'?: (_hermes_ComparisonOperator__Output);
  'value'?: (_hermes_Value__Output);
}
