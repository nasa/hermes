import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { BackendProvider } from '@gov.nasa.jpl.hermes/vscode';
import { Proto, Sourced, Event, Telemetry } from '@gov.nasa.jpl.hermes/types';
import { Offline } from './Offline';

/**
 * VscodeApi wraps the actual API implementation and maintains stable
 * event subscriptions that persist across reconnections. This allows the
 * extension to change backend connections without requiring a window reload
 * or re-subscribing to events.
 */
export class VscodeApi implements Hermes.Api {
    private _onContextRefresh = new vscode.EventEmitter<void>();
    onContextRefresh = this._onContextRefresh.event;

    private providers: Map<string, BackendProvider<any>>;

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

    currentApi?: Hermes.Api;
    currentProvider: BackendProvider<any>;
    currentState: any;

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

        this.primaryItem.hide();
        this.secondaryItem.hide();

        this.providers = new Map();

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
                    this.exited();
                }
            }),
            this.registerBackendProvider({
                type: "offline",
                title: "Offline",
                description: "Sequence authoring with no live interactions",
                detail: "Load dictionaries. Write sequences, procedures, and notebooks",
                icon: "debug-disconnect",
                priority: 0,
                async promptForState() {
                    // Return something that is not null
                    return true;
                },
                async provideBackendApi(_, context, log, token) {
                    return await Offline.activate(context, log, token);
                }
            }),
        ];
        this.currentProvider = this.providers.get("offline")!;
    }

    registerBackendProvider<T>(provider: BackendProvider<T>): vscode.Disposable {
        const old = this.providers.get(provider.type);
        if (old) {
            this.log.warn(`Cannot register backend provider with duplicate type name: ${provider.type}`);
            return { dispose: () => { } };
        }

        this.log.info(`Registering backend provider: ${provider.type}`);
        this.providers.set(provider.type, provider);

        return {
            dispose: () => {
                this.log.info(`Disposing backend provider: ${provider.type}`);
                this.providers.delete(provider.type);
                provider.dispose?.();
            }
        };
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

    async exited() {
        this.cleanup();
        this.currentApi = await Offline.activate(this.context, this.log);

        this.primaryItem.show();
        this.secondaryItem.hide();

        this.primaryItem.color = undefined;
        this.primaryItem.text = `$(${this.currentProvider.icon}) Hermes: ${this.currentProvider.title}`;
        this.primaryItem.backgroundColor = new vscode.ThemeColor("statusBarItem.background");
        this.primaryItem.tooltip = "Change Mode or Restart";
        this.primaryItem.command = "hermes.host.changeMode";

        this.secondaryItem.color = undefined;
        this.secondaryItem.backgroundColor = new vscode.ThemeColor("statusBarItem.background");
        this.secondaryItem.command = undefined;
        this.secondaryItem.tooltip = undefined;

        if (this.currentProvider.exitedStatusBarItem) {
            // This provider holds onto the exited state
            this.currentProvider.exitedStatusBarItem(this.secondaryItem, this.currentState);
        } else {
            // Fallback to offline mode
            await this.update("offline", undefined);
        }

        this._onContextRefresh.fire();
    }

    async invalidate(err: string) {
        this.cleanup();
        this.currentApi = await Offline.activate(this.context, this.log);

        this.primaryItem.show();
        this.secondaryItem.hide();

        this.primaryItem.color = undefined;
        this.primaryItem.text = `$(${this.currentProvider.icon}) Hermes: ${this.currentProvider.title}`;
        this.primaryItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        this.primaryItem.command = "hermes.host.changeMode";

        this.secondaryItem.color = undefined;
        this.secondaryItem.backgroundColor = new vscode.ThemeColor("statusBarItem.errorBackground");
        this.secondaryItem.command = undefined;
        this.secondaryItem.tooltip = err;

        this.currentProvider.invalidStatusBarItem?.(this.secondaryItem, this.currentState);

        this._onContextRefresh.fire();
    }

    async update<T>(newType: string, newState: T | null): Promise<void> {
        const provider = this.providers.get(newType);
        if (!provider) {
            this.log.warn(`Cannot switch to unregistered API: ${newType}`);
            return;
        }

        if (newState === null || newState === undefined) {
            newState = await provider.promptForState(this.context, this.log);
            if (newState === null) {
                return;
            }
        }

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

        this.log.info(`Activating API from provider: ${newType}`);
        this.currentProvider = provider;
        this.currentState = newState;

        this.primaryItem.text = "$(sync~spin) Hermes: Connecting...";

        this.currentApi = await provider.provideBackendApi(
            newState,
            this.context,
            this.log,
            this.cancelActivate.token
        );

        this.primaryItem.color = undefined;
        this.primaryItem.text = `$(${provider.icon}) Hermes: ${provider.title}`;

        provider.activeStatusBarItem?.(this.secondaryItem, this.currentState);

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

    async pickBackendModeDialog(): Promise<void> {
        const providersSorted = Array.from(this.providers.values()).sort(
            (a, b) => (a.priority ?? 100) - (b.priority ?? 100)
        );

        const pick = await vscode.window.showQuickPick<vscode.QuickPickItem & {
            type?: string;
            reconnect?: true;
        }>([
            ...providersSorted.map((provider) => ({
                iconPath: new vscode.ThemeIcon(provider.icon),
                label: ((provider.type === this.currentProvider.type) ? "$(check) " : "") + provider.title,
                description: provider.description,
                detail: provider.detail,
                type: provider.type,
            })),
            {
                label: "",
                kind: vscode.QuickPickItemKind.Separator,
            },
            {
                iconPath: new vscode.ThemeIcon("sync"),
                label: "Reconnect",
                description: "Reconnect/Rerun the current backend",
                reconnect: true,
            }
        ], {
            title: 'Hermes Backend Mode',
        });

        if (pick) {
            if (pick.reconnect) {
                vscode.commands.executeCommand("hermes.host.reconnect");
            } else if (pick.type !== undefined) {
                vscode.commands.executeCommand("hermes.host.set", pick.type);
            }
        }
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

        this.cleanup();

        this.eventSubscribers.clear();
        this.telemetrySubscribers.clear();
        this.eventSubscriptions.clear();
        this.telemetrySubscriptions.clear();

        for (const disposable of this.disposables) {
            disposable.dispose();
        }
    }
}
