// Original file: proto/yamcs/protobuf/mdb/mdb.proto


export interface StreamMissionDatabaseRequest {
  'instance'?: (string);
  'includeSpaceSystems'?: (boolean);
  'includeContainers'?: (boolean);
  'includeParameters'?: (boolean);
  'includeParameterTypes'?: (boolean);
  'includeCommands'?: (boolean);
  'includeAlgorithms'?: (boolean);
}

export interface StreamMissionDatabaseRequest__Output {
  'instance'?: (string);
  'includeSpaceSystems'?: (boolean);
  'includeContainers'?: (boolean);
  'includeParameters'?: (boolean);
  'includeParameterTypes'?: (boolean);
  'includeCommands'?: (boolean);
  'includeAlgorithms'?: (boolean);
}
