// Original file: proto/pb/dictionary.proto

import type { XtceDef as _hermes_XtceDef, XtceDef__Output as _hermes_XtceDef__Output } from '../hermes/XtceDef';
import type { ArgumentDef as _hermes_ArgumentDef, ArgumentDef__Output as _hermes_ArgumentDef__Output } from '../hermes/ArgumentDef';
import type { TransmissionConstraint as _hermes_TransmissionConstraint, TransmissionConstraint__Output as _hermes_TransmissionConstraint__Output } from '../hermes/TransmissionConstraint';

export interface CommandDef {
  'def'?: (_hermes_XtceDef | null);
  'abstract'?: (boolean);
  'arguments'?: (_hermes_ArgumentDef)[];
  'transmissionConstraints'?: (_hermes_TransmissionConstraint)[];
}

export interface CommandDef__Output {
  'def'?: (_hermes_XtceDef__Output);
  'abstract'?: (boolean);
  'arguments'?: (_hermes_ArgumentDef__Output)[];
  'transmissionConstraints'?: (_hermes_TransmissionConstraint__Output)[];
}
