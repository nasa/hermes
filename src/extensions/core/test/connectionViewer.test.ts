import { expect, jest, test } from '@jest/globals';
import type { Api } from '@gov.nasa.jpl.hermes/api';

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

// The posted lists that have a change listener
type Lists = Required<Pick<Connections.State, 'profileProviders' | 'profiles' | 'dictionaries'>>;

test.each(['profileProviders', 'profiles', 'dictionaries'] as const)('a refresh keeps the %s that changed while it waited on its lookups', async (list) => {
    const lists: Lists = { profileProviders: [], profiles: {}, dictionaries: {} };
    const changed: Lists = { profileProviders: [{ name: 'added' }], profiles: { added: {} }, dictionaries: { added: {} } };
    // The listeners the panel registers for changes to each list
    const listeners: { [L in keyof Lists]: ((reported: Lists[L]) => void)[] } = { profileProviders: [], profiles: [], dictionaries: [] };
    const none = () => ({ dispose: () => { } });
    const api: Partial<Api> = {
        onFswChange: none,
        onProvidersChange: (listener) => { listeners.profileProviders.push(listener); return none(); },
        onProfilesChange: (listener) => { listeners.profiles.push(listener); return none(); },
        onDictionaryChange: (listener) => { listeners.dictionaries.push(listener); return none(); },
        allFsw: async () => [],
        allProviders: async () => lists.profileProviders,
        allProfiles: async () => lists.profiles,
        allDictionaries: async () => lists.dictionaries,
    };
    const vscodeApi: Partial<VscodeHermes> = { dictionaryProviders: new Map(), onDictionaryProvidersChanged: none };
    const viewer = new ConnectionViewer('', api as Api, vscodeApi as VscodeHermes);

    // The lists the webview shows. A message replaces the ones it carries.
    const shown: Connections.State = {};
    const msg: Partial<NonNullable<ConnectionViewer['msg']>> = { postMessage: async (message) => { Object.assign(shown, message); return true; } };
    // The panel normally creates msg when VS Code first shows the view
    viewer.msg = msg as ConnectionViewer['msg'];

    // The backend replaces one list and reports the change
    const change = <L extends keyof Lists>(name: L) => {
        lists[name] = changed[name];
        listeners[name].forEach((listener) => listener(changed[name]));
    };

    const refreshing = viewer.refresh();
    change(list);
    await refreshing;

    expect(shown[list]).toEqual(changed[list]);
});
