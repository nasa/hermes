// Original file: proto/yamcs/protobuf/config/config.proto

import type { OptionType as _yamcs_protobuf_config_OptionType, OptionType__Output as _yamcs_protobuf_config_OptionType__Output } from '../../../yamcs/protobuf/config/OptionType';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from '../../../google/protobuf/Value';
import type { SpecInfo as _yamcs_protobuf_config_SpecInfo, SpecInfo__Output as _yamcs_protobuf_config_SpecInfo__Output } from '../../../yamcs/protobuf/config/SpecInfo';

export interface OptionInfo {
  'name'?: (string);
  'type'?: (_yamcs_protobuf_config_OptionType);
  'title'?: (string);
  'default'?: (_google_protobuf_Value | null);
  'required'?: (boolean);
  'hidden'?: (boolean);
  'secret'?: (boolean);
  'versionAdded'?: (string);
  'deprecationMessage'?: (string);
  'description'?: (string)[];
  'elementType'?: (_yamcs_protobuf_config_OptionType);
  'spec'?: (_yamcs_protobuf_config_SpecInfo | null);
  'choices'?: (_google_protobuf_Value)[];
  'applySpecDefaults'?: (boolean);
  'aliases'?: (string)[];
}

export interface OptionInfo__Output {
  'name'?: (string);
  'type'?: (_yamcs_protobuf_config_OptionType__Output);
  'title'?: (string);
  'default'?: (_google_protobuf_Value__Output);
  'required'?: (boolean);
  'hidden'?: (boolean);
  'secret'?: (boolean);
  'versionAdded'?: (string);
  'deprecationMessage'?: (string);
  'description'?: (string)[];
  'elementType'?: (_yamcs_protobuf_config_OptionType__Output);
  'spec'?: (_yamcs_protobuf_config_SpecInfo__Output);
  'choices'?: (_google_protobuf_Value__Output)[];
  'applySpecDefaults'?: (boolean);
  'aliases'?: (string)[];
}
