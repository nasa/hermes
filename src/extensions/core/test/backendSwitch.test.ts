import { expect, jest, test } from '@jest/globals';
import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { BackendProvider } from '@gov.nasa.jpl.hermes/vscode';
import type * as vscode from 'vscode';

// The commands VscodeApi registers, by name, so a test can run one
const mockCommands = new Map<string, () => void>();

// Jest swaps 'vscode' for the stub in src/fallback/vscode. We add the parts of vscode that VscodeApi needs and
// the stub lacks.
jest.mock('vscode', () => ({
    ...jest.requireActual<object>('vscode'),
    ThemeColor: class { },
    CancellationTokenSource: class {
        listeners: (() => void)[] = [];
        token = { onCancellationRequested: (listener: () => void) => { this.listeners.push(listener); } };
        cancel() { this.listeners.forEach((listener) => listener()); }
        dispose() { }
    },
    StatusBarAlignment: { Left: 1 },
    window: { createStatusBarItem: () => ({ show: () => { }, hide: () => { }, dispose: () => { } }) },
    commands: {
        registerCommand: (name: string, run: () => void) => {
            mockCommands.set(name, run);
            return { dispose: () => { } };
        },
    },
}));

import { VscodeApi } from '../src/api';
import { Offline } from '../src/api/Offline';

const log = { debug: () => { }, info: () => { }, warn: () => { }, error: () => { } };

const none = () => ({ dispose: () => { } });
const yamcsBackend: Partial<Hermes.Api> = {
    onFswChange: none,
    onProvidersChange: none,
    onProfilesChange: none,
    onDictionaryChange: none,
    onFileDownlink: none,
    onFileUplink: none,
    onFileTransfer: none,
    allDictionaries: async () => ({}),
    dispose: () => { },
};

// A provider whose connect resolves to `backend` after 50 ms, or never when no backend is given. It rejects as
// soon as it's cancelled.
function provider(type: string, backend?: Partial<Hermes.Api>): BackendProvider<object> {
    return {
        type, title: type, icon: 'beaker', promptForState: async () => ({}),
        provideBackendApi: (_state, _context, _log, token) => new Promise((resolve, reject) => {
            token?.onCancellationRequested(() => reject('cancelled'));
            if (backend) {
                setTimeout(() => resolve(backend as Hermes.Api), 50);
            }
        }),
    };
}

// What the hermes.host.set command does
const hostSet = (api: VscodeApi, type: string) => api.update(type, {}).catch((err) => api.invalidate(`${err}`));

test('connects to the mode picked last when the earlier connect rejects on cancel', async () => {
    const api = new VscodeApi({} as vscode.ExtensionContext, log);
    api.registerBackendProvider(provider('local'));
    api.registerBackendProvider(provider('yamcs', yamcsBackend));

    const earlier = hostSet(api, 'local');
    await hostSet(api, 'yamcs');
    await earlier;

    expect(api.currentApi).toBe(yamcsBackend);
});

test('connects to the mode picked last when the earlier connect ignores the cancel', async () => {
    const api = new VscodeApi({} as vscode.ExtensionContext, log);
    api.registerBackendProvider(provider('yamcs', yamcsBackend));

    // The built-in Offline mode ignores a cancel
    const earlier = hostSet(api, 'offline');
    await hostSet(api, 'yamcs');
    await earlier;

    expect(api.currentApi).toBe(yamcsBackend);
});

test('falls back to Offline when the user cancels a connect', async () => {
    const api = new VscodeApi({} as vscode.ExtensionContext, log);
    api.registerBackendProvider(provider('local'));

    const connecting = hostSet(api, 'local');
    mockCommands.get('hermes.backend.cancel')?.();
    await connecting;

    expect(api.currentApi).toBeInstanceOf(Offline);
});
