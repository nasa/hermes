// Original file: proto/yamcs/protobuf/instances/instances_service.proto


export interface CreateInstanceRequest {
  'name'?: (string);
  'template'?: (string);
  'templateArgs'?: ({[key: string]: string});
  'labels'?: ({[key: string]: string});
}

export interface CreateInstanceRequest__Output {
  'name'?: (string);
  'template'?: (string);
  'templateArgs'?: ({[key: string]: string});
  'labels'?: ({[key: string]: string});
}
