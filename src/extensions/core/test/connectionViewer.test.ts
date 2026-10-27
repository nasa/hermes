import { expect, jest, test } from '@jest/globals';
import type { Api } from '@gov.nasa.jpl.hermes/api';
import type { Proto } from '@gov.nasa.jpl.hermes/types';

// Jest swaps 'vscode' for the stub in src/fallback/vscode, which can't register commands or webviews.
// ConnectionViewer registers both when it's constructed, so we mock registrations that do nothing.
jest.mock('vscode', () => ({
    ...jest.requireActual<object>('vscode'),
    commands: { registerCommand: () => ({ dispose: () => { } }) },
    window: { registerWebviewViewProvider: () => ({ dispose: () => { } }) },
}));

import type * as Connections from '../common/connections';
import { ConnectionViewer } from '../src/components/ConnectionViewer';
import type { VscodeHermes } from '../src/context';

test('a refresh keeps the dictionaries that changed while it waited on its lookup', async () => {
    let dictionaries: Record<string, Proto.IDictionaryHead> = {};
    // The listeners the panel registers for dictionary changes
    const listeners: ((reported: Record<string, Proto.IDictionaryHead>) => void)[] = [];
    const none = () => ({ dispose: () => { } });
    const api: Partial<Api> = {
        onFswChange: none,
        onDictionaryChange: (listener) => { listeners.push(listener); return none(); },
        allDictionaries: async () => dictionaries,
    };
    const vscodeApi: Partial<VscodeHermes> = { dictionaryProviders: new Map(), onDictionaryProvidersChanged: none };
    const viewer = new ConnectionViewer('', api as Api, vscodeApi as VscodeHermes);

    // The lists the webview shows. A message replaces the ones it carries.
    const shown: Connections.State = {};
    const msg: Partial<NonNullable<ConnectionViewer['msg']>> = { postMessage: async (message) => { Object.assign(shown, message); return true; } };
    // The panel normally creates msg when VS Code first shows the view
    viewer.msg = msg as ConnectionViewer['msg'];

    const refreshing = viewer.refresh();
    // The backend replaces the dictionaries and reports the change
    dictionaries = { added: {} };
    listeners.forEach((listener) => listener(dictionaries));
    await refreshing;

    expect(shown.dictionaries).toEqual({ added: {} });
});
