// Original file: proto/pb/dictionary.proto

import type { FormatSpecifierType as _hermes_FormatSpecifierType, FormatSpecifierType__Output as _hermes_FormatSpecifierType__Output } from '../hermes/FormatSpecifierType';

export interface FormatSpecifier {
  'type'?: (_hermes_FormatSpecifierType);
  'precision'?: (number);
  'argumentIndex'?: (number);
  '_precision'?: "precision";
}

export interface FormatSpecifier__Output {
  'type'?: (_hermes_FormatSpecifierType__Output);
  'precision'?: (number);
  'argumentIndex'?: (number);
}
