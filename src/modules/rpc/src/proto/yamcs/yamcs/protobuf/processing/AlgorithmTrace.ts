// Original file: proto/yamcs/protobuf/processing/processing.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { ParameterValue as _yamcs_protobuf_pvalue_ParameterValue, ParameterValue__Output as _yamcs_protobuf_pvalue_ParameterValue__Output } from '../../../yamcs/protobuf/pvalue/ParameterValue';

export interface _yamcs_protobuf_processing_AlgorithmTrace_Log {
  'time'?: (_google_protobuf_Timestamp | null);
  'msg'?: (string);
}

export interface _yamcs_protobuf_processing_AlgorithmTrace_Log__Output {
  'time'?: (_google_protobuf_Timestamp__Output);
  'msg'?: (string);
}

export interface _yamcs_protobuf_processing_AlgorithmTrace_Run {
  'time'?: (_google_protobuf_Timestamp | null);
  'inputs'?: (_yamcs_protobuf_pvalue_ParameterValue)[];
  'outputs'?: (_yamcs_protobuf_pvalue_ParameterValue)[];
  'returnValue'?: (string);
  'error'?: (string);
}

export interface _yamcs_protobuf_processing_AlgorithmTrace_Run__Output {
  'time'?: (_google_protobuf_Timestamp__Output);
  'inputs'?: (_yamcs_protobuf_pvalue_ParameterValue__Output)[];
  'outputs'?: (_yamcs_protobuf_pvalue_ParameterValue__Output)[];
  'returnValue'?: (string);
  'error'?: (string);
}

export interface AlgorithmTrace {
  'runs'?: (_yamcs_protobuf_processing_AlgorithmTrace_Run)[];
  'logs'?: (_yamcs_protobuf_processing_AlgorithmTrace_Log)[];
}

export interface AlgorithmTrace__Output {
  'runs'?: (_yamcs_protobuf_processing_AlgorithmTrace_Run__Output)[];
  'logs'?: (_yamcs_protobuf_processing_AlgorithmTrace_Log__Output)[];
}
