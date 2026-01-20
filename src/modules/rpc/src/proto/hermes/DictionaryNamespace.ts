// Original file: proto/pb/dictionary.proto

import type { CommandDef as _CommandDef, CommandDef__Output as _CommandDef__Output } from './CommandDef';
import type { EventDef as _EventDef, EventDef__Output as _EventDef__Output } from './EventDef';
import type { TelemetryDef as _TelemetryDef, TelemetryDef__Output as _TelemetryDef__Output } from './TelemetryDef';
import type { ParameterDef as _ParameterDef, ParameterDef__Output as _ParameterDef__Output } from './ParameterDef';
import type { Type as _Type, Type__Output as _Type__Output } from './Type';

export interface DictionaryNamespace {
  'commands'?: ({[key: string]: _CommandDef});
  'events'?: ({[key: string]: _EventDef});
  'telemetry'?: ({[key: string]: _TelemetryDef});
  'parameters'?: ({[key: string]: _ParameterDef});
  'types'?: ({[key: string]: _Type});
}

export interface DictionaryNamespace__Output {
  'commands'?: ({[key: string]: _CommandDef__Output});
  'events'?: ({[key: string]: _EventDef__Output});
  'telemetry'?: ({[key: string]: _TelemetryDef__Output});
  'parameters'?: ({[key: string]: _ParameterDef__Output});
  'types'?: ({[key: string]: _Type__Output});
}
