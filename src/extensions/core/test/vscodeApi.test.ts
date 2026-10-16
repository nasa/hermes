import { expect, jest, test } from '@jest/globals';
import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import type * as vscode from 'vscode';

// Jest swaps 'vscode' for the stub in src/fallback/vscode, whose EventEmitter never calls its listeners.
// We mock an EventEmitter that calls them, and add the parts of vscode that VscodeApi needs and the stub lacks.
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

const none = () => ({ dispose: () => { } });
const log = { debug: () => { }, info: () => { }, warn: () => { }, error: () => { } };
// A backend with no dictionaries, which reports no changes
const quiet: Partial<Hermes.Api> = {
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

test('says the connections are gone when it drops a backend, before the next backend reports its own', async () => {
    const fsw: Hermes.Fsw = { id: 'yamcs:fprime-project', type: 'yamcs', profileId: '' };
    // A backend with one connection, which it reports as soon as someone listens and still lists after it's
    // disposed, as YAMCS mode does
    const backend: Partial<Hermes.Api> = {
        ...quiet,
        onFswChange: (listener) => { listener([fsw]); return none(); },
        allFsw: async () => [fsw],
    };

    const api = new VscodeApi({} as vscode.ExtensionContext, log);
    api.registerBackendProvider({ type: 'test', title: 'Test', icon: 'beaker', promptForState: async () => ({}), provideBackendApi: async () => backend as Hermes.Api });
    // We record each list onFswChange reports, with what allFsw returns at that moment
    const reports: { reported: Hermes.Fsw[]; listed: Promise<Hermes.Fsw[]> }[] = [];
    api.onFswChange((reported) => reports.push({ reported, listed: api.allFsw() }));

    await api.update('test', {});
    await api.update('test', {});
    expect(reports.map((report) => report.reported)).toEqual([[fsw], [], [fsw]]);
    for (const { reported, listed } of reports) {
        expect(await listed).toEqual(reported);
    }
});

test('sends the dictionaries of a new backend to listeners that subscribed before it connected', async () => {
    const dictionaries = { 'yamcs:fprime-project': { name: 'fprime-project', type: 'yamcs' } };
    // Like Offline mode, this backend has its dictionaries before anyone listens, and reports only later changes
    const backend: Partial<Hermes.Api> = { ...quiet, allDictionaries: async () => dictionaries };
    const api = new VscodeApi({} as vscode.ExtensionContext, log);
    api.registerBackendProvider({ type: 'test', title: 'Test', icon: 'beaker', promptForState: async () => ({}), provideBackendApi: async () => backend as Hermes.Api });
    const reports: unknown[] = [];
    api.onDictionaryChange((all) => reports.push(all));

    await api.update('test', {});
    // update returns before the backend's allDictionaries resolves, so we wait for it
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(reports).toEqual([dictionaries]);
});
