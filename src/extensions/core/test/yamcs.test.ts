import { describe, expect, jest, test } from '@jest/globals';

// Settings read as unset, so they take their defaults.
jest.mock('vscode', () => ({
    ...jest.requireActual<object>('vscode'),
    window: { showInputBox: jest.fn() },
    workspace: { getConfiguration: () => ({ get: () => undefined }) },
}));

import * as vscode from 'vscode';
import { YamcsClient } from '@gov.nasa.jpl.hermes/rpc';

import { inTopLevelSpaceSystem, YamcsBackendProvider } from '../src/api/Yamcs';

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

        showInputBox.mockResolvedValueOnce('yamcs-server:8095').mockResolvedValueOnce('other-instance');
        expect(await provider.promptForState()).toEqual({ address: 'yamcs-server:8095', instance: 'other-instance', processor: 'realtime' });
        expect(prefilled()).toEqual(['localhost:8091', 'fprime-project']);

        // Escape cancels
        showInputBox.mockClear();
        showInputBox.mockResolvedValueOnce('yamcs-server:8095').mockResolvedValueOnce(undefined);
        expect(await provider.promptForState()).toBeNull();
        expect(prefilled()).toEqual(['yamcs-server:8095', 'other-instance']);
    });
});

// Live checks against a YAMCS server running the yamcs-grpc plugin, e.g.
// YAMCS_GRPC_ADDRESS=localhost:8091 with an fprime-yamcs instance.
const address = process.env.YAMCS_GRPC_ADDRESS;
const instance = process.env.YAMCS_INSTANCE ?? 'fprime-project';

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
});
