import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';
import { Proto, Sourced, Event, Telemetry } from '@gov.nasa.jpl.hermes/types';
import { Offline } from './Offline';
import { Local } from './Local';
import { Remote } from './Remote';

/**
 * Controls what backend to use
 */
export enum BackendType {
    /**
     * Offline only allows loading dictionaries and writing notebooks/sequences
     * You cannot connect to anything and send command/receive telemetry
     */
    OFFLINE = 'offline',

    /**
     * Connect to a Hermes backend that is managed by this VSCode extension to allow
     * configuring/running profiles Telemetry can be subscribed to show up in the
     * frontend.
     */
    LOCAL = 'local',

    /**
     * Connect to a Hermes backend to allow configuring/running profiles
     * Telemetry can be subscribed to show up in the frontend
     */
    REMOTE = 'remote',
}

export interface OfflineState {
    type: BackendType.OFFLINE;
}

export interface LocalState {
    type: BackendType.LOCAL;
}

export interface RemoteState {
    type: BackendType.REMOTE;
    remote: Settings.Remote;
}

export type State = (
    | OfflineState
    | LocalState
    | RemoteState
);

/**
 * VscodeApi wraps the actual API implementation and maintains stable
 * event subscriptions that persist across reconnections. This allows the
 * extension to change backend connections without requiring a window reload
 * or re-subscribing to events.
 */
export class VscodeApi implements Hermes.Api {
    private _onContextRefresh = new vscode.EventEmitter<void>();
    onContextRefresh = this._onContextRefresh.event;

    private currentApi?: Hermes.Api;

    private _onFswChange = new vscode.EventEmitter<Hermes.Fsw[]>();
    private _onProvidersChange = new vscode.EventEmitter<Proto.IProfileProvider[]>();
    private _onProfilesChange = new vscode.EventEmitter<Record<string, Proto.IStatefulProfile>>();
    private _onDictionaryChange = new vscode.EventEmitter<Record<string, Proto.IDictionaryHead>>();
    private _onDownlink = new vscode.EventEmitter<Proto.IFileDownlink>();
    private _onUplink = new vscode.EventEmitter<Proto.IFileUplink>();
    private _onFileTransfer = new vscode.EventEmitter<Proto.IFileTransferState>();

    private eventSubscribers = new Map<(pkt: Sourced<Event>) => void, Proto.IBusFilter | undefined>();
    private telemetrySubscribers = new Map<(pkt: Sourced<Telemetry>) => void, Proto.IBusFilter | undefined>();

    private apiSubscriptions: vscode.Disposable[] = [];
    private eventSubscriptions = new Map<(pkt: Sourced<Event>) => void, vscode.Disposable>();
    private telemetrySubscriptions = new Map<(pkt: Sourced<Telemetry>) => void, vscode.Disposable>();

    onFswChange = this._onFswChange.event;
    onProvidersChange = this._onProvidersChange.event;
    onProfilesChange = this._onProfilesChange.event;
    onDictionaryChange = this._onDictionaryChange.event;
    onFileDownlink = this._onDownlink.event;
    onFileUplink = this._onUplink.event;
    onFileTransfer = this._onFileTransfer.event;

    private cancelActivate?: vscode.CancellationTokenSource;

    private primaryItem: vscode.StatusBarItem;
    private secondaryItem: vscode.StatusBarItem;

    private readonly disposables: vscode.Disposable[];

    state: State;

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly log: Hermes.Log
    ) {
        this.primaryItem = vscode.window.createStatusBarItem(
            'hermes.primaryStatus', vscode.StatusBarAlignment.Left, 1000
        );
        this.secondaryItem = vscode.window.createStatusBarItem(
            'hermes.secondaryStatus', vscode.StatusBarAlignment.Left, 999
        );

        this.state = { type: BackendType.OFFLINE };

        this.primaryItem.hide();
        this.secondaryItem.hide();

        this.disposables = [
            this.primaryItem,
            this.secondaryItem,
            vscode.commands.registerCommand("hermes.backend.cancel", () => {
                this.cancelActivate?.cancel();
            }),
            vscode.commands.registerCommand("hermes.backend.exit", (err?: string) => {
                this.cancelActivate?.cancel();
                if (err) {
                    this.invalidate(err);
                } else {
                    this.update({ type: BackendType.OFFLINE });
                }
            }),
        ];
    }

    private cleanup() {
        this.cancelActivate?.cancel();
        this.cancelActivate?.dispose();

        // Clean up old subscriptions
        this.apiSubscriptions.forEach(d => d.dispose());
        this.apiSubscriptions = [];

        if (this.currentApi) {
            this.log.info('Disposing old API connection');
            this.currentApi.dispose();
        }

        this.currentApi = undefined;
    }

    invalidate(err: string) {
        this.cleanup();
        this.currentApi = new Offline(this.context, this.log);

        this.primaryItem.show();
        this.secondaryItem.show();

        this.primaryItem.color = undefined;
        this.primaryItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        this.primaryItem.command = "hermes.host.changeMode";

        this.secondaryItem.color = undefined;
        this.secondaryItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        this.secondaryItem.command = undefined;
        this.secondaryItem.tooltip = err;

        switch (this.state.type) {
            case BackendType.OFFLINE:
                this.primaryItem.text = "$(alert) Hermes: Offline";
                this.primaryItem.tooltip = "Retry";
                this.secondaryItem.text = "Initialization Failed";
                break;
            case BackendType.LOCAL:
                this.primaryItem.text = "$(alert) Hermes: Local";
                this.primaryItem.tooltip = "Restart";
                this.secondaryItem.text = "Execution Failed";
                this.secondaryItem.command = "hermes.terminal.focusBackend";
                this.secondaryItem.tooltip = "Show logs";
                break;
            case BackendType.REMOTE:
                this.primaryItem.text = "$(alert) Hermes: Remote";
                this.primaryItem.tooltip = "Reconnect";
                this.secondaryItem.text = `$(radio-tower) ${this.state.remote.label}`;
                this.secondaryItem.command = "hermes.host.changeRemote";
                this.secondaryItem.tooltip = "Change host URL";
                break;
        }

        this._onContextRefresh.fire();
    }

    async update(newState: State): Promise<void> {
        this.cleanup();
        this.cancelActivate = new vscode.CancellationTokenSource();

        this.primaryItem.show();
        this.secondaryItem.hide();

        this.primaryItem.color = new vscode.ThemeColor("statusBarItem.remoteForeground");
        this.primaryItem.backgroundColor = undefined;
        this.primaryItem.command = "hermes.backend.cancel";
        this.primaryItem.tooltip = "Cancel";

        this.secondaryItem.color = undefined;
        this.secondaryItem.backgroundColor = undefined;
        this.secondaryItem.command = undefined;
        this.secondaryItem.tooltip = undefined;

        this.state = newState;

        switch (this.state.type) {
            case BackendType.OFFLINE:
                this.currentApi = new Offline(this.context, this.log);

                this.primaryItem.color = new vscode.ThemeColor("statusBarItem.remoteForeground");
                this.primaryItem.text = "$(sync~spin) Hermes: Initializing...";
                this.currentApi = await Offline.activate(this.context, this.log, this.cancelActivate.token);
                this.primaryItem.color = undefined;
                this.primaryItem.text = "$(debug-disconnect) Hermes: Offline";
                this.secondaryItem.command = undefined;

                break;
            case BackendType.LOCAL:
                this.primaryItem.color = new vscode.ThemeColor("statusBarItem.remoteForeground");
                this.primaryItem.text = "$(sync~spin) Hermes: Starting...";
                this.currentApi = await Local.activate(this.context, this.log, this.cancelActivate.token);
                this.primaryItem.color = undefined;
                this.primaryItem.text = "$(terminal) Hermes: Local";

                this.secondaryItem.show();
                this.secondaryItem.text = "$(terminal)";
                this.secondaryItem.tooltip = "Show Hermes Backend Logs";
                this.secondaryItem.command = "hermes.terminal.focusBackend";
                break;
            case BackendType.REMOTE:
                this.primaryItem.color = new vscode.ThemeColor("statusBarItem.remoteForeground");
                this.primaryItem.text = "$(sync~spin) Hermes: Connecting...";
                this.currentApi = await Remote.activate(this.state.remote, this.log, this.cancelActivate.token);
                this.primaryItem.text = "$(radio-tower) Hermes: Remote";

                this.secondaryItem.show();
                this.secondaryItem.color = this.state.remote.color;
                this.secondaryItem.text = `$(radio-tower) ${this.state.remote.label}`;
                this.secondaryItem.tooltip = "Change remote host";
                this.secondaryItem.command = "hermes.host.changeRemote";
                break;
        }

        this.primaryItem.tooltip = "Change Mode or Restart";
        this.primaryItem.command = "hermes.host.changeMode";

        this.cancelActivate.dispose();
        this.cancelActivate = undefined;

        // Set new API
        this.log.info('Wiring up new API connection');

        // Wire up event forwarding for simple events
        this.apiSubscriptions.push(
            this.currentApi.onFswChange(data => this._onFswChange.fire(data)),
            this.currentApi.onProvidersChange(data => this._onProvidersChange.fire(data)),
            this.currentApi.onProfilesChange(data => this._onProfilesChange.fire(data)),
            this.currentApi.onDictionaryChange(data => this._onDictionaryChange.fire(data)),
            this.currentApi.onFileDownlink(data => this._onDownlink.fire(data)),
            this.currentApi.onFileUplink(data => this._onUplink.fire(data)),
            this.currentApi.onFileTransfer(data => this._onFileTransfer.fire(data)),
        );

        // Resubscribe all tracked event handlers
        for (const [handler, filter] of this.eventSubscribers.entries()) {
            const subscription = this.currentApi.onEvent(handler, filter);
            this.eventSubscriptions.set(handler, subscription);
            this.apiSubscriptions.push(subscription);
        }

        // Resubscribe all tracked telemetry handlers
        for (const [handler, filter] of this.telemetrySubscribers.entries()) {
            const subscription = this.currentApi.onTelemetry(handler, filter);
            this.telemetrySubscriptions.set(handler, subscription);
            this.apiSubscriptions.push(subscription);
        }

        this._onContextRefresh.fire();
    }

    // Method-based subscription handlers that track subscribers
    onEvent(handler: (pkt: Sourced<Event>) => void, filter?: Proto.IBusFilter): vscode.Disposable {
        this.eventSubscribers.set(handler, filter);

        const subscription = this.currentApi?.onEvent(handler, filter);
        if (subscription) {
            this.eventSubscriptions.set(handler, subscription);
        }

        return {
            dispose: () => {
                this.eventSubscribers.delete(handler);
                const sub = this.eventSubscriptions.get(handler);
                if (sub) {
                    sub.dispose();
                    this.eventSubscriptions.delete(handler);
                }
            }
        };
    }

    onTelemetry(handler: (pkt: Sourced<Telemetry>) => void, filter?: Proto.IBusFilter): vscode.Disposable {
        this.telemetrySubscribers.set(handler, filter);

        const subscription = this.currentApi?.onTelemetry(handler, filter);
        if (subscription) {
            this.telemetrySubscriptions.set(handler, subscription);
        }

        return {
            dispose: () => {
                this.telemetrySubscribers.delete(handler);
                const sub = this.telemetrySubscriptions.get(handler);
                if (sub) {
                    sub.dispose();
                    this.telemetrySubscriptions.delete(handler);
                }
            }
        };
    }

    // Delegate all other API methods to the current implementation
    getFsw(id: string, token?: vscode.CancellationToken): Promise<Hermes.Fsw> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.getFsw(id, token);
    }

    allFsw(token?: vscode.CancellationToken): Promise<Hermes.Fsw[]> {
        if (!this.currentApi) {
            return Promise.resolve([]);
        }
        return this.currentApi.allFsw(token);
    }

    startProfile(id: string, token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.startProfile(id, token);
    }

    stopProfile(id: string, token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.stopProfile(id, token);
    }

    updateProfile(id: string, settings: string, token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.updateProfile(id, settings, token);
    }

    addProfile(profile: Hermes.Profile, token?: vscode.CancellationToken): Promise<string> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.addProfile(profile, token);
    }

    removeProfile(id: string, token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.removeProfile(id, token);
    }

    allProfiles(token?: vscode.CancellationToken): Promise<Record<string, Proto.IStatefulProfile>> {
        if (!this.currentApi) {
            return Promise.resolve({});
        }
        return this.currentApi.allProfiles(token);
    }

    allProviders(token?: vscode.CancellationToken): Promise<Proto.IProfileProvider[]> {
        if (!this.currentApi) {
            return Promise.resolve([]);
        }
        return this.currentApi.allProviders(token);
    }

    getDictionary(id: string, sections?: readonly string[], token?: vscode.CancellationToken): Promise<Proto.IDictionary> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.getDictionary(id, sections, token);
    }

    addDictionary(dict: Proto.IDictionary, token?: vscode.CancellationToken): Promise<string> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.addDictionary(dict, token);
    }

    allDictionaries(token?: vscode.CancellationToken): Promise<Record<string, Proto.IDictionaryHead>> {
        if (!this.currentApi) {
            return Promise.resolve({});
        }
        return this.currentApi.allDictionaries(token);
    }

    removeDictionary(id: string, token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.reject(new Error('No API available'));
        }
        return this.currentApi.removeDictionary(id, token);
    }

    getFileTransferState(token?: vscode.CancellationToken): Promise<Proto.IFileTransferState> {
        if (!this.currentApi) {
            return Promise.resolve({});
        }
        return this.currentApi.getFileTransferState(token);
    }

    clearDownlinkTransferState(token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.resolve();
        }
        return this.currentApi.clearDownlinkTransferState(token);
    }

    clearUplinkTransferState(token?: vscode.CancellationToken): Promise<void> {
        if (!this.currentApi) {
            return Promise.resolve();
        }
        return this.currentApi.clearUplinkTransferState(token);
    }

    dispose(): void {
        this.primaryItem.dispose();
        this.secondaryItem.dispose();

        this.log.info('Disposing VscodeApi');

        this.apiSubscriptions.forEach(d => d.dispose());
        this.apiSubscriptions = [];

        this._onFswChange.dispose();
        this._onProvidersChange.dispose();
        this._onProfilesChange.dispose();
        this._onDictionaryChange.dispose();
        this._onDownlink.dispose();
        this._onUplink.dispose();
        this._onFileTransfer.dispose();

        this.currentApi?.dispose();
        this.currentApi = undefined;

        this.eventSubscribers.clear();
        this.telemetrySubscribers.clear();
        this.eventSubscriptions.clear();
        this.telemetrySubscriptions.clear();

        for (const disposable of this.disposables) {
            disposable.dispose();
        }
    }
}
