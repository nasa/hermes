// Original file: proto/yamcs/protobuf/commanding/commanding.proto

import type { Long } from '@grpc/proto-loader';

export interface _yamcs_protobuf_commanding_VerifierConfig_CheckWindow {
  'timeToStartChecking'?: (number | string | Long);
  'timeToStopChecking'?: (number | string | Long);
}

export interface _yamcs_protobuf_commanding_VerifierConfig_CheckWindow__Output {
  'timeToStartChecking'?: (string);
  'timeToStopChecking'?: (string);
}

export interface VerifierConfig {
  'disable'?: (boolean);
  'checkWindow'?: (_yamcs_protobuf_commanding_VerifierConfig_CheckWindow | null);
}

export interface VerifierConfig__Output {
  'disable'?: (boolean);
  'checkWindow'?: (_yamcs_protobuf_commanding_VerifierConfig_CheckWindow__Output);
}
