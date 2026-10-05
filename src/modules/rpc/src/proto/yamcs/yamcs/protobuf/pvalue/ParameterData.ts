// Original file: proto/yamcs/protobuf/pvalue/pvalue.proto

import type { ParameterValue as _yamcs_protobuf_pvalue_ParameterValue, ParameterValue__Output as _yamcs_protobuf_pvalue_ParameterValue__Output } from '../../../yamcs/protobuf/pvalue/ParameterValue';
import type { Long } from '@grpc/proto-loader';

export interface ParameterData {
  'parameter'?: (_yamcs_protobuf_pvalue_ParameterValue)[];
  'group'?: (string);
  'generationTime'?: (number | string | Long);
  'seqNum'?: (number);
  'subscriptionId'?: (number);
}

export interface ParameterData__Output {
  'parameter'?: (_yamcs_protobuf_pvalue_ParameterValue__Output)[];
  'group'?: (string);
  'generationTime'?: (string);
  'seqNum'?: (number);
  'subscriptionId'?: (number);
}
