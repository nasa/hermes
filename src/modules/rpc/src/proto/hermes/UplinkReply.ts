// Original file: proto/pb/msg.proto


export interface UplinkReply {
  'id'?: (string);
  'reply'?: (Buffer | Uint8Array | string);
  'error'?: (string);
  'status'?: "reply"|"error";
}

export interface UplinkReply__Output {
  'id'?: (string);
  'reply'?: (Buffer);
  'error'?: (string);
}
