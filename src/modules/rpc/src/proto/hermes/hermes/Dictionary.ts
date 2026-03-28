// Original file: proto/pb/dictionary.proto

import type { DictionaryHead as _hermes_DictionaryHead, DictionaryHead__Output as _hermes_DictionaryHead__Output } from '../hermes/DictionaryHead';
import type { DictionaryNamespace as _hermes_DictionaryNamespace, DictionaryNamespace__Output as _hermes_DictionaryNamespace__Output } from '../hermes/DictionaryNamespace';

export interface Dictionary {
  'head'?: (_hermes_DictionaryHead | null);
  'content'?: ({[key: string]: _hermes_DictionaryNamespace});
  'metadata'?: ({[key: string]: string});
  'id'?: (string);
}

export interface Dictionary__Output {
  'head'?: (_hermes_DictionaryHead__Output);
  'content'?: ({[key: string]: _hermes_DictionaryNamespace__Output});
  'metadata'?: ({[key: string]: string});
  'id'?: (string);
}
