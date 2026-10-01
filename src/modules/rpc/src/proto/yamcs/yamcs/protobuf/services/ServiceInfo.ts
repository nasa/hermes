// Original file: proto/yamcs/protobuf/services/services.proto

import type { ServiceState as _yamcs_protobuf_services_ServiceState, ServiceState__Output as _yamcs_protobuf_services_ServiceState__Output } from '../../../yamcs/protobuf/services/ServiceState';

export interface ServiceInfo {
  'instance'?: (string);
  'name'?: (string);
  'state'?: (_yamcs_protobuf_services_ServiceState);
  'className'?: (string);
  'processor'?: (string);
  'failureMessage'?: (string);
  'failureCause'?: (string);
}

export interface ServiceInfo__Output {
  'instance'?: (string);
  'name'?: (string);
  'state'?: (_yamcs_protobuf_services_ServiceState__Output);
  'className'?: (string);
  'processor'?: (string);
  'failureMessage'?: (string);
  'failureCause'?: (string);
}
