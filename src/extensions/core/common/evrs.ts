import { DisplayEvent, EvrSeverity } from "@gov.nasa.jpl.hermes/types/src";

/**
 * YAMCS event severity names, with WARNING_NEW shown as WARNING and ERROR as SEVERE
 */
export type YamcsSeverity = 'INFO' | 'WATCH' | 'WARNING' | 'DISTRESS' | 'CRITICAL' | 'SEVERE';

/**
 * A row of the events panel. YAMCS rows keep YAMCS's severity.
 */
export type EventRow = Omit<DisplayEvent, 'severity'> & { severity: EvrSeverity | YamcsSeverity };

export type BackendMessage = (
    | { type: "update", events: EventRow[]; }
    | { type: "append", events: EventRow | EventRow[]; }
);

export type FrontendMessage = (
    | { type: "refresh" }
    | { type: "clear" }
);
