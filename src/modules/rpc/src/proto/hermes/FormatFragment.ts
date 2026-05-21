// Original file: proto/pb/dictionary.proto

import type { FormatSpecifier as _hermes_FormatSpecifier, FormatSpecifier__Output as _hermes_FormatSpecifier__Output } from '../hermes/FormatSpecifier';

export interface FormatFragment {
  'text'?: (string);
  'specifier'?: (_hermes_FormatSpecifier | null);
  'fragment'?: "text"|"specifier";
}

export interface FormatFragment__Output {
  'text'?: (string);
  'specifier'?: (_hermes_FormatSpecifier__Output);
}
