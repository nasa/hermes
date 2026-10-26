import { TimeFormat } from '@gov.nasa.jpl.hermes/types';

const localTimeOffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

// Formats the time of a telemetry value or event in the format the user picked
export function formatTime(row: { time: number, sclk: number }, format: TimeFormat): string {
    switch (format) {
        case TimeFormat.LOCAL:
            return new Date(row.time - localTimeOffset).toISOString().slice(0, -1);
        case TimeFormat.SCLK:
            // A row without an SCLK has NaN, and we leave its time blank. Rows arrive as JSON, which turns
            // NaN into null, and isNaN(null) is false, so we check Number.isFinite instead.
            return Number.isFinite(row.sclk) ? row.sclk.toFixed(4) : '';
        case TimeFormat.UTC:
        default:
            return new Date(row.time).toISOString();
    }
}
