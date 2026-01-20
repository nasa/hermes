// Original file: proto/pb/msg.proto

import type { CommandValue as _CommandValue, CommandValue__Output as _CommandValue__Output } from './CommandValue';
import type { RawCommandValue as _RawCommandValue, RawCommandValue__Output as _RawCommandValue__Output } from './RawCommandValue';
import type { CommandSequence as _CommandSequence, CommandSequence__Output as _CommandSequence__Output } from './CommandSequence';
import type { RawCommandSequence as _RawCommandSequence, RawCommandSequence__Output as _RawCommandSequence__Output } from './RawCommandSequence';
import type { UplinkFileChunk as _UplinkFileChunk, UplinkFileChunk__Output as _UplinkFileChunk__Output } from './UplinkFileChunk';
import type { Empty as _google_protobuf_Empty, Empty__Output as _google_protobuf_Empty__Output } from './google/protobuf/Empty';

export interface Uplink {
  'id'?: (string);
  'cmd'?: (_CommandValue | null);
  'parseCmd'?: (_RawCommandValue | null);
  'seq'?: (_CommandSequence | null);
  'parseSeq'?: (_RawCommandSequence | null);
  'file'?: (_UplinkFileChunk | null);
  'cancel'?: (_google_protobuf_Empty | null);
  'final'?: (_google_protobuf_Empty | null);
  'value'?: "cmd"|"parseCmd"|"seq"|"parseSeq"|"file"|"cancel"|"final";
}

export interface Uplink__Output {
  'id'?: (string);
  'cmd'?: (_CommandValue__Output);
  'parseCmd'?: (_RawCommandValue__Output);
  'seq'?: (_CommandSequence__Output);
  'parseSeq'?: (_RawCommandSequence__Output);
  'file'?: (_UplinkFileChunk__Output);
  'cancel'?: (_google_protobuf_Empty__Output);
  'final'?: (_google_protobuf_Empty__Output);
}
