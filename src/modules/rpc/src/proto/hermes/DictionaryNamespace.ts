// Original file: proto/pb/dictionary.proto

import type { CommandDef as _hermes_CommandDef, CommandDef__Output as _hermes_CommandDef__Output } from '../hermes/CommandDef';
import type { EventDef as _hermes_EventDef, EventDef__Output as _hermes_EventDef__Output } from '../hermes/EventDef';
import type { TelemetryDef as _hermes_TelemetryDef, TelemetryDef__Output as _hermes_TelemetryDef__Output } from '../hermes/TelemetryDef';
import type { ParameterDef as _hermes_ParameterDef, ParameterDef__Output as _hermes_ParameterDef__Output } from '../hermes/ParameterDef';
import type { Type as _hermes_Type, Type__Output as _hermes_Type__Output } from '../hermes/Type';

export interface DictionaryNamespace {
  'commands'?: ({[key: string]: _hermes_CommandDef});
  'events'?: ({[key: string]: _hermes_EventDef});
  'telemetry'?: ({[key: string]: _hermes_TelemetryDef});
  'parameters'?: ({[key: string]: _hermes_ParameterDef});
  'types'?: ({[key: string]: _hermes_Type});
}

export interface DictionaryNamespace__Output {
  'commands'?: ({[key: string]: _hermes_CommandDef__Output});
  'events'?: ({[key: string]: _hermes_EventDef__Output});
  'telemetry'?: ({[key: string]: _hermes_TelemetryDef__Output});
  'parameters'?: ({[key: string]: _hermes_ParameterDef__Output});
  'types'?: ({[key: string]: _hermes_Type__Output});
}
