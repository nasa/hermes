// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { DataSourceType as _yamcs_protobuf_mdb_DataSourceType, DataSourceType__Output as _yamcs_protobuf_mdb_DataSourceType__Output } from '../../../yamcs/protobuf/mdb/DataSourceType';

export interface CreateParameterRequest {
  'instance'?: (string);
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'aliases'?: ({[key: string]: string});
  'dataSource'?: (_yamcs_protobuf_mdb_DataSourceType);
  'parameterType'?: (string);
}

export interface CreateParameterRequest__Output {
  'instance'?: (string);
  'name'?: (string);
  'shortDescription'?: (string);
  'longDescription'?: (string);
  'aliases'?: ({[key: string]: string});
  'dataSource'?: (_yamcs_protobuf_mdb_DataSourceType__Output);
  'parameterType'?: (string);
}
