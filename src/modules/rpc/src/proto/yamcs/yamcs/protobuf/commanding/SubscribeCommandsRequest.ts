// Original file: proto/yamcs/protobuf/commanding/commands_service.proto


export interface SubscribeCommandsRequest {
  'instance'?: (string);
  'processor'?: (string);
  'ignorePastCommands'?: (boolean);
}

export interface SubscribeCommandsRequest__Output {
  'instance'?: (string);
  'processor'?: (string);
  'ignorePastCommands'?: (boolean);
}
