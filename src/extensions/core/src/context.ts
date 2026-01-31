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
import { EvrPanel, EvrViewer } from './components/EvrViewer';
import { evrMessaging } from './notebook/evrMessaging';

import { ShellScriptLanguageProvider } from './kernels/shellscript';
import { PythonLanguageProvider } from './kernels/python';
import { UplinkLanguageProvider } from './kernels/uplink';
import { DownlinkViewer } from './components/DownlinkViewer';
import { UplinkViewer } from './components/UplinkViewer';

export class VscodeHermes implements CoreApi {
    private subscriptions: vscode.Disposable[] = [];
    private evrPanel?: EvrPanel;
    private connectionViewer?: ConnectionViewer;
    private downlinkViewer?: DownlinkViewer;
    private uplinkViewer?: UplinkViewer;

    private notebookLanguages: NotebookLanguageManager;
    private dictionaryStatus: Map<string, DictionaryLanguageItem>;

    dictionaryProviders = new Map<string, DictionaryProvider>();
    private dictionaryProvidersChanged = new vscode.EventEmitter<void>();

    onDictionaryProvidersChanged = this.dictionaryProvidersChanged.event;

    private shellScriptPaths = new Set<string>();

    constructor(
        readonly extensionPath: string,
        readonly log: Hermes.Log,
        readonly api: Hermes.Api,
        readonly extensionContext: vscode.ExtensionContext
    ) {
        this.notebookLanguages = new NotebookLanguageManager();
        this.dictionaryStatus = new Map();
    }

    async activate(): Promise<void> {
        // Viewers
        this.connectionViewer = new ConnectionViewer(this.extensionPath, this.api, this);
        this.downlinkViewer = new DownlinkViewer(this.extensionPath, this.api);
        this.uplinkViewer = new UplinkViewer(this.extensionPath, this.api);
        this.evrPanel = new EvrPanel(this.api, this.extensionPath);

        this.subscriptions.push(
            this.registerShellscriptBinPath(path.join(this.extensionPath, 'out', 'bin')),

            vscode.commands.registerCommand('hermes.applyWorkspaceEdit', vscode.workspace.applyEdit),
            vscode.commands.registerCommand('hermes.downlink.clear', () => {
                this.api.clearDownlinkTransferState();
            }),
            vscode.commands.registerCommand('hermes.uplink.clear', () => {
                this.api.clearUplinkTransferState();
            }),

            // Hermes Notebook support
            ...NotebookController.registerCommands(),
            vscode.workspace.registerNotebookSerializer('hermes.notebook', new HermesNotebookSerializer()),
            vscode.window.registerCustomEditorProvider('hermes.evr', new EvrViewer(this.extensionPath, 'hermes.evr'), {
                webviewOptions: {
                    // Don't unload the webview when we switch off of it
                    // It can be annoying to find the spot in the playback again
                    retainContextWhenHidden: true
                },
            }),

            this.evrPanel,
            this.connectionViewer,
            this.downlinkViewer,
            this.uplinkViewer,

            this.registerNotebookType("hermes.notebook"),
            this.registerNotebookType("jupyter-notebook"),

            this.registerNotebookLanguageProvider('python', new PythonLanguageProvider(this)),
            this.registerNotebookLanguageProvider('shellscript', new ShellScriptLanguageProvider(this)),
            this.registerNotebookLanguageProvider('uplink', new UplinkLanguageProvider(this.api)),

            evrMessaging(),
        );

        // Only load the workspace config in host mode
        this.refresh();
    }

    refresh(): void {
        // this.evrPanel?.refresh();
        this.connectionViewer?.refresh();
        this.downlinkViewer?.refresh();
        this.uplinkViewer?.refresh();
    }

    registerDictionaryProvider(
        name: string,
        dictionaryProvider: DictionaryProvider,
    ): vscode.Disposable {
        if (this.dictionaryProviders.has(name)) {
            throw new Error(`Dictionary provider named '${name}' already registered`);
        }

        this.log.info(`Registering dictionary provider ${name}`);
        this.dictionaryProviders.set(name, dictionaryProvider);
        this.dictionaryProvidersChanged.fire();
        return {
            dispose: () => {
                this.log.info(`Unregistering dictionary provider ${name}`);
                this.dictionaryProviders.delete(name);
                this.dictionaryProvidersChanged.fire();
            }
        };
    }

    registerLanguageDictionaryItem(
        item: DictionaryLanguageItem
    ): vscode.Disposable {
        this.dictionaryStatus.set(item.id, item);
        return {
            dispose: () => {
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
            const allDisp: vscode.Disposable[] = [];
            for (const id of langaugeId) {
                allDisp.push(
                    this.notebookLanguages.register(id, languageProvider)
                );
            }

            return vscode.Disposable.from(...allDisp);
        } else {
            return this.notebookLanguages.register(langaugeId, languageProvider);
        }
    }

    registerShellscriptBinPath(path: string): vscode.Disposable {
        this.shellScriptPaths.add(path);

        return {
            dispose: () => {
                this.shellScriptPaths.delete(path);
            }
        };
    }

    registerNotebookType(notebookType: string): vscode.Disposable {
        const kernel = new NotebookController(notebookType, this.notebookLanguages);
        const disp = vscode.notebooks.registerNotebookCellStatusBarItemProvider(notebookType, this.notebookLanguages);
        return {
            dispose: () => {
                disp.dispose();
                kernel.dispose();
            }
        };
    }

    getShellscriptPaths(): string[] {
        return Array.from(this.shellScriptPaths.values());
    }

    dispose() {
        for (const sub of this.subscriptions) {
            sub.dispose();
        }

        this.subscriptions = [];
    }
}
