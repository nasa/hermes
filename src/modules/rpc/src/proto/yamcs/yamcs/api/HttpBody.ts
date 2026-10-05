// Original file: proto/yamcs/api/httpbody.proto


export interface HttpBody {
  'contentType'?: (string);
  'filename'?: (string);
  'data'?: (Buffer | Uint8Array | string);
  'metadata'?: ({[key: string]: string});
}

export interface HttpBody__Output {
  'contentType'?: (string);
  'filename'?: (string);
  'data'?: (Buffer);
  'metadata'?: ({[key: string]: string});
}
