// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

import type { ServiceState as _yamcs_protobuf_services_ServiceState, ServiceState__Output as _yamcs_protobuf_services_ServiceState__Output } from '../../../yamcs/protobuf/services/ServiceState';
import type { ReplayRequest as _yamcs_protobuf_ReplayRequest, ReplayRequest__Output as _yamcs_protobuf_ReplayRequest__Output } from '../../../yamcs/protobuf/ReplayRequest';
import type { _yamcs_protobuf_ReplayStatus_ReplayState, _yamcs_protobuf_ReplayStatus_ReplayState__Output } from '../../../yamcs/protobuf/ReplayStatus';
import type { ServiceInfo as _yamcs_protobuf_services_ServiceInfo, ServiceInfo__Output as _yamcs_protobuf_services_ServiceInfo__Output } from '../../../yamcs/protobuf/services/ServiceInfo';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { AcknowledgmentInfo as _yamcs_protobuf_yamcsManagement_AcknowledgmentInfo, AcknowledgmentInfo__Output as _yamcs_protobuf_yamcsManagement_AcknowledgmentInfo__Output } from '../../../yamcs/protobuf/yamcsManagement/AcknowledgmentInfo';

export interface ProcessorInfo {
  'instance'?: (string);
  'name'?: (string);
  'type'?: (string);
  'spec'?: (string);
  'creator'?: (string);
  'hasAlarms'?: (boolean);
  'hasCommanding'?: (boolean);
  'state'?: (_yamcs_protobuf_services_ServiceState);
  'replayRequest'?: (_yamcs_protobuf_ReplayRequest | null);
  'replayState'?: (_yamcs_protobuf_ReplayStatus_ReplayState);
  'services'?: (_yamcs_protobuf_services_ServiceInfo)[];
  'persistent'?: (boolean);
  'time'?: (_google_protobuf_Timestamp | null);
  'replay'?: (boolean);
  'checkCommandClearance'?: (boolean);
  'protected'?: (boolean);
  'acknowledgments'?: (_yamcs_protobuf_yamcsManagement_AcknowledgmentInfo)[];
  'overrideAlgorithmsEnabled'?: (boolean);
}

export interface ProcessorInfo__Output {
  'instance'?: (string);
  'name'?: (string);
  'type'?: (string);
  'spec'?: (string);
  'creator'?: (string);
  'hasAlarms'?: (boolean);
  'hasCommanding'?: (boolean);
  'state'?: (_yamcs_protobuf_services_ServiceState__Output);
  'replayRequest'?: (_yamcs_protobuf_ReplayRequest__Output);
  'replayState'?: (_yamcs_protobuf_ReplayStatus_ReplayState__Output);
  'services'?: (_yamcs_protobuf_services_ServiceInfo__Output)[];
  'persistent'?: (boolean);
  'time'?: (_google_protobuf_Timestamp__Output);
  'replay'?: (boolean);
  'checkCommandClearance'?: (boolean);
  'protected'?: (boolean);
  'acknowledgments'?: (_yamcs_protobuf_yamcsManagement_AcknowledgmentInfo__Output)[];
  'overrideAlgorithmsEnabled'?: (boolean);
}
