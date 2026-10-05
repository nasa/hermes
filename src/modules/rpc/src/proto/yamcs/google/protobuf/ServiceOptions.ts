// Original file: null

import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from '../../google/protobuf/FeatureSet';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';

export interface ServiceOptions {
  'deprecated'?: (boolean);
  'features'?: (_google_protobuf_FeatureSet | null);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.yamcs.api.label'?: (string);
  '.yamcs.api.markdown'?: (boolean);
}

export interface ServiceOptions__Output {
  'deprecated'?: (boolean);
  'features'?: (_google_protobuf_FeatureSet__Output);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption__Output)[];
  '.yamcs.api.label'?: (string);
  '.yamcs.api.markdown'?: (boolean);
}
