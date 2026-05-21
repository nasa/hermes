// Original file: proto/pb/dictionary.proto

export const FormatSpecifierType = {
  FMT_DEFAULT: 0,
  FMT_CHAR: 1,
  FMT_DECIMAL: 2,
  FMT_HEX_LOWER: 3,
  FMT_HEX_UPPER: 4,
  FMT_OCTAL: 5,
  FMT_EXP_LOWER: 6,
  FMT_EXP_UPPER: 7,
  FMT_FIXED_LOWER: 8,
  FMT_FIXED_UPPER: 9,
  FMT_GENERAL_LOWER: 10,
  FMT_GENERAL_UPPER: 11,
} as const;

export type FormatSpecifierType =
  | 'FMT_DEFAULT'
  | 0
  | 'FMT_CHAR'
  | 1
  | 'FMT_DECIMAL'
  | 2
  | 'FMT_HEX_LOWER'
  | 3
  | 'FMT_HEX_UPPER'
  | 4
  | 'FMT_OCTAL'
  | 5
  | 'FMT_EXP_LOWER'
  | 6
  | 'FMT_EXP_UPPER'
  | 7
  | 'FMT_FIXED_LOWER'
  | 8
  | 'FMT_FIXED_UPPER'
  | 9
  | 'FMT_GENERAL_LOWER'
  | 10
  | 'FMT_GENERAL_UPPER'
  | 11

export type FormatSpecifierType__Output = typeof FormatSpecifierType[keyof typeof FormatSpecifierType]
