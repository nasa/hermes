import * as vscode from 'vscode';
import * as path from 'path';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import {
    CoreApi,
    DictionaryLanguageItem,
    DictionaryProvider,
    NotebookLanguageProvider,
} from '@gov.nasa.jpl.hermes/vscode';

import {
    HermesNotebookSerializer,
    NotebookController,
    NotebookLanguageManager
} from './notebook';
import { ConnectionViewer } from './components/ConnectionViewer';
import { EventPanel, EventViewer } from './components/EventViewer';
import { eventMessaging } from './notebook/evrMessaging';

import { ShellScriptLanguageProvider } from './kernels/shellscript';
import { PythonLanguageProvider } from './kernels/python';
import { UplinkLanguageProvider } from './kernels/uplink';
import { DownlinkProvider } from './components/DownlinkViewer';
import { UplinkProvider } from './components/UplinkViewer';

export class VscodeHermes implements CoreApi {
    private subscriptions: vscode.Disposable[] = [];
    private eventPanel?: EventPanel;
    private connectionViewer?: ConnectionViewer;
    private downlinkProvider?: DownlinkProvider;
    private uplinkProvider?: UplinkProvider;

    private notebookLanguages: NotebookLanguageManager;
    private dictionaryStatus: Map<string, DictionaryLanguageItem>;

    dictionaryProviders = new Map<string, DictionaryProvider>();
    private autoDictionariesByProvider = new Map<string, Set<string>>();
    private dictionaryProvidersChanged = new vscode.EventEmitter<void>();

    onDictionaryProvidersChanged = this.dictionaryProvidersChanged.event;

    private shellScriptPaths = new Set<string>();

    constructor(
        readonly extensionPath: string,
        readonly log: Hermes.Log,
        readonly api: Hermes.Api,
        readonly extensionContext: vscode.ExtensionContext
    ) {
        this.log.info(`Initializing VscodeHermes with extensionPath: ${extensionPath}`);
        this.notebookLanguages = new NotebookLanguageManager();
        this.dictionaryStatus = new Map();
    }

    async activate(): Promise<void> {
        this.log.info('Starting VscodeHermes activation');

        // Viewers
        this.connectionViewer = new ConnectionViewer(this.extensionPath, this.api, this);
        this.downlinkProvider = new DownlinkProvider(this.api);
        this.uplinkProvider = new UplinkProvider(this.api);
        this.eventPanel = new EventPanel(this.api, this.extensionPath);

        this.subscriptions.push(
            this.registerShellscriptBinPath(path.join(this.extensionPath, 'out', 'bin')),

            vscode.commands.registerCommand('hermes.applyWorkspaceEdit', vscode.workspace.applyEdit),

            // Hermes Notebook support
            ...NotebookController.registerCommands(),
            vscode.workspace.registerNotebookSerializer('hermes.notebook', new HermesNotebookSerializer()),
            vscode.window.registerCustomEditorProvider('hermes.evr', new EventViewer(this.extensionPath, 'hermes.evr'), {
                webviewOptions: {
                    // Don't unload the webview when we switch off of it
                    // It can be annoying to find the spot in the playback again
                    retainContextWhenHidden: true
                },
            }),

            this.eventPanel,
            this.connectionViewer,

            this.registerNotebookType("hermes.notebook"),
            this.registerNotebookType("jupyter-notebook"),

            this.registerNotebookLanguageProvider('python', new PythonLanguageProvider(this)),
            this.registerNotebookLanguageProvider('shellscript', new ShellScriptLanguageProvider(this)),
            this.registerNotebookLanguageProvider('uplink', new UplinkLanguageProvider(this.api)),

            eventMessaging(),
        );

        // Only load the workspace config in host mode
        this.refresh();
    }

    refresh(): void {
        this.log.info('Refreshing VscodeHermes components');
        // this.evrPanel?.refresh();
        if (this.connectionViewer) {
            this.log.info('Refreshing connection viewer');
            this.connectionViewer.refresh();
        }
        if (this.downlinkProvider) {
            this.log.info('Refreshing downlink provider');
            this.downlinkProvider.refresh();
        }
        if (this.uplinkProvider) {
            this.log.info('Refreshing uplink provider');
            this.uplinkProvider.refresh();
        }

        // Reload external dictionaries from all providers
        if (this.dictionaryProviders.size > 0) {
            this.log.info(`Reloading external dictionaries from ${this.dictionaryProviders.size} provider(s)`);
            for (const [providerId, provider] of this.dictionaryProviders.entries()) {
                if (provider.provideExternalDictionaries) {
                    this.log.info(`Reloading external dictionaries for provider: ${providerId}`);
                    this.loadExternalDictionaries(providerId, provider);
                }
            }
        }

        this.log.info('Refresh complete');
    }

    registerDictionaryProvider(
        id: string,
        dictionaryProvider: DictionaryProvider,
    ): vscode.Disposable {
        if (this.dictionaryProviders.has(id)) {
            this.log.error(`Dictionary provider '${id}' already registered`);
            throw new Error(`Dictionary provider named '${id}' already registered`);
        }

        this.log.info(`Registering dictionary provider ${id}`);
        this.dictionaryProviders.set(id, dictionaryProvider);
        this.dictionaryProvidersChanged.fire();
        this.log.info(`Dictionary providers changed event fired, total providers: ${this.dictionaryProviders.size}`);

        const subscriptions: vscode.Disposable[] = [];

        // Set up auto-discovery if provider supports it
        if (dictionaryProvider.provideExternalDictionaries) {
            this.log.info(`Provider ${id} supports external dictionaries auto-discovery`);
            // Subscribe to provider's update event if available
            if (dictionaryProvider.onExternalDictionariesUpdated) {
                this.log.info(`Subscribing to external dictionaries update event for provider ${id}`);
                subscriptions.push(
                    dictionaryProvider.onExternalDictionariesUpdated(() => {
                        this.log.info(`External dictionaries updated for provider ${id}`);
                        this.loadExternalDictionaries(id, dictionaryProvider);
                    })
                );
            }

            // Initial load of external dictionaries
            this.log.info(`Starting initial load of external dictionaries for provider ${id}`);
            this.loadExternalDictionaries(id, dictionaryProvider);
        } else {
            this.log.info(`Provider ${id} does not support external dictionaries auto-discovery`);
        }

        this.log.info(`Dictionary provider ${id} registered successfully`);

        return {
            dispose: () => {
                this.log.info(`Unregistering dictionary provider ${id}`);

                // Remove all auto-discovered dictionaries from this provider
                const autoDictIds = this.autoDictionariesByProvider.get(id);
                if (autoDictIds && autoDictIds.size > 0) {
                    this.log.info(`Removing ${autoDictIds.size} auto-discovered dictionaries from provider ${id}`);
                    for (const dictId of autoDictIds) {
                        this.log.info(`Removing auto-discovered dictionary: ${dictId}`);
                        this.api.removeDictionary(dictId).catch(err => {
                            this.log.error(`Failed to remove auto-discovered dictionary ${dictId}: ${err}`);
                        });
                    }
                    this.autoDictionariesByProvider.delete(id);
                }

                this.dictionaryProviders.delete(id);
                this.dictionaryProvidersChanged.fire();
                this.log.info(`Dictionary provider ${id} unregistered, remaining providers: ${this.dictionaryProviders.size}`);

                // Dispose subscriptions
                if (subscriptions.length > 0) {
                    this.log.info(`Disposing ${subscriptions.length} subscriptions for provider ${id}`);
                    for (const sub of subscriptions) {
                        sub.dispose();
                    }
                }
            }
        };
    }

    /**
     * Load external dictionaries from a provider
     * Removes old dictionaries and loads new ones
     */
    private async loadExternalDictionaries(
        providerId: string,
        provider: DictionaryProvider
    ): Promise<void> {
        this.log.info(`Loading external dictionaries for provider: ${providerId}`);

        if (!provider.provideExternalDictionaries) {
            this.log.warn(`Provider ${providerId} does not have provideExternalDictionaries method`);
            return;
        }

        try {
            // Remove old auto-discovered dictionaries from this provider
            const oldDictIds = this.autoDictionariesByProvider.get(providerId);
            if (oldDictIds && oldDictIds.size > 0) {
                this.log.info(`Removing ${oldDictIds.size} old auto-discovered dictionaries from provider ${providerId}`);
                for (const dictId of oldDictIds) {
                    try {
                        await this.api.removeDictionary(dictId);
                        this.log.info(`Removed old auto-discovered dictionary: ${dictId}`);
                    } catch (err) {
                        this.log.warn(`Failed to remove old dictionary ${dictId}: ${err}`);
                    }
                }
            } else {
                this.log.info(`No old dictionaries to remove for provider ${providerId}`);
            }

            // Load new dictionaries
            this.log.info(`Calling provideExternalDictionaries for provider ${providerId}`);
            const dictionaries = await provider.provideExternalDictionaries();
            const newDictIds = new Set<string>();

            if (!dictionaries) {
                // Provider returned null/undefined, clear tracking
                this.log.info(`Provider ${providerId} returned no dictionaries`);
                this.autoDictionariesByProvider.set(providerId, newDictIds);
                return;
            }

            this.log.info(`Provider ${providerId} returned ${dictionaries.length} dictionaries`);

            for (const dict of dictionaries) {
                // Require that auto-discovered dictionaries provide an ID
                if (!dict.id) {
                    this.log.error(
                        `Auto-discovered dictionary from provider ${providerId} missing required 'id' field. ` +
                        `Dictionary name: ${dict.name}. Skipping.`
                    );
                    continue;
                }

                try {
                    this.log.info(`Adding dictionary ${dict.id} from provider ${providerId}`);
                    await this.api.addDictionary(dict.toProto());
                    newDictIds.add(dict.id);
                } catch (err) {
                    this.log.error(`Failed to load auto-discovered dictionary ${dict.id}: ${err}`);
                }
            }

            // Update tracking
            this.autoDictionariesByProvider.set(providerId, newDictIds);
            this.log.info(`Loaded ${newDictIds.size} dictionaries from provider ${providerId}`);
        } catch (err) {
            this.log.error(`Failed to load external dictionaries from provider ${providerId}: ${err}`);
        }
    }

    registerLanguageDictionaryItem(
        item: DictionaryLanguageItem
    ): vscode.Disposable {
        this.log.info(`Registering language dictionary item: ${item.id}`);
        this.dictionaryStatus.set(item.id, item);
        return {
            dispose: () => {
                this.log.info(`Unregistering language dictionary item: ${item.id}`);
                this.dictionaryStatus.delete(item.id);
            }
        };
    }

    getLanguageDictionaryItem(id: string): DictionaryLanguageItem | undefined {
        return this.dictionaryStatus.get(id);
    }

    registerNotebookLanguageProvider(
        langaugeId: string | string[],
        languageProvider: NotebookLanguageProvider,
    ): vscode.Disposable {
        if (Array.isArray(langaugeId)) {
            this.log.info(`Registering notebook language provider for multiple languages: ${langaugeId.join(', ')}`);
            const allDisp: vscode.Disposable[] = [];
            for (const id of langaugeId) {
                this.log.info(`Registering notebook language provider for: ${id}`);
                allDisp.push(
                    this.notebookLanguages.register(id, languageProvider)
                );
            }
            this.log.info(`Successfully registered notebook language provider for ${langaugeId.length} languages`);
            return vscode.Disposable.from(...allDisp);
        } else {
            this.log.info(`Registering notebook language provider for: ${langaugeId}`);
            const disposable = this.notebookLanguages.register(langaugeId, languageProvider);
            this.log.info(`Successfully registered notebook language provider for ${langaugeId}`);
            return disposable;
        }
    }

    registerShellscriptBinPath(path: string): vscode.Disposable {
        this.log.info(`Registering shellscript bin path: ${path}`);
        this.shellScriptPaths.add(path);
        this.log.info(`Total shellscript bin paths: ${this.shellScriptPaths.size}`);

        return {
            dispose: () => {
                this.log.info(`Unregistering shellscript bin path: ${path}`);
                this.shellScriptPaths.delete(path);
            }
        };
    }

    registerNotebookType(notebookType: string): vscode.Disposable {
        this.log.info(`Registering notebook type: ${notebookType}`);
        const kernel = new NotebookController(notebookType, this.notebookLanguages);
        this.log.info(`Created NotebookController for ${notebookType}`);
        const disp = vscode.notebooks.registerNotebookCellStatusBarItemProvider(notebookType, this.notebookLanguages);
        this.log.info(`Registered notebook cell status bar item provider for ${notebookType}`);
        return {
            dispose: () => {
                this.log.info(`Disposing notebook type: ${notebookType}`);
                disp.dispose();
                kernel.dispose();
                this.log.info(`Disposed notebook type: ${notebookType}`);
            }
        };
    }

    getShellscriptPaths(): string[] {
        const paths = Array.from(this.shellScriptPaths.values());
        this.log.info(`Getting shellscript paths, returning ${paths.length} paths`);
        return paths;
    }

    dispose() {
        for (const sub of this.subscriptions) {
            sub.dispose();
        }

        this.subscriptions = [];
        this.log.info('VscodeHermes disposed successfully');
    }
}
