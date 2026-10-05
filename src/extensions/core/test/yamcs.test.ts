import { describe, expect, jest, test } from '@jest/globals';

// Settings a test has set. Every other setting reads as unset and takes its default.
const mockSettings: Record<string, unknown> = {};

// Jest swaps 'vscode' for the stub in src/fallback/vscode, whose EventEmitter never calls
// its listeners. These tests need events to fire, so we mock one that does.
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
    return {
        ...jest.requireActual<object>('vscode'),
        EventEmitter,
        window: { showInputBox: jest.fn() },
        workspace: { getConfiguration: () => ({ get: (key: string) => mockSettings[key] }) },
    };
});

import * as vscode from 'vscode';
import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import { YamcsClient, YamcsParameterValue, YamcsValue } from '@gov.nasa.jpl.hermes/rpc';

import { inTopLevelSpaceSystem, YamcsBackendProvider, YamcsParameterHandler } from '../src/api/Yamcs';
import { TelemetryDatabase } from '../src/components/TelemetryViewer';
import { leaves, splitName } from '../src/components/yamcsRows';

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
        acquisitionTime: { seconds: String(Math.floor(ms / 1000)), nanos: (ms % 1000) * 1e6 },
    };
}

describe('splitName', () => {
    test('splits at the last slash', () => {
        expect(splitName('/Ref_Ref/Ref/systemResources/CPU'))
            .toEqual(['/Ref_Ref/Ref/systemResources', 'CPU']);
    });

    test('puts a root parameter in /', () => {
        expect(splitName('/P')).toEqual(['/', 'P']);
    });
});

describe('inTopLevelSpaceSystem', () => {
    test('matches packet header fields but not channels', () => {
        expect(inTopLevelSpaceSystem('/Dep/FPrimeTime')).toBe(true);
        expect(inTopLevelSpaceSystem('/Dep/CdhCore/version/FrameworkVersion')).toBe(false);
        expect(inTopLevelSpaceSystem('/Dep/systemResources/CPU')).toBe(false);
    });

    test('does not match a parameter in the root space system', () => {
        expect(inTopLevelSpaceSystem('/P')).toBe(false);
    });
});

describe('YamcsBackendProvider', () => {
    test('stops connecting as soon as it is cancelled', async () => {
        let cancel = () => { };
        const token = {
            isCancellationRequested: false,
            onCancellationRequested: (listener: () => void) => {
                cancel = listener;
                return { dispose: () => { } };
            },
        } as unknown as vscode.CancellationToken;

        // Nothing listens on port 1, so without the cancel this would wait out the 5 s connect deadline
        const started = Date.now();
        const connecting = new YamcsBackendProvider().provideBackendApi(
            { address: '127.0.0.1:1', instance: 'fprime-project', processor: 'realtime' },
            {} as vscode.ExtensionContext,
            { debug: () => { }, info: () => { }, warn: () => { }, error: () => { } },
            token,
        );
        setTimeout(() => cancel(), 100);
        await expect(connecting).rejects.toThrow('Could not connect to YAMCS at 127.0.0.1:1: cancelled');
        expect(Date.now() - started).toBeLessThan(2000);
    });

    test('prefills the prompts from the setting, then from the last answers', async () => {
        const showInputBox = jest.mocked(vscode.window.showInputBox);
        const prefilled = () => showInputBox.mock.calls.map(([options]) => options?.value);
        const provider = new YamcsBackendProvider();
        mockSettings['hermes.host.yamcs'] = { address: 'set-server:8091', processor: 'replay', includeTopLevel: true };

        // The prompts ask only for address and instance, so processor and includeTopLevel come from the setting
        showInputBox.mockResolvedValueOnce('yamcs-server:8095').mockResolvedValueOnce('other-instance');
        expect(await provider.promptForState()).toEqual({
            address: 'yamcs-server:8095', instance: 'other-instance', processor: 'replay', includeTopLevel: true,
        });
        expect(prefilled()).toEqual(['set-server:8091', 'fprime-project']);

        // Escape cancels
        showInputBox.mockClear();
        showInputBox.mockResolvedValueOnce('yamcs-server:8095').mockResolvedValueOnce(undefined);
        expect(await provider.promptForState()).toBeNull();
        expect(prefilled()).toEqual(['yamcs-server:8095', 'other-instance']);
        delete mockSettings['hermes.host.yamcs'];
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
        expect(leaves({ type: 'BINARY' })).toEqual([]);
        expect(leaves(undefined)).toEqual([]);
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

    test('stores one channel per leaf at its acquisition time', () => {
        const { db, send } = database();
        send([
            pv('/Ref_Ref/CCSDS_Packet_Sequence', 1000, packetSequence),
            pv('/Ref_Ref/CdhCore/version/FrameworkVersion', 500, { type: 'STRING', stringValue: '7d8f579' }),
        ]);

        const key = 'yamcs:fprime-project:/Ref_Ref/CCSDS_Packet_Sequence.GroupFlags';
        expect(db.series.get(key)).toEqual({ source: 'yamcs:fprime-project', component: '/Ref_Ref', name: 'CCSDS_Packet_Sequence.GroupFlags' });
        expect(db.get(key)).toEqual({ time: [1000], sclk: [NaN], valueStr: ['Standalone'], valueNum: [3] });
        expect(db.get('yamcs:fprime-project:/Ref_Ref/CdhCore/version/FrameworkVersion')?.time).toEqual([500]);
        db.dispose();
    });

    test('drops a value older than the newest point', async () => {
        const { db, send } = database();
        const changed: Set<string>[] = [];
        const sub = db.onNewYamcsData((keys) => changed.push(keys));
        const name = '/Ref_Ref/CCSDS_Packet_ID';
        // The database reports changed keys in 100 ms batches. We wait past that after each send, so if the
        // older point were reported, it would arrive as a second entry rather than merge into the first
        send([pv(name, 1000, packetId), pv(name, 3000, packetId)]);
        await new Promise((resolve) => setTimeout(resolve, 200));
        send([pv(name, 2999, packetId)]);
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(db.get(`yamcs:fprime-project:${name}.APID`)!.time).toEqual([1000, 3000]);
        expect(changed).toHaveLength(1);
        sub.dispose();
        db.dispose();
    });

    test('stores a resent cached value once', () => {
        const { db, send } = database();
        const name = '/Ref_Ref/ComCcsds/comQueue/comQueueDepth';
        send([pv(name, 1000, comQueueDepth)]);
        send([pv(name, 1000, comQueueDepth)]);
        expect(db.get(`yamcs:fprime-project:${name}[1]`)?.time).toEqual([1000]);
        db.dispose();
    });

    test('skips values without a name or acquisition time', () => {
        const { db, send } = database();
        send([{ engValue: comQueueDepth }, { id: { name: '/A/B' }, engValue: comQueueDepth }]);
        expect(db.series.size).toBe(0);
        db.dispose();
    });

    test('reports changed keys once per batch', async () => {
        const { db, send } = database();
        const changed: Set<string>[] = [];
        const sub = db.onNewYamcsData((keys) => changed.push(keys));
        const name = '/Ref_Ref/ComCcsds/comQueue/comQueueDepth';
        send([pv(name, 1000, comQueueDepth), pv(name, 2000, comQueueDepth)]);
        await new Promise((resolve) => setTimeout(resolve, 200));

        expect(changed).toEqual([new Set([`yamcs:fprime-project:${name}[0]`, `yamcs:fprime-project:${name}[1]`])]);
        sub.dispose();
        db.dispose();
    });
});

// Live checks against a YAMCS server running the yamcs-grpc plugin, e.g.
// YAMCS_GRPC_ADDRESS=localhost:8091 with an fprime-yamcs instance.
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
    // The fprime-yamcs packet header fields, all directly in the deployment's space system
    const headerFields = [
        'CCSDS_Packet_ID', 'CCSDS_Packet_Length', 'CCSDS_Packet_Sequence', 'DataDescType', 'FPrimeChannelId', 'FPrimeEventId',
        'FPrimeFilePacketByteOffset', 'FPrimeFilePacketChecksum', 'FPrimeFilePacketDataSize', 'FPrimeFilePacketDestinationPath',
        'FPrimeFilePacketFileSize', 'FPrimeFilePacketSeqIndex', 'FPrimeFilePacketSourcePath', 'FPrimeFilePacketType',
        'FPrimePacketId', 'FPrimeTime',
    ];

    test('lists every TELEMETERED parameter across pages', async () => {
        const client = new YamcsClient(address!);
        try {
            await client.waitForReady(5000);
            const names = await client.listTelemetered(instance);
            const topLevel = names.filter(inTopLevelSpaceSystem);
            console.log(`${names.length} TELEMETERED parameters in ${instance}, ${topLevel.length} in a top-level space system`);
            // YAMCS returns 100 parameters per page, so more than 100 means we read past the first page
            expect(names.length).toBeGreaterThan(100);
            expect(new Set(names).size).toBe(names.length);
            expect(topLevel.map((name) => name.substring(name.lastIndexOf('/') + 1)).sort()).toEqual([...headerFields].sort());
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
            const version = db.get(versionKey)!;

            const cpuKey = await waitFor(keyEndingWith('/systemResources/CPU'), 10000);
            await waitFor(() => db.get(cpuKey)!.time.length >= 3 || undefined, 15000);
            const depthKey = await waitFor(keyEndingWith('/comQueue/comQueueDepth[1]'), 10000);
            const buffKey = await waitFor(keyEndingWith('/comQueue/buffQueueDepth[0]'), 10000);
            const headers = [...db.series.values()].filter((s) => headerFields.includes(s.name.split(/[.[]/)[0]));

            console.log(`${db.series.size} channels from ${instance}, FrameworkVersion ${version.valueStr![0]}`);

            expect(version.valueStr![0]).not.toBe('');
            expect(version.time[0]).toBeLessThan(subscribed);
            expect(db.get(cpuKey)!.valueNum!.every(Number.isFinite)).toBe(true);
            expect(db.series.get(depthKey)?.name).toBe('comQueueDepth[1]');
            expect(db.get(depthKey)!.valueNum!.every(Number.isInteger)).toBe(true);
            expect(db.get(buffKey)!.valueNum!.every(Number.isInteger)).toBe(true);
            expect(headers).toEqual([]);
            for (const data of db.data.values()) {
                expect(data.time.every((t, i) => i === 0 || data.time[i - 1] <= t)).toBe(true);
            }
        } finally {
            db.dispose();
            api.dispose();
        }
    }, 60000);

    test('includeTopLevel brings back the packet header fields', async () => {
        const api = await new YamcsBackendProvider().provideBackendApi(
            { address: address!, instance, processor: 'realtime', includeTopLevel: true },
            {} as vscode.ExtensionContext,
            log,
        );
        const db = new TelemetryDatabase(api);
        const keyEndingWith = (suffix: string) => () => [...db.data.keys()].find((k) => k.endsWith(suffix));

        try {
            const apidKey = await waitFor(keyEndingWith('/CCSDS_Packet_ID.APID'), 10000);
            const flagsKey = await waitFor(keyEndingWith('/CCSDS_Packet_Sequence.GroupFlags'), 10000);

            expect(db.series.get(apidKey)?.name).toBe('CCSDS_Packet_ID.APID');
            expect(db.get(apidKey)!.valueNum!.every(Number.isInteger)).toBe(true);
            expect(db.get(flagsKey)!.valueStr!.every((s) => /^[A-Za-z]+$/.test(s))).toBe(true);
        } finally {
            db.dispose();
            api.dispose();
        }
    }, 30000);
});
