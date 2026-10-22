// Original file: proto/yamcs/protobuf/actions/actions.proto

import type { SpecInfo as _yamcs_protobuf_config_SpecInfo, SpecInfo__Output as _yamcs_protobuf_config_SpecInfo__Output } from '../../../yamcs/protobuf/config/SpecInfo';

export interface ActionInfo {
  'id'?: (string);
  'label'?: (string);
  'style'?: (string);
  'enabled'?: (boolean);
  'checked'?: (boolean);
  'spec'?: (_yamcs_protobuf_config_SpecInfo | null);
}

export interface ActionInfo__Output {
  'id'?: (string);
  'label'?: (string);
  'style'?: (string);
  'enabled'?: (boolean);
  'checked'?: (boolean);
  'spec'?: (_yamcs_protobuf_config_SpecInfo__Output);
}
