import * as vscode from 'vscode';

import { WebViewMessenger, WebViewPanelBase } from '@gov.nasa.jpl.hermes/vscode';
import * as Downlink from '../../common/downlink';

import { Api } from '@gov.nasa.jpl.hermes/api';

export class UplinkViewer extends WebViewPanelBase implements vscode.WebviewViewProvider {
    msg?: WebViewMessenger<Downlink.Frontend, Downlink.Backend>;

    constructor(extensionPath: string, readonly api: Api) {
        super(extensionPath, "hermes.uplink");

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
        this.msg = new WebViewMessenger(() => { }, webviewView.webview);
        await this.resolveWebview(webviewView.webview, 'files', {
            rootId: "root",
            defines: {
                kind: "uplink"
            }
        });

        const fileDownlinkListener = this.api.onFileTransfer((state) => {
            this.msg?.postMessage({
                inProgress: state.uplinkInProgress ?? [],
                finished: state.uplinkCompleted ?? [],
            });
        });

        webviewView.onDidDispose(() => {
            this.msg?.dispose();
            fileDownlinkListener.dispose();
            this.msg = undefined;
        });
    }
}
