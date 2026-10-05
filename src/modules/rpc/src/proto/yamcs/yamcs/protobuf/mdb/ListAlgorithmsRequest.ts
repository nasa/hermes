// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { _yamcs_protobuf_mdb_AlgorithmInfo_Scope, _yamcs_protobuf_mdb_AlgorithmInfo_Scope__Output } from '../../../yamcs/protobuf/mdb/AlgorithmInfo';

export interface ListAlgorithmsRequest {
  'instance'?: (string);
  'q'?: (string);
  'next'?: (string);
  'pos'?: (number);
  'limit'?: (number);
  'system'?: (string);
  'scope'?: (_yamcs_protobuf_mdb_AlgorithmInfo_Scope);
}

export interface ListAlgorithmsRequest__Output {
  'instance'?: (string);
  'q'?: (string);
  'next'?: (string);
  'pos'?: (number);
  'limit'?: (number);
  'system'?: (string);
  'scope'?: (_yamcs_protobuf_mdb_AlgorithmInfo_Scope__Output);
}
