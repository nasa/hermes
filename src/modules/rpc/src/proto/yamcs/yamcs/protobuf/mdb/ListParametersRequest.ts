// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { DataSourceType as _yamcs_protobuf_mdb_DataSourceType, DataSourceType__Output as _yamcs_protobuf_mdb_DataSourceType__Output } from '../../../yamcs/protobuf/mdb/DataSourceType';

export interface ListParametersRequest {
  'instance'?: (string);
  'q'?: (string);
  'details'?: (boolean);
  'type'?: (string)[];
  'next'?: (string);
  'pos'?: (number);
  'limit'?: (number);
  'source'?: (_yamcs_protobuf_mdb_DataSourceType);
  'system'?: (string);
  'searchMembers'?: (boolean);
}

export interface ListParametersRequest__Output {
  'instance'?: (string);
  'q'?: (string);
  'details'?: (boolean);
  'type'?: (string)[];
  'next'?: (string);
  'pos'?: (number);
  'limit'?: (number);
  'source'?: (_yamcs_protobuf_mdb_DataSourceType__Output);
  'system'?: (string);
  'searchMembers'?: (boolean);
}
