// Original file: proto/pb/msg.proto

import type { CommandValue as _hermes_CommandValue, CommandValue__Output as _hermes_CommandValue__Output } from '../hermes/CommandValue';
import type { RawCommandValue as _hermes_RawCommandValue, RawCommandValue__Output as _hermes_RawCommandValue__Output } from '../hermes/RawCommandValue';
import type { CommandSequence as _hermes_CommandSequence, CommandSequence__Output as _hermes_CommandSequence__Output } from '../hermes/CommandSequence';
import type { RawCommandSequence as _hermes_RawCommandSequence, RawCommandSequence__Output as _hermes_RawCommandSequence__Output } from '../hermes/RawCommandSequence';
import type { UplinkFileChunk as _hermes_UplinkFileChunk, UplinkFileChunk__Output as _hermes_UplinkFileChunk__Output } from '../hermes/UplinkFileChunk';
import type { RequestValue as _hermes_RequestValue, RequestValue__Output as _hermes_RequestValue__Output } from '../hermes/RequestValue';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from '../google/protobuf/Empty';

export interface Uplink {
  'id'?: (string);
  'cmd'?: (_hermes_CommandValue | null);
  'parseCmd'?: (_hermes_RawCommandValue | null);
  'seq'?: (_hermes_CommandSequence | null);
  'parseSeq'?: (_hermes_RawCommandSequence | null);
  'file'?: (_hermes_UplinkFileChunk | null);
  'request'?: (_hermes_RequestValue | null);
  'cancel'?: (_google_protobuf_Empty | null);
  'final'?: (_google_protobuf_Empty | null);
  'value'?: "cmd"|"parseCmd"|"seq"|"parseSeq"|"file"|"request"|"cancel"|"final";
}

export interface Uplink__Output {
  'id'?: (string);
  'cmd'?: (_hermes_CommandValue__Output);
  'parseCmd'?: (_hermes_RawCommandValue__Output);
  'seq'?: (_hermes_CommandSequence__Output);
  'parseSeq'?: (_hermes_RawCommandSequence__Output);
  'file'?: (_hermes_UplinkFileChunk__Output);
  'request'?: (_hermes_RequestValue__Output);
  'cancel'?: (_google_protobuf_Empty__Output);
  'final'?: (_google_protobuf_Empty__Output);
}
