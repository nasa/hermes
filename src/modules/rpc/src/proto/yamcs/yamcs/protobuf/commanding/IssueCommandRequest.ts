// Original file: proto/yamcs/protobuf/commanding/commands_service.proto

import type { VerifierConfig as _yamcs_protobuf_commanding_VerifierConfig, VerifierConfig__Output as _yamcs_protobuf_commanding_VerifierConfig__Output } from '../../../yamcs/protobuf/commanding/VerifierConfig';
import type { Value as _yamcs_protobuf_Value, Value__Output as _yamcs_protobuf_Value__Output } from '../../../yamcs/protobuf/Value';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';

export interface _yamcs_protobuf_commanding_IssueCommandRequest_Assignment {
  'name'?: (string);
  'value'?: (string);
}

export interface _yamcs_protobuf_commanding_IssueCommandRequest_Assignment__Output {
  'name'?: (string);
  'value'?: (string);
}

export interface IssueCommandRequest {
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'dryRun'?: (boolean);
  'comment'?: (string);
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'stream'?: (string);
  'disableTransmissionConstraints'?: (boolean);
  'disableVerifiers'?: (boolean);
  'verifierConfig'?: ({[key: string]: _yamcs_protobuf_commanding_VerifierConfig});
  'extra'?: ({[key: string]: _yamcs_protobuf_Value});
  'args'?: (_google_protobuf_Struct | null);
}

export interface IssueCommandRequest__Output {
  'origin'?: (string);
  'sequenceNumber'?: (number);
  'dryRun'?: (boolean);
  'comment'?: (string);
  'instance'?: (string);
  'processor'?: (string);
  'name'?: (string);
  'stream'?: (string);
  'disableTransmissionConstraints'?: (boolean);
  'disableVerifiers'?: (boolean);
  'verifierConfig'?: ({[key: string]: _yamcs_protobuf_commanding_VerifierConfig__Output});
  'extra'?: ({[key: string]: _yamcs_protobuf_Value__Output});
  'args'?: (_google_protobuf_Struct__Output);
}
