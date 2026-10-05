// Original file: proto/yamcs/protobuf/mdb/mdb.proto

import type { DataEncodingInfo as _yamcs_protobuf_mdb_DataEncodingInfo, DataEncodingInfo__Output as _yamcs_protobuf_mdb_DataEncodingInfo__Output } from '../../../yamcs/protobuf/mdb/DataEncodingInfo';
import type { UnitInfo as _yamcs_protobuf_mdb_UnitInfo, UnitInfo__Output as _yamcs_protobuf_mdb_UnitInfo__Output } from '../../../yamcs/protobuf/mdb/UnitInfo';
import type { EnumValue as _yamcs_protobuf_mdb_EnumValue, EnumValue__Output as _yamcs_protobuf_mdb_EnumValue__Output } from '../../../yamcs/protobuf/mdb/EnumValue';
import type { ArgumentMemberInfo as _yamcs_protobuf_mdb_ArgumentMemberInfo, ArgumentMemberInfo__Output as _yamcs_protobuf_mdb_ArgumentMemberInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentMemberInfo';
import type { ArgumentDimensionInfo as _yamcs_protobuf_mdb_ArgumentDimensionInfo, ArgumentDimensionInfo__Output as _yamcs_protobuf_mdb_ArgumentDimensionInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentDimensionInfo';
import type { ArgumentTypeInfo as _yamcs_protobuf_mdb_ArgumentTypeInfo, ArgumentTypeInfo__Output as _yamcs_protobuf_mdb_ArgumentTypeInfo__Output } from '../../../yamcs/protobuf/mdb/ArgumentTypeInfo';

export interface ArgumentTypeInfo {
  'engType'?: (string);
  'dataEncoding'?: (_yamcs_protobuf_mdb_DataEncodingInfo | null);
  'unitSet'?: (_yamcs_protobuf_mdb_UnitInfo)[];
  'enumValue'?: (_yamcs_protobuf_mdb_EnumValue)[];
  'rangeMin'?: (number | string);
  'rangeMax'?: (number | string);
  'member'?: (_yamcs_protobuf_mdb_ArgumentMemberInfo)[];
  'zeroStringValue'?: (string);
  'oneStringValue'?: (string);
  'minChars'?: (number);
  'maxChars'?: (number);
  'signed'?: (boolean);
  'minBytes'?: (number);
  'maxBytes'?: (number);
  'dimensions'?: (_yamcs_protobuf_mdb_ArgumentDimensionInfo)[];
  'elementType'?: (_yamcs_protobuf_mdb_ArgumentTypeInfo | null);
  'name'?: (string);
  'sizeInBits'?: (number);
}

export interface ArgumentTypeInfo__Output {
  'engType'?: (string);
  'dataEncoding'?: (_yamcs_protobuf_mdb_DataEncodingInfo__Output);
  'unitSet'?: (_yamcs_protobuf_mdb_UnitInfo__Output)[];
  'enumValue'?: (_yamcs_protobuf_mdb_EnumValue__Output)[];
  'rangeMin'?: (number);
  'rangeMax'?: (number);
  'member'?: (_yamcs_protobuf_mdb_ArgumentMemberInfo__Output)[];
  'zeroStringValue'?: (string);
  'oneStringValue'?: (string);
  'minChars'?: (number);
  'maxChars'?: (number);
  'signed'?: (boolean);
  'minBytes'?: (number);
  'maxBytes'?: (number);
  'dimensions'?: (_yamcs_protobuf_mdb_ArgumentDimensionInfo__Output)[];
  'elementType'?: (_yamcs_protobuf_mdb_ArgumentTypeInfo__Output);
  'name'?: (string);
  'sizeInBits'?: (number);
}
