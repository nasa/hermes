import { expect, test } from '@jest/globals';
import { TimeFormat } from '@gov.nasa.jpl.hermes/types';

import { formatTime } from '../common/timeFormat';

test('formatTime shows a YAMCS event without an SCLK in UTC, and no time under SCLK', () => {
    // The events panel and a cell's event list receive a YAMCS event as JSON. Hermes stores a missing SCLK as NaN, which JSON writes as null.
    const yamcsEvent = JSON.parse(JSON.stringify({ time: 1790722468095, sclk: NaN }));
    const localModeEvent = { time: 1790722468095, sclk: 1234.5 };

    expect(formatTime(yamcsEvent, TimeFormat.UTC)).toBe('2026-09-29T22:54:28.095Z');
    expect(formatTime(yamcsEvent, TimeFormat.SCLK)).toBe('');
    expect(formatTime(localModeEvent, TimeFormat.SCLK)).toBe('1234.5000');
});
