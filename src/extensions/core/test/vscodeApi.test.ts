import { expect, jest, test } from '@jest/globals';
import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import type * as vscode from 'vscode';

// Jest swaps 'vscode' for the stub in src/fallback/vscode, whose EventEmitter never calls its listeners and
// which has no status bar items, theme colors, cancellation tokens or commands. VscodeApi uses all of them,
// so we mock them.
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
        ThemeColor: class { },
        CancellationTokenSource: class {
            token = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => { } }) };
            cancel() { }
            dispose() { }
        },
        StatusBarAlignment: { Left: 1 },
        window: { createStatusBarItem: () => ({ show: () => { }, hide: () => { }, dispose: () => { } }) },
        commands: { registerCommand: () => ({ dispose: () => { } }) },
    };
});

import { VscodeApi } from '../src/api';

test('says the connections are gone when it drops a backend, before the next backend reports its own', async () => {
    const none = () => ({ dispose: () => { } });
    const fsw: Hermes.Fsw = { id: 'yamcs:fprime-project', type: 'yamcs', profileId: '' };
    // A backend with one connection, which it reports as soon as someone listens and still lists after it's
    // disposed, as YAMCS mode does
    const backend = {
        onFswChange: (listener: (fsws: Hermes.Fsw[]) => void) => { listener([fsw]); return none(); },
        allFsw: async () => [fsw],
        onProvidersChange: none,
        onProfilesChange: none,
        onDictionaryChange: none,
        onFileDownlink: none,
        onFileUplink: none,
        onFileTransfer: none,
        dispose: () => { },
    } as unknown as Hermes.Api;
    const log = { debug: () => { }, info: () => { }, warn: () => { }, error: () => { } };

    const api = new VscodeApi({} as vscode.ExtensionContext, log);
    api.registerBackendProvider({ type: 'test', title: 'Test', icon: 'beaker', promptForState: async () => ({}), provideBackendApi: async () => backend });
    // Like the connections panel, the listener lists the connections as soon as it hears a change
    const lists: Hermes.Fsw[][] = [];
    const listed: Promise<Hermes.Fsw[]>[] = [];
    api.onFswChange((fsws) => {
        lists.push(fsws);
        listed.push(api.allFsw());
    });

    await api.update('test', {});
    await api.update('test', {});
    expect(lists).toEqual([[fsw], [], [fsw]]);
    expect(await Promise.all(listed)).toEqual(lists);
});
