import path from 'path';
import * as vscode from 'vscode';

export interface WebViewBaseOptions {
    /**
     * Extra definitions that are executed globally before the main bundle is run
     * These are nice if you are passing data at initial bootup to your bundle
     * like a configuration.
     * 
     * This is a key -> value map and the value must be JSON serializable.
     */
    defines?: Record<string, any>;

    /**
     * External module definitions placed in the <head>
     */
    modules?: Record<string, string>;

    /**
     * ID of the root node. By default this is `#root`.
     * This is nice if you want to bundle two separate views into
     * one consolidated bundle. This will safe bundling overhead and reduce
     * the overall size of the final extension.
     * 
     * Note: This method will also ship both views alongside each other so
     *       if this view is being opened and closed all the time, it will
     *       come with the overhead of both applications.
     * Note 2: The previous is not as bad as you might think though. Usually
     *         the main overhead of an application is not your code, but the
     *         code that is part of the UI framework you are using. This would
     *         need to be packaged up in both
     */
    rootId: string;
}

interface M<T> {
    id: number;

    /**
     * Context ID
     */
    c?: string;

    /**
     * Actual message
     */
    m: T | null;
}

export abstract class WebViewMessengerBase<FrontendMsg, BackendMsg> implements vscode.Disposable {
    private subscription: vscode.Disposable;
    private requests = new Map<number, vscode.CancellationTokenSource>();

    constructor(
        private readonly webview: vscode.Webview,
        protected readonly context?: string
    ) {
        this.subscription = this.webview.onDidReceiveMessage((msg: M<FrontendMsg>) => {
            if (msg.c === this.context) {
                if (msg.m === null) {
                    const source = this.requests.get(msg.id);
                    if (source) {
                        source.cancel();
                    }
                } else {
                    const cancellationSource = new vscode.CancellationTokenSource();
                    this.requests.set(msg.id, cancellationSource);
                    Promise.resolve(this.onDidReceiveMessage(msg.m, cancellationSource.token))
                        .finally(() => {
                            this.requests.delete(msg.id);
                        });
                }
            }
        });
    }

    postMessage(msg: BackendMsg) {
        return this.webview.postMessage({
            id: 0,
            c: this.context,
            m: msg
        } satisfies M<BackendMsg>);
    }

    abstract onDidReceiveMessage(msg: FrontendMsg, token: vscode.CancellationToken): void;

    dispose() {
        this.subscription.dispose();
    }
}

export class WebViewMessenger<FrontendMsg, BackendMsg> implements vscode.Disposable {
    private subscription: vscode.Disposable;
    private requests = new Map<number, vscode.CancellationTokenSource>();

    constructor(
        readonly onDidReceiveMessage: (t: FrontendMsg, token: vscode.CancellationToken) => Promise<void> | void,
        private readonly webview: vscode.Webview,
        protected readonly context?: string
    ) {
        this.subscription = this.webview.onDidReceiveMessage((msg: M<FrontendMsg>) => {
            if (msg.c === this.context) {

                if (msg.m === null) {
                    const source = this.requests.get(msg.id);
                    if (source) {
                        source.cancel();
                    }
                } else {
                    const cancellationSource = new vscode.CancellationTokenSource();
                    this.requests.set(msg.id, cancellationSource);
                    Promise.resolve(this.onDidReceiveMessage(msg.m, cancellationSource.token))
                        .catch((err) => {
                            vscode.window.showErrorMessage(String(err));
                        })
                        .finally(() => {
                            this.requests.delete(msg.id);
                        });
                }
            }
        });
    }

    postMessage(msg: BackendMsg) {
        return this.webview.postMessage({
            id: 0,
            c: this.context,
            m: msg
        } satisfies M<BackendMsg>);
    }

    dispose() {
        this.subscription.dispose();
    }
}

type FrontendRequestMessage<Request extends any[]> = (
    | { id: number; c: string, r: Request; }
    // Cancellation
    | { id: number; r: null; }
);

type BackendReplyMessage<Reply> = (
    | { id: number; r: Reply }
);

export class WebViewRequester implements vscode.Disposable {
    private runningRequests = new Map<number, vscode.CancellationTokenSource>();
    private messenger: WebViewMessenger<
        FrontendRequestMessage<any[]>,
        BackendReplyMessage<any>
    >;

    constructor(
        handler: any,
        private readonly webview: vscode.Webview,
        protected readonly context: string,
    ) {
        this.messenger = new WebViewMessenger<
            FrontendRequestMessage<any[]>,
            BackendReplyMessage<any>
        >((msg: FrontendRequestMessage<any[]>) => {
            if (msg.r) {
                const ts = new vscode.CancellationTokenSource();
                this.runningRequests.set(msg.id, ts);
                Promise.resolve(
                    handler[msg.c](...msg.r, ts.token)
                ).then((reply) => {
                    this.messenger.postMessage({
                        id: msg.id,
                        r: reply
                    } satisfies BackendReplyMessage<any>);
                }).finally(() => {
                    this.runningRequests.delete(msg.id);
                });
            } else {
                this.runningRequests.get(msg.id)?.cancel();
            }
        }, this.webview, context);
    }

    dispose() {
        for (const request of this.runningRequests.values()) {
            request.cancel();
        }
        this.messenger.dispose();
    }
}

/**
 * Base webview provider. This provides additional abstraction beyond what VSCode does
 * This allows us to enforce messaging and to intercept messaging to send over other
 * pipelines besides VSCode's if needed.
 */
export class WebViewBase implements vscode.Disposable {
    // This class implements the command functionality between the EVR editor and the bottom panel viewer
    subscriptions: vscode.Disposable[];

    constructor(
        protected readonly extensionPath: string,
        protected readonly viewName: string
    ) {
        this.subscriptions = [];
    }

    dispose() {
        this.subscriptions.map(v => v.dispose());
        this.subscriptions = [];
    }

    protected localPath(...pathS: string[]): string {
        return path.join(this.extensionPath, ...pathS);
    }

    protected getWebviewPath(webview: vscode.Webview, ...pathS: string[]): string {
        return webview.asWebviewUri(
            vscode.Uri.file(this.localPath(...pathS))
        ).toString();
    }

    protected getHtmlForWebview(webview: vscode.Webview, bundleName: string, options?: WebViewBaseOptions): string | Promise<string> {
        const bundleScriptPath = this.getWebviewPath(webview, 'out', `${bundleName}.js`);
        const bundleCssPath = this.getWebviewPath(webview, 'out', `${bundleName}.css`);
        const codicons = this.getWebviewPath(webview, 'out', `codicon.css`);

        const defineScripts: string[] = [];
        for (const [varName, value] of Object.entries(options?.defines ?? {})) {
            defineScripts.push(`<script>var ${varName} = ${JSON.stringify(value)};</script>`);
        }

        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>View</title>
    <link rel="stylesheet" type="text/css" href="${bundleCssPath}">
    <link rel="stylesheet" href="${codicons}" id="vscode-codicon-stylesheet">
    <script type="importmap">
    {
        "imports": ${JSON.stringify({ ...options?.modules ?? {} })}
    }
    </script>
</head>
<body>
    <div class="root" id="${options?.rootId ?? "root"}"></div>
    ${defineScripts.join("\n")}
    <script type="module" src="${bundleScriptPath}"></script>
</body>
</html>`;
    }

    protected async resolveWebview(
        webview: vscode.Webview,
        bundleName: string,
        options?: WebViewBaseOptions
    ): Promise<void> {
        webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file('/'),
                vscode.Uri.file('c:/')
            ]
        };

        (async () => {
            webview.html = await this.getHtmlForWebview(webview, bundleName, options);
            this.flushFocusRequests();
        })();
    }

    private focusRequests: (() => void)[] = [];
    private flushFocusRequests() {
        while (this.focusRequests.length > 0) {
            this.focusRequests.pop()?.();
        }
    }

    show(webview?: vscode.WebviewView): Promise<void> {
        if (webview) {
            webview.show();
            return new Promise((resolve) => { this.flushFocusRequests(); resolve(); });
        } else {
            vscode.commands.executeCommand(`${this.viewName}.focus`);
            return new Promise((resolve) => {
                this.focusRequests.push(resolve);
            });
        }
    }
}

export abstract class WebViewPanelBase extends WebViewBase {
    webview?: vscode.Webview;

    protected async resolveWebview(
        webview: vscode.Webview,
        bundleName: string,
        options?: WebViewBaseOptions
    ) {
        this.webview = webview;
        await super.resolveWebview(
            webview,
            bundleName,
            options
        );
    }
}
