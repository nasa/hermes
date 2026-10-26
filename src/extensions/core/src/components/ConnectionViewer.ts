import * as vscode from 'vscode';
import * as Connections from '../../common/connections';

import {
    WebViewMessenger,
    WebViewPanelBase
} from '@gov.nasa.jpl.hermes/vscode';

import {
    Api
} from '@gov.nasa.jpl.hermes/api';

import type { VscodeHermes } from '../context';
import { Dictionary } from '@gov.nasa.jpl.hermes/types/src';

function assertUnreachable(_: never): never {
    throw new Error("Didn't expect to get here");
}

export class ConnectionViewer extends WebViewPanelBase implements vscode.WebviewViewProvider {
    // Connections managed by each identifier
    msg?: WebViewMessenger<Connections.Frontend, Connections.Backend>;

    // The number of list changes the backend has reported to us
    private changes = 0;

    constructor(
        extensionPath: string,
        readonly api: Api,
        readonly vscodeApi: VscodeHermes,
    ) {
        super(extensionPath, 'hermes.connections');

        this.subscriptions.push(
            vscode.commands.registerCommand("hermes.connections.refresh", () => {
                this.refresh();
            }),
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions:
                {
                    // We only need to load this viewer once
                    // This will make hiding and displaying EVRs instant
                    retainContextWhenHidden: true
                }
            }),

            this.api.onFswChange(() => {
                this.refresh();
            }),

            this.api.onDictionaryChange((e) => {
                this.changes++;
                this.msg?.postMessage({
                    dictionaries: e
                });
            }),

            this.vscodeApi.onDictionaryProvidersChanged(() => {
                this.msg?.postMessage({
                    dictionaryProviders: this.getDictionaryProvider(),
                });
            }),
        );
    }

    private getDictionaryProvider(): { key: string, title: string }[] {
        return Array.from(Array.from(
            this.vscodeApi.dictionaryProviders.entries()
        ).map(([key, prov]) => ({ key, title: prov.title })));
    }

    async refresh(): Promise<void> {
        const changes = this.changes;
        const dictionaries = await this.api.allDictionaries();

        // If the backend reported a change while we waited on the lookup, its listener posted a newer list,
        // and posting the list we read would replace it. We read it again.
        if (changes !== this.changes) {
            return this.refresh();
        }

        this.msg?.postMessage({
            dictionaryProviders: this.getDictionaryProvider(),
            dictionaries,
        });
    }

    async resolveWebviewView(webviewView: vscode.WebviewView) {
        this.msg = new WebViewMessenger(async (msg, token) => {
            try {
                // Receive message from the webview.
                switch (msg.type) {
                    case 'refresh':
                        // Refresh the frontend state
                        this.refresh();
                        break;
                    case "dictionaryOpen": {
                        let dictionary: Dictionary | null | undefined;
                        try {
                            this.msg?.postMessage({ dictionaryLoading: true });
                            dictionary = await this.vscodeApi.dictionaryProviders.get(msg.provider)?.provideDictionaryPrompt?.();

                            if (dictionary) {
                                await this.vscodeApi.api.addDictionary(dictionary.toProto(), token);
                            }
                        } catch (err) {
                            vscode.window.showErrorMessage(`Failed to load dictionary: ${err}`);
                            return;
                        } finally {
                            this.msg?.postMessage({ dictionaryLoading: false });
                        }
                    }
                        break;
                    case "dictionaryRename":
                        break;
                    case "dictionaryDelete":
                        this.msg?.postMessage({ dictionaryLoading: true });
                        try {
                            await this.api.removeDictionary(msg.id);
                        } catch (err) {
                            vscode.window.showErrorMessage(`Failed to delete dictionary: ${err}`);
                        } finally {
                            this.msg?.postMessage({ dictionaryLoading: false });
                        }
                        break;
                    default:
                        return assertUnreachable(msg);
                }
            } catch (err) {
                vscode.window.showErrorMessage(`Hermes: (${msg.type}) ${err}`);
            }
        }, webviewView.webview);

        await this.resolveWebview(webviewView.webview, 'connections');

        webviewView.onDidDispose(() => {
            this.msg?.dispose();
            this.msg = undefined;
        });

        this.refresh();
    }
}
