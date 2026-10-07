// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { NamedObjectId as _yamcs_protobuf_NamedObjectId, NamedObjectId__Output as _yamcs_protobuf_NamedObjectId__Output } from '../../../yamcs/protobuf/NamedObjectId';
import type { ParameterValue as _yamcs_protobuf_pvalue_ParameterValue, ParameterValue__Output as _yamcs_protobuf_pvalue_ParameterValue__Output } from '../../../yamcs/protobuf/pvalue/ParameterValue';
import type { SubscribedParameterInfo as _yamcs_protobuf_processing_SubscribedParameterInfo, SubscribedParameterInfo__Output as _yamcs_protobuf_processing_SubscribedParameterInfo__Output } from '../../../yamcs/protobuf/processing/SubscribedParameterInfo';

export interface SubscribeParametersData {
  'mapping'?: ({[key: number]: _yamcs_protobuf_NamedObjectId});
  'invalid'?: (_yamcs_protobuf_NamedObjectId)[];
  'values'?: (_yamcs_protobuf_pvalue_ParameterValue)[];
  'info'?: ({[key: number]: _yamcs_protobuf_processing_SubscribedParameterInfo});
}

export interface SubscribeParametersData__Output {
  'mapping'?: ({[key: number]: _yamcs_protobuf_NamedObjectId__Output});
  'invalid'?: (_yamcs_protobuf_NamedObjectId__Output)[];
  'values'?: (_yamcs_protobuf_pvalue_ParameterValue__Output)[];
  'info'?: ({[key: number]: _yamcs_protobuf_processing_SubscribedParameterInfo__Output});
}
