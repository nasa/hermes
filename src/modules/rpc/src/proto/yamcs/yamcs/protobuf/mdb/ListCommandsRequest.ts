// Original file: proto/yamcs/protobuf/mdb/mdb.proto


export interface ListCommandsRequest {
  'instance'?: (string);
  'q'?: (string);
  'details'?: (boolean);
  'next'?: (string);
  'pos'?: (number);
  'limit'?: (number);
  'noAbstract'?: (boolean);
  'system'?: (string);
}

export interface ListCommandsRequest__Output {
  'instance'?: (string);
  'q'?: (string);
  'details'?: (boolean);
  'next'?: (string);
  'pos'?: (number);
  'limit'?: (number);
  'noAbstract'?: (boolean);
  'system'?: (string);
}
