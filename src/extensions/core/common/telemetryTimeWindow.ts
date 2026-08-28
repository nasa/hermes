import type { TelemetrySeriesData } from './telemetry';

/**
 * Get the slice index for retaining samples within a time window.
 *
 * Returns the index of the first timestamp on or after the cutoff. When every
 * sample is expired, returns `times.length` so `times.slice(startIdx)` would
 * properly result in an empty array.
 */
export function getTimeWindowSliceIndex(times: readonly number[], cutoffTime: number): number {
    const startIdx = times.findIndex(time => time >= cutoffTime);
    return startIdx === -1 ? times.length : startIdx;
}

/**
 * Return telemetry data with samples before the cutoff removed from every
 * column. Returns the original data when no samples have expired.
 */
export function cullTelemetrySeriesData(
    data: TelemetrySeriesData,
    cutoffTime: number,
): TelemetrySeriesData {
    const startIdx = getTimeWindowSliceIndex(data.time, cutoffTime);
    if (startIdx === 0) {
        return data;
    }

    return {
        time: data.time.slice(startIdx),
        sclk: data.sclk.slice(startIdx),
        valueStr: data.valueStr?.slice(startIdx),
        valueNum: data.valueNum?.slice(startIdx),
    };
}

/**
 * Cull expired samples from every telemetry series. Returns the original map
 * when no series changes so React can avoid an unnecessary state update.
 */
export function cullTelemetrySeriesMap(
    data: Record<string, TelemetrySeriesData>,
    cutoffTime: number,
): Record<string, TelemetrySeriesData> {
    let next = data;

    for (const [channelKey, channelData] of Object.entries(data)) {
        const culledData = cullTelemetrySeriesData(channelData, cutoffTime);
        if (culledData === channelData) {
            continue;
        }

        if (next === data) {
            next = { ...data };
        }
        next[channelKey] = culledData;
    }

    return next;
}
