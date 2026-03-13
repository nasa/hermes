// Original file: proto/pb/dictionary.proto

import type { DictionaryHead as _DictionaryHead, DictionaryHead__Output as _DictionaryHead__Output } from './DictionaryHead';
import type { DictionaryNamespace as _DictionaryNamespace, DictionaryNamespace__Output as _DictionaryNamespace__Output } from './DictionaryNamespace';

export interface Dictionary {
  'head'?: (_DictionaryHead | null);
  'content'?: ({[key: string]: _DictionaryNamespace});
  'metadata'?: ({[key: string]: string});
  'id'?: (string);
}

export interface Dictionary__Output {
  'head'?: (_DictionaryHead__Output);
  'content'?: ({[key: string]: _DictionaryNamespace__Output});
  'metadata'?: ({[key: string]: string});
  'id'?: (string);
}
