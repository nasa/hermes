// Original file: proto/yamcs/protobuf/config/config.proto

import type { OptionInfo as _yamcs_protobuf_config_OptionInfo, OptionInfo__Output as _yamcs_protobuf_config_OptionInfo__Output } from '../../../yamcs/protobuf/config/OptionInfo';
import type { OptionGroupInfo as _yamcs_protobuf_config_OptionGroupInfo, OptionGroupInfo__Output as _yamcs_protobuf_config_OptionGroupInfo__Output } from '../../../yamcs/protobuf/config/OptionGroupInfo';
import type { WhenConditionInfo as _yamcs_protobuf_config_WhenConditionInfo, WhenConditionInfo__Output as _yamcs_protobuf_config_WhenConditionInfo__Output } from '../../../yamcs/protobuf/config/WhenConditionInfo';

export interface SpecInfo {
  'options'?: (_yamcs_protobuf_config_OptionInfo)[];
  'allowUnknownKeys'?: (boolean);
  'requiredOneOf'?: (_yamcs_protobuf_config_OptionGroupInfo)[];
  'requireTogether'?: (_yamcs_protobuf_config_OptionGroupInfo)[];
  'whenConditions'?: (_yamcs_protobuf_config_WhenConditionInfo)[];
}

export interface SpecInfo__Output {
  'options'?: (_yamcs_protobuf_config_OptionInfo__Output)[];
  'allowUnknownKeys'?: (boolean);
  'requiredOneOf'?: (_yamcs_protobuf_config_OptionGroupInfo__Output)[];
  'requireTogether'?: (_yamcs_protobuf_config_OptionGroupInfo__Output)[];
  'whenConditions'?: (_yamcs_protobuf_config_WhenConditionInfo__Output)[];
}
