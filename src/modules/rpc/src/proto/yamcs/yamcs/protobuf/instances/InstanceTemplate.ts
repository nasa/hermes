// Original file: proto/yamcs/protobuf/instances/instances.proto

import type { TemplateVariable as _yamcs_protobuf_instances_TemplateVariable, TemplateVariable__Output as _yamcs_protobuf_instances_TemplateVariable__Output } from '../../../yamcs/protobuf/instances/TemplateVariable';

export interface InstanceTemplate {
  'name'?: (string);
  'variables'?: (_yamcs_protobuf_instances_TemplateVariable)[];
  'description'?: (string);
}

export interface InstanceTemplate__Output {
  'name'?: (string);
  'variables'?: (_yamcs_protobuf_instances_TemplateVariable__Output)[];
  'description'?: (string);
}
