import * as vscode from 'vscode';

import { WebViewMessenger, WebViewPanelBase } from '@gov.nasa.jpl.hermes/vscode';
import * as Downlink from '../../common/downlink';

import { Api } from '@gov.nasa.jpl.hermes/api';

export class DownlinkViewer extends WebViewPanelBase implements vscode.WebviewViewProvider {
    msg?: WebViewMessenger<Downlink.Frontend, Downlink.Backend>;

    constructor(extensionPath: string, readonly api: Api) {
        super(extensionPath, "hermes.downlink");

        this.subscriptions.push(
            vscode.window.registerWebviewViewProvider(this.viewName, this),
        );
    }

    async refresh() {
        if (this.msg) {
            const state = await this.api.getFileTransferState();
            this.msg.postMessage({
                inProgress: state.downlinkInProgress ?? [],
                finished: state.downlinkCompleted ?? [],
            });
        }
    }

    async resolveWebviewView(webviewView: vscode.WebviewView) {
        this.msg = new WebViewMessenger((msg) => {
            switch (msg.type) {
                case "refresh":
                    this.refresh();
                    break;
                case 'open': {
                    const uri = vscode.Uri.file(msg.path);
                    if (!vscode.workspace.getWorkspaceFolder(uri)) {
                        // This uri is not in the workspace
                        // Show it in finder
                        vscode.commands.executeCommand('revealFileInOS', uri);
                    } else {
                        vscode.commands.executeCommand('revealFileInExplorer', uri);
                    }
                }
            }
        }, webviewView.webview);

        await this.resolveWebview(webviewView.webview, 'files', {
            rootId: "root",
            defines: {
                kind: "downlink"
            }
        });

        const fileDownlinkListener = this.api.onFileTransfer((state) => {
            this.msg?.postMessage({
                inProgress: state.downlinkInProgress ?? [],
                finished: state.downlinkCompleted ?? [],
            });
        });

        webviewView.onDidDispose(() => {
            this.msg?.dispose();
            fileDownlinkListener.dispose();
            this.msg = undefined;
        });
    }
}
