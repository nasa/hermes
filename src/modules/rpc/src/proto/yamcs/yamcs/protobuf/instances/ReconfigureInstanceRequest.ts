// Original file: proto/yamcs/protobuf/instances/instances_service.proto


export interface ReconfigureInstanceRequest {
  'instance'?: (string);
  'templateArgs'?: ({[key: string]: string});
  'labels'?: ({[key: string]: string});
}

export interface ReconfigureInstanceRequest__Output {
  'instance'?: (string);
  'templateArgs'?: ({[key: string]: string});
  'labels'?: ({[key: string]: string});
}
