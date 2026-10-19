import type { YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';

import type { EventRow, YamcsSeverity } from '../../common/evrs';
import { millis } from './yamcsRows';

/**
 * Turn YAMCS events into events panel rows. We skip events without a generation
 * time or already in seen, and add the rest to seen.
 */
export function yamcsEventRows(instance: string, events: readonly YamcsEvent[], seen: Set<string>): EventRow[] {
    const source = `yamcs:${instance}`;
    const rows: EventRow[] = [];
    for (const e of events) {
        // We show when the flight software raised the event
        const time = millis(e.generationTime);
        // YAMCS tells events apart by generation time, source and sequence number
        const key = JSON.stringify([source, e.generationTime?.seconds, e.generationTime?.nanos, e.source, e.seqNumber]);
        if (time === undefined || seen.has(key)) {
            continue;
        }
        seen.add(key);

        rows.push({
            time,
            // YAMCS has no SCLK
            sclk: NaN,
            source,
            ...componentAndName(e),
            severity: severity(e.severity),
            message: e.message ?? '',
        });
    }
    return rows;
}

function componentAndName(e: YamcsEvent): { component: string; name: string } {
    // fprime-yamcs puts an F Prime event's full name, like CdhCore.cmdDisp.OpCodeDispatched,
    // in its extra fields. We split it into the component and the event name.
    const full = e.extra?.fprime_event_name;
    const dot = full?.lastIndexOf('.') ?? -1;
    if (full && dot > 0) {
        return { component: full.slice(0, dot), name: full.slice(dot + 1) };
    }
    // Other events keep YAMCS's source and type
    return { component: e.source ?? '', name: e.type ?? '' };
}

function severity(s: YamcsEvent['severity']): YamcsSeverity {
    // YAMCS already sends WARNING_NEW as WARNING and ERROR as SEVERE, but we map
    // them too in case a later YAMCS does not. No severity means YAMCS's default, INFO.
    return s === 'WARNING_NEW' ? 'WARNING' : s === 'ERROR' ? 'SEVERE' : s ?? 'INFO';
}
