import * as vscode from 'vscode';

import { DisplayEvent, Event, Sourced } from '@gov.nasa.jpl.hermes/types';
import { Api } from '@gov.nasa.jpl.hermes/api';
import { WebViewMessenger, WebViewPanelBase } from '@gov.nasa.jpl.hermes/vscode';

import { FrontendMessage, BackendMessage } from '../../common/evrs';
import { DebounceEmitter } from '../utils/DebounceEmitter';
import { eventToDisplayEvent } from '@gov.nasa.jpl.hermes/types/src/conversion';

export class EventViewerBase extends WebViewPanelBase {
    static parse(text: string) {
        let evrs: any;
        try {
            evrs = JSON.parse(text);
        }
        catch (error) {
            throw new Error(`Failed to parse EVR JSON: ${error}`);
        }

        // Validate the JSON data
        // if (!validateEvrJson(evrs)) {
        //     throw new Error("Not an EVR JSON file");
        // }

        return evrs;
    }

    handleRequest(): Promise<never> {
        throw new Error('Method not implemented.');
    }

    protected resolveWebviewEvent(webview: vscode.Webview, evrs?: Event[]) {
        return super.resolveWebview(
            webview,
            'evrs',
            {
                rootId: 'root',
                defines: {
                    state: evrs ?? []
                }
            }
        );
    }
}

export class EventViewer extends EventViewerBase implements vscode.CustomTextEditorProvider {
    constructor(extensionPath: string, viewName: string) {
        super(extensionPath, viewName);
    }

    public async resolveCustomTextEditor(
        document: vscode.TextDocument,
        webviewPanel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Promise<void> {
        await this.resolveWebviewEvent(webviewPanel.webview, EventViewer.parse(document.getText()));

        const messenger = new WebViewMessenger<FrontendMessage, BackendMessage>(async (msg) => {
            switch (msg.type) {
                case 'refresh':
                    break;
            }
        }, webviewPanel.webview);

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document.uri.toString() === document.uri.toString()) {
                try {
                    messenger.postMessage({
                        type: 'update',
                        events: EventViewerBase.parse(e.document.getText())
                    });
                }
                catch (_) {
                    // Failed to refresh
                    // We are probably in the middle of an edit
                    // Better not error out here
                }
            }
        });

        // Make sure we get rid of the listener when our editor is closed.
        webviewPanel.onDidDispose(() => {
            changeDocumentSubscription.dispose();
        });
    }
}


export class EventPanel extends EventViewerBase implements vscode.WebviewViewProvider {
    panelEvents: Sourced<Event>[];
    debouncer: DebounceEmitter<DisplayEvent>;

    constructor(readonly api: Api, extensionPath: string) {
        super(extensionPath, 'hermes.eventPanel');
        this.panelEvents = [];
        this.debouncer = new DebounceEmitter<DisplayEvent>({
            merge: (evrs) => evrs
        });

        this.subscriptions.push(
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions:
                {
                    // We only need to load this viewer once
                    // This will make hiding and displaying EVRs instant
                    retainContextWhenHidden: true
                }
            }),
            this.api.onEvent((evr) => {
                this.panelEvents.push(evr);
                this.debouncer.fire(eventToDisplayEvent(evr));
            })
        );
    }

    async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
        await this.resolveWebviewEvent(webviewView.webview);

        const messenger = new WebViewMessenger<FrontendMessage, BackendMessage>((msg) => {
            switch (msg.type) {
                case 'refresh':
                    messenger.postMessage({
                        type: 'update',
                        events: this.panelEvents.map(eventToDisplayEvent)
                    });
                    break;
                case 'clear':
                    this.panelEvents = [];
                    messenger.postMessage({
                        type: 'update',
                        events: this.panelEvents.map(eventToDisplayEvent)
                    });
            }
        }, webviewView.webview);

        const disp = this.debouncer.event((events) => {
            messenger.postMessage({ type: 'append', events });
        });

        webviewView.onDidDispose(() => {
            messenger.dispose();
            disp.dispose();
        });
    }
}
