import { describe, expect, jest, test } from '@jest/globals';

// The vscode fallback's EventEmitter is a no-op; these tests need events to fire.
jest.mock('vscode', () => {
    class EventEmitter<T> {
        private listeners = new Set<(e: T) => void>();
        event = (listener: (e: T) => void) => {
            this.listeners.add(listener);
            return { dispose: () => { this.listeners.delete(listener); } };
        };
        fire(e: T) {
            for (const listener of this.listeners) {
                listener(e);
            }
        }
        dispose() {
            this.listeners.clear();
        }
    }
    return { ...jest.requireActual<object>('vscode'), EventEmitter };
});

import type * as vscode from 'vscode';
import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import { YamcsClient, YamcsParameterValue, YamcsValue } from '@gov.nasa.jpl.hermes/rpc';

import { YamcsBackendProvider, YamcsParameterHandler } from '../src/api/Yamcs';
import { TelemetryDatabase } from '../src/components/TelemetryViewer';
import { insertionIndex, leaves, splitName } from '../src/components/yamcsRows';
import { cullTelemetrySeriesData } from '../common/telemetryTimeWindow';

// Values as the live fprime-project instance sent them
const packetSequence: YamcsValue = {
    type: 'AGGREGATE',
    aggregateValue: {
        name: ['GroupFlags', 'Count'],
        value: [
            { type: 'ENUMERATED', stringValue: 'Standalone', sint64Value: '3' },
            { type: 'UINT32', uint32Value: 14310 },
        ],
    },
};
const packetId: YamcsValue = {
    type: 'AGGREGATE',
    aggregateValue: {
        name: ['Version', 'Type', 'SecHdrFlag', 'APID'],
        value: [
            { type: 'UINT32', uint32Value: 0 },
            { type: 'BOOLEAN', booleanValue: false },
            { type: 'BOOLEAN', booleanValue: false },
            { type: 'UINT32', uint32Value: 4 },
        ],
    },
};
const comQueueDepth: YamcsValue = {
    type: 'ARRAY',
    arrayValue: [{ type: 'UINT32', uint32Value: 0 }, { type: 'UINT32', uint32Value: 2 }],
};

function pv(name: string, ms: number, engValue: YamcsValue): YamcsParameterValue {
    return {
        id: { name },
        engValue,
        generationTime: { seconds: String(Math.floor(ms / 1000)), nanos: (ms % 1000) * 1e6 },
    };
}

describe('splitName', () => {
    test('splits at the last slash', () => {
        expect(splitName('/BigData_YamcsDeployment/BigData/systemResources/CPU'))
            .toEqual(['/BigData_YamcsDeployment/BigData/systemResources', 'CPU']);
    });

    test('puts a root parameter in /', () => {
        expect(splitName('/P')).toEqual(['/', 'P']);
    });
});

describe('leaves', () => {
    test('names aggregate members and array elements like the recorder', () => {
        expect(leaves(packetSequence)).toEqual([
            { memberPath: '.GroupFlags', valueStr: 'Standalone', valueNum: 3 },
            { memberPath: '.Count', valueStr: '14310', valueNum: 14310 },
        ]);
        expect(leaves(packetId).map((l) => [l.memberPath, l.valueStr, l.valueNum])).toEqual([
            ['.Version', '0', 0],
            ['.Type', 'false', 0],
            ['.SecHdrFlag', 'false', 0],
            ['.APID', '4', 4],
        ]);
        expect(leaves(comQueueDepth).map((l) => l.memberPath)).toEqual(['[0]', '[1]']);
    });

    test('nests paths', () => {
        const value: YamcsValue = {
            type: 'ARRAY',
            arrayValue: [
                { type: 'AGGREGATE', aggregateValue: { name: ['x', 'y'], value: [{ type: 'DOUBLE', doubleValue: 1.5 }, { type: 'ARRAY', arrayValue: [{ type: 'SINT32', sint32Value: -1 }] }] } },
            ],
        };
        expect(leaves(value).map((l) => [l.memberPath, l.valueStr])).toEqual([['[0].x', '1.5'], ['[0].y[0]', '-1']]);
    });

    test('formats scalars', () => {
        const one = (v: YamcsValue) => leaves(v)[0];
        expect(one({ type: 'FLOAT', floatValue: Math.fround(0.1) })).toEqual({ memberPath: '', valueStr: '0.1', valueNum: 0.1 });
        expect(one({ type: 'UINT64', uint64Value: '18446744073709551615' }).valueStr).toBe('18446744073709551615');
        expect(one({ type: 'SINT64', sint64Value: '-9007199254740993' }).valueStr).toBe('-9007199254740993');
        expect(one({ type: 'BOOLEAN', booleanValue: true }).valueNum).toBe(1);
        expect(one({ type: 'STRING', stringValue: '7d8f579' })).toEqual({ memberPath: '', valueStr: '7d8f579', valueNum: NaN });
        expect(one({ type: 'TIMESTAMP', stringValue: '2026-10-01T00:00:00.000Z', timestampValue: '1' }).valueStr).toBe('2026-10-01T00:00:00.000Z');
        expect(one({ type: 'BINARY', binaryValue: Buffer.from([0xca, 0xfe]) }).valueStr).toBe('cafe');
    });

    test('leaves out scalars without a value', () => {
        expect(leaves({ type: 'NONE' })).toEqual([]);
        expect(leaves({ type: 'UINT32' })).toEqual([]);
        expect(leaves(undefined)).toEqual([]);
    });
});

describe('insertionIndex', () => {
    test('keeps times sorted', () => {
        expect(insertionIndex([], 5)).toBe(0);
        expect(insertionIndex([1, 3, 5], 6)).toBe(3);
        expect(insertionIndex([1, 3, 5], 2)).toBe(1);
        expect(insertionIndex([1, 3, 3, 5], 3)).toBe(3);
        expect(insertionIndex([1, 3, 5], 0)).toBe(0);
    });
});

describe('TelemetryDatabase with YAMCS parameters', () => {
    function database() {
        let handler: YamcsParameterHandler | undefined;
        const api = {
            onTelemetry: () => ({ dispose: () => { } }),
            onYamcsParameters: (h: YamcsParameterHandler) => {
                handler = h;
                return { dispose: () => { handler = undefined; } };
            },
        } as unknown as Hermes.Api;
        const db = new TelemetryDatabase(api);
        return { db, send: (values: YamcsParameterValue[]) => handler!('fprime-project', values) };
    }

    test('stores one channel per leaf at its generation time', () => {
        const { db, send } = database();
        send([
            pv('/BigData_YamcsDeployment/CCSDS_Packet_Sequence', 1000, packetSequence),
            pv('/BigData_YamcsDeployment/CdhCore/version/FrameworkVersion', 500, { type: 'STRING', stringValue: '7d8f579' }),
        ]);

        const key = 'yamcs:fprime-project:/BigData_YamcsDeployment/CCSDS_Packet_Sequence.GroupFlags';
        expect(db.series.get(key)).toEqual({ source: 'yamcs:fprime-project', component: '/BigData_YamcsDeployment', name: 'CCSDS_Packet_Sequence.GroupFlags' });
        expect(db.get(key)).toEqual({ time: [1000], sclk: [0], valueStr: ['Standalone'], valueNum: [3] });
        expect(db.get('yamcs:fprime-project:/BigData_YamcsDeployment/CdhCore/version/FrameworkVersion')?.time).toEqual([500]);
        db.dispose();
    });

    test('inserts out-of-order values in time order', () => {
        const { db, send } = database();
        const name = '/BigData_YamcsDeployment/CCSDS_Packet_ID';
        send([pv(name, 1000, packetId), pv(name, 3000, packetId)]);
        send([pv(name, 2999, packetId)]);

        const data = db.get(`yamcs:fprime-project:${name}.APID`)!;
        expect(data.time).toEqual([1000, 2999, 3000]);
        expect(cullTelemetrySeriesData(data, 2000).time).toEqual([2999, 3000]);
        db.dispose();
    });

    test('stores a resent cached value once', () => {
        const { db, send } = database();
        const name = '/BigData_YamcsDeployment/ComCcsds/comQueue/comQueueDepth';
        send([pv(name, 1000, comQueueDepth)]);
        send([pv(name, 1000, comQueueDepth)]);
        expect(db.get(`yamcs:fprime-project:${name}[1]`)?.time).toEqual([1000]);
        db.dispose();
    });

    test('skips values without a name or generation time', () => {
        const { db, send } = database();
        send([{ engValue: comQueueDepth }, { id: { name: '/A/B' }, engValue: comQueueDepth }]);
        expect(db.series.size).toBe(0);
        db.dispose();
    });

    test('reports changed keys once per batch', async () => {
        const { db, send } = database();
        const changed: Set<string>[] = [];
        const sub = db.onNewYamcsData((keys) => changed.push(keys));
        const name = '/BigData_YamcsDeployment/ComCcsds/comQueue/comQueueDepth';
        send([pv(name, 1000, comQueueDepth), pv(name, 2000, comQueueDepth)]);
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(changed).toEqual([new Set([`yamcs:fprime-project:${name}[0]`, `yamcs:fprime-project:${name}[1]`])]);
        sub.dispose();
        db.dispose();
    });
});

// Live checks against a YAMCS server running the yamcs-grpc plugin, e.g.
// YAMCS_GRPC_ADDRESS=localhost:8095 with an fprime-yamcs instance.
const address = process.env.YAMCS_GRPC_ADDRESS;
const instance = process.env.YAMCS_INSTANCE ?? 'fprime-project';

const log: Hermes.Log = {
    debug: () => { },
    info: (m) => console.log(m),
    warn: (m) => console.warn(m),
    error: (m) => console.error(m),
};

async function waitFor<T>(get: () => T | undefined, timeoutMs: number): Promise<T> {
    const deadline = Date.now() + timeoutMs;
    for (; ;) {
        const value = get();
        if (value !== undefined) {
            return value;
        }
        if (Date.now() > deadline) {
            throw new Error('timed out');
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
}

(address ? describe : describe.skip)('YAMCS (live)', () => {
    test('lists every TELEMETERED parameter across pages', async () => {
        const client = new YamcsClient(address!);
        try {
            await client.waitForReady(5000);
            const names = await client.listTelemetered(instance);
            console.log(`${names.length} TELEMETERED parameters in ${instance}`);
            // YAMCS pages ListParameters by 100
            expect(names.length).toBeGreaterThan(100);
            expect(new Set(names).size).toBe(names.length);
        } finally {
            client.close();
        }
    });

    test('parameter values reach the telemetry database', async () => {
        const api = await new YamcsBackendProvider().provideBackendApi(
            { address: address!, instance, processor: 'realtime' },
            {} as vscode.ExtensionContext,
            log,
        );
        const subscribed = Date.now();
        const db = new TelemetryDatabase(api);
        const keyEndingWith = (suffix: string) => () => [...db.data.keys()].find((k) => k.endsWith(suffix));

        try {
            // Sent once at boot, so only the cache has it
            const versionKey = await waitFor(keyEndingWith('/version/FrameworkVersion'), 2000);
            const cachedAfter = Date.now() - subscribed;
            const version = db.get(versionKey)!;

            const cpuKey = await waitFor(keyEndingWith('/systemResources/CPU'), 10000);
            await waitFor(() => db.get(cpuKey)!.time.length >= 3 || undefined, 15000);
            const apidKey = await waitFor(keyEndingWith('/CCSDS_Packet_ID.APID'), 10000);
            const depthKey = await waitFor(keyEndingWith('/comQueue/comQueueDepth[1]'), 10000);
            const flagsKey = await waitFor(keyEndingWith('/CCSDS_Packet_Sequence.GroupFlags'), 10000);

            const latest = (key: string) => {
                const data = db.get(key)!;
                const i = data.time.length - 1;
                return { ...db.series.get(key), valueStr: data.valueStr![i], valueNum: data.valueNum![i], time: new Date(data.time[i]).toISOString() };
            };
            console.log(JSON.stringify({
                channels: db.series.size,
                cachedFrameworkVersionAfterMs: cachedAfter,
                frameworkVersion: latest(versionKey),
                cpu: { ...latest(cpuKey), points: db.get(cpuKey)!.time.length },
                apid: latest(apidKey),
                comQueueDepth1: latest(depthKey),
                groupFlags: latest(flagsKey),
            }, null, 2));

            expect(version.valueStr![0]).not.toBe('');
            expect(version.time[0]).toBeLessThan(subscribed - 60 * 1000);
            expect(cachedAfter).toBeLessThan(2000);
            expect(db.get(cpuKey)!.valueNum!.every(Number.isFinite)).toBe(true);
            expect(db.series.get(apidKey)?.name).toBe('CCSDS_Packet_ID.APID');
            expect(Number.isInteger(latest(apidKey).valueNum)).toBe(true);
            expect(db.series.get(depthKey)?.name).toBe('comQueueDepth[1]');
            expect(Number.isInteger(latest(depthKey).valueNum)).toBe(true);
            expect(latest(flagsKey).valueStr).toMatch(/^[A-Za-z]+$/);
            for (const data of db.data.values()) {
                expect(data.time.every((t, i) => i === 0 || data.time[i - 1] <= t)).toBe(true);
            }
        } finally {
            db.dispose();
            api.dispose();
        }
    }, 60000);
});
