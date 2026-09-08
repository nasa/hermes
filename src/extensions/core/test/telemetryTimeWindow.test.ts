import { describe, expect, test } from '@jest/globals';

import {
    cullTelemetrySeriesData,
    cullTelemetrySeriesMap,
    getTimeWindowSliceIndex,
} from '../common/telemetryTimeWindow';

describe('getTimeWindowSliceIndex', () => {
    test('returns the array length when every point is expired', () => {
        expect(getTimeWindowSliceIndex([100, 200, 300], 400)).toBe(3);
    });

    test('returns the first point on or after the cutoff', () => {
        expect(getTimeWindowSliceIndex([100, 200, 300, 400], 300)).toBe(2);
    });

    test('retains every point when none are expired', () => {
        expect(getTimeWindowSliceIndex([100, 200, 300], 100)).toBe(0);
    });

    test('handles an empty series', () => {
        expect(getTimeWindowSliceIndex([], 100)).toBe(0);
    });
});

describe('cullTelemetrySeriesData', () => {
    const data = {
        time: [100, 200, 300],
        sclk: [1, 2, 3],
        valueStr: ['10', '20', '30'],
        valueNum: [10, 20, 30],
    };

    test('slices every column at the time-window boundary', () => {
        expect(cullTelemetrySeriesData(data, 250)).toEqual({
            time: [300],
            sclk: [3],
            valueStr: ['30'],
            valueNum: [30],
        });
    });

    test('removes every column when all samples are expired', () => {
        expect(cullTelemetrySeriesData(data, 400)).toEqual({
            time: [],
            sclk: [],
            valueStr: [],
            valueNum: [],
        });
    });

    test('returns the original data when no samples are expired', () => {
        expect(cullTelemetrySeriesData(data, 100)).toBe(data);
    });
});

describe('cullTelemetrySeriesMap', () => {
    const expiredData = {
        time: [100, 200],
        sclk: [1, 2],
        valueStr: ['10', '20'],
        valueNum: [10, 20],
    };
    const currentData = {
        time: [300, 400],
        sclk: [3, 4],
        valueStr: ['30', '40'],
        valueNum: [30, 40],
    };

    test('culls expired series while preserving unchanged series', () => {
        const data = {
            expired: expiredData,
            current: currentData,
        };

        const result = cullTelemetrySeriesMap(data, 250);

        expect(result).not.toBe(data);
        expect(result.expired).toEqual({
            time: [],
            sclk: [],
            valueStr: [],
            valueNum: [],
        });
        expect(result.current).toBe(currentData);
    });

    test('returns the original map when no samples are expired', () => {
        const data = { current: currentData };
        expect(cullTelemetrySeriesMap(data, 250)).toBe(data);
    });

    test('removes samples as the wall-clock cutoff advances', () => {
        const data = { current: currentData };
        expect(cullTelemetrySeriesMap(data, 500).current).toEqual({
            time: [],
            sclk: [],
            valueStr: [],
            valueNum: [],
        });
    });
});
