import { expect, jest, test } from '@jest/globals';
import type { Api } from '@gov.nasa.jpl.hermes/api';

// Jest swaps 'vscode' for the stub in src/fallback/vscode, which can't register anything. The panel
// registers its commands and webview when it's constructed, so we give it registrations that do nothing.
jest.mock('vscode', () => ({
    ...jest.requireActual<object>('vscode'),
    commands: { registerCommand: () => ({ dispose: () => { } }) },
    window: { registerWebviewViewProvider: () => ({ dispose: () => { } }) },
}));

import { ConnectionViewer } from '../src/components/ConnectionViewer';
import type { VscodeHermes } from '../src/context';

test('a refresh never posts dictionaries older than a dictionary change that arrived during it', async () => {
    let fswChanged!: (fsws: []) => void;
    let dictionariesChanged!: (dictionaries: Record<string, object>) => void;
    const dictionaries: Record<string, object> = { 'yamcs:fprime-project': { name: 'fprime-project', type: 'yamcs' } };
    const none = () => ({ dispose: () => { } });
    const api = {
        onProvidersChange: none,
        onProfilesChange: none,
        onFswChange: (listener: typeof fswChanged) => { fswChanged = listener; return none(); },
        onDictionaryChange: (listener: typeof dictionariesChanged) => { dictionariesChanged = listener; return none(); },
        allProviders: async () => ({}),
        allProfiles: async () => ({}),
        allFsw: async () => [],
        allDictionaries: async () => ({ ...dictionaries }),
    } as unknown as Api;
    const vscodeApi = { dictionaryProviders: new Map(), onDictionaryProvidersChanged: none } as unknown as VscodeHermes;

    const viewer = new ConnectionViewer('', api, vscodeApi);
    const posted: { dictionaries?: Record<string, object> }[] = [];
    viewer.msg = { postMessage: (msg: object) => posted.push(msg) } as unknown as ConnectionViewer['msg'];

    // YAMCS mode connects, starting a refresh, and hermes-fprime adds its F Prime dictionary while that refresh waits
    fswChanged([]);
    dictionaries['yamcs:fprime-project:fprime'] = { name: 'fprime-project (F Prime)', type: 'fprime' };
    dictionariesChanged({ ...dictionaries });
    // Let the refresh finish and post
    await new Promise((resolve) => setTimeout(resolve, 0));

    const shown = posted.filter((msg) => msg.dictionaries).pop()?.dictionaries;
    expect(Object.keys(shown ?? {})).toEqual(['yamcs:fprime-project', 'yamcs:fprime-project:fprime']);
});
