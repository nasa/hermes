// Original file: proto/yamcs/protobuf/mdb/mdb.proto


export interface EnumRange {
  'min'?: (number | string);
  'max'?: (number | string);
  'minInclusive'?: (boolean);
  'maxInclusive'?: (boolean);
  'label'?: (string);
  'description'?: (string);
}

export interface EnumRange__Output {
  'min'?: (number);
  'max'?: (number);
  'minInclusive'?: (boolean);
  'maxInclusive'?: (boolean);
  'label'?: (string);
  'description'?: (string);
}
