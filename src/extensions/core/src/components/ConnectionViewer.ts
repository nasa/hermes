import * as vscode from 'vscode';
import * as Connections from '../../common/connections';

import {
    WebViewMessenger,
    WebViewMessengerBase,
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

class RJSFMessenger extends WebViewMessengerBase<never, {
    type: (
        "removeItem"
        | "moveUp"
        | "moveDown"
        | "copy"
    );

    id: string;
}> {
    removeItem(id: string) {
        this.postMessage({ type: 'removeItem', id });
    }
    moveUp(id: string) {
        this.postMessage({ type: 'moveUp', id });
    }
    moveDown(id: string) {
        this.postMessage({ type: 'moveDown', id });
    }
    copy(id: string) {
        this.postMessage({ type: 'copy', id });
    }

    onDidReceiveMessage(_msg: never): void { }
}

export class ConnectionViewer extends WebViewPanelBase implements vscode.WebviewViewProvider {
    // Connections managed by each identifier
    msg?: WebViewMessenger<Connections.Frontend, Connections.Backend>;
    rjsfArrayGrid?: RJSFMessenger;

    runningProfileRequests = new Map<string, vscode.CancellationTokenSource>();

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
            vscode.commands.registerCommand("hermes.connections.array.removeItem", (context) => {
                this.rjsfArrayGrid?.removeItem(context.id);
            }),
            vscode.commands.registerCommand("hermes.connections.array.moveUp", (context) => {
                this.rjsfArrayGrid?.moveUp(context.id);
            }),
            vscode.commands.registerCommand("hermes.connections.array.moveDown", (context) => {
                this.rjsfArrayGrid?.moveDown(context.id);
            }),
            vscode.commands.registerCommand("hermes.connections.array.copy", (context) => {
                this.rjsfArrayGrid?.copy(context.id);
            }),
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions:
                {
                    // We only need to load this viewer once
                    // This will make hiding and displaying EVRs instant
                    retainContextWhenHidden: true
                }
            }),

            this.api.onProvidersChange((e) => {
                this.msg?.postMessage({
                    profileProviders: e,
                });
            }),

            this.api.onFswChange(() => {
                this.refresh();
            }),

            this.api.onProfilesChange((e) => {
                this.msg?.postMessage({
                    profiles: e
                });
            }),

            this.api.onDictionaryChange((e) => {
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

    async refresh() {
        // Request the entire state and wait for it all to return back
        const [
            profileProviders,
            profiles,
            connections,
            dictionaries
        ] = await Promise.all([
            this.api.allProviders(),
            this.api.allProfiles(),
            this.api.allFsw(),
            this.api.allDictionaries(),
        ]);

        this.msg?.postMessage({
            dictionaryProviders: this.getDictionaryProvider(),
            profileProviders,
            profiles,
            connections: connections.map((v) => ({
                id: v.id,
                type: v.type,
                profileId: v.profileId,
                forwards: v.forwards
            })),
            dictionaries,
        });
    }

    async resolveWebviewView(webviewView: vscode.WebviewView) {
        this.rjsfArrayGrid = new RJSFMessenger(webviewView.webview, 'rjsf');
        this.msg = new WebViewMessenger(async (msg, token) => {
            try {
                // Receive message from the webview.
                switch (msg.type) {
                    case 'refresh':
                        // Refresh the frontend state
                        this.refresh();
                        break;
                    case 'profileUpdate':
                        if (msg.data) {
                            await this.api.updateProfile(
                                msg.id,
                                JSON.stringify(msg.data),
                                token,
                            );
                        }
                        break;
                    case "profileNew":
                        await this.api.addProfile({
                            name: msg.provider,
                            provider: msg.provider,
                            setting: "{}",
                        }, token);
                        break;
                    case "profileStart":
                        await this.api.startProfile(msg.id, token);
                        break;
                    case "profileStop":
                        await this.api.stopProfile(msg.id, token);
                        break;
                    case "profileDelete":
                        await this.api.removeProfile(msg.id, token);
                        break;
                    case 'explorer.reveal':
                        vscode.commands.executeCommand('revealInExplorer', msg.workspaceRelative ? this.getPath(msg.value) : msg.value);
                        break;
                    case 'editor.open': {
                        const uri = vscode.Uri.parse(msg.uri);
                        vscode.workspace.fs.stat(uri).then(value => {
                            if (value) {
                                switch (value.type) {
                                    case vscode.FileType.File:
                                    case vscode.FileType.SymbolicLink:
                                    case vscode.FileType.Unknown:
                                        vscode.commands.executeCommand('vscode.open', uri);
                                        break;
                                    case vscode.FileType.Directory:
                                        vscode.commands.executeCommand('revealInExplorer', uri);
                                        break;
                                }
                            }
                        });
                    }
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
                    case 'refreshArray':
                        throw new Error(`Connections do not support array refresh: ${JSON.stringify(msg)}`);
                    default:
                        return assertUnreachable(msg);
                }
            } catch (err) {
                vscode.window.showErrorMessage(String(err));
            }
        }, webviewView.webview);

        await this.resolveWebview(webviewView.webview, 'connections');

        webviewView.onDidDispose(() => {
            this.msg?.dispose();
            this.rjsfArrayGrid?.dispose();
            this.msg = undefined;
            this.rjsfArrayGrid = undefined;
        });

        this.refresh();
    }

    private getPath(path: string): vscode.Uri {
        if (vscode.workspace.workspaceFolders) {
            const workspace = vscode.workspace.workspaceFolders[0];
            return vscode.Uri.file(`${workspace.uri.fsPath}/${path}`);
        } else {
            throw Error("Workspace is not open");
        }
    }
}
