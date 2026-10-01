// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto


// Original file: proto/yamcs/protobuf/yamcsManagement/yamcsManagement.proto

export const _yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation = {
  CREATE_PROCESSOR: 'CREATE_PROCESSOR',
  CONNECT_TO_PROCESSOR: 'CONNECT_TO_PROCESSOR',
} as const;

export type _yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation =
  | 'CREATE_PROCESSOR'
  | 0
  | 'CONNECT_TO_PROCESSOR'
  | 1

export type _yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation__Output = typeof _yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation[keyof typeof _yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation]

export interface ProcessorManagementRequest {
  'operation'?: (_yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation);
  'instance'?: (string);
  'name'?: (string);
  'type'?: (string);
  'config'?: (string);
  'persistent'?: (boolean);
}

export interface ProcessorManagementRequest__Output {
  'operation'?: (_yamcs_protobuf_yamcsManagement_ProcessorManagementRequest_Operation__Output);
  'instance'?: (string);
  'name'?: (string);
  'type'?: (string);
  'config'?: (string);
  'persistent'?: (boolean);
}
