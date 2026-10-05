// Original file: proto/yamcs/protobuf/mdb/mdb.proto


export interface ValidRangeInfo {
  'minimum'?: (number | string);
  'maximum'?: (number | string);
  'minimumInclusive'?: (boolean);
  'maximumInclusive'?: (boolean);
}

export interface ValidRangeInfo__Output {
  'minimum'?: (number);
  'maximum'?: (number);
  'minimumInclusive'?: (boolean);
  'maximumInclusive'?: (boolean);
}
