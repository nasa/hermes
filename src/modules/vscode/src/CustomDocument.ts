import * as vscode from 'vscode';
import { WebViewBase } from './WebViewBase';

export class CustomDocument implements vscode.CustomDocument {
    private didRevert = new vscode.EventEmitter<void>();
    constructor(
        public readonly uri: vscode.Uri,
        public content: string,
    ) {
        this.get = async () => { return this.content; };
    }

    revert() {
        this.didRevert.fire();
    }

    /**
     * Overridable getter call for the content of the document
     * Usually you hook this up to the webview to request the document
     * content from the webview directly (thats why its async)
     */
    get: () => Promise<string>;

    onRevert = this.didRevert.event;

    dispose(): void {
        this.didRevert.dispose();
    }
};

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

export abstract class CustomDocumentProvider<
    Document extends CustomDocument
> extends WebViewBase implements vscode.CustomEditorProvider<Document> {
    protected readonly didChange: vscode.EventEmitter<vscode.CustomDocumentEditEvent<Document>>;
    onDidChangeCustomDocument: vscode.Event<vscode.CustomDocumentEditEvent<Document>>;

    constructor(
        extensionPath: string,
        viewName: string,
        private readonly DocumentType: { new(uri: vscode.Uri, content: string): Document }
    ) {
        super(extensionPath, viewName);

        this.didChange = new vscode.EventEmitter();
        this.onDidChangeCustomDocument = this.didChange.event;
    }

    async saveCustomDocument(document: Document): Promise<void> {
        await vscode.workspace.fs.writeFile(document.uri, textEncoder.encode(await document.get()));
    }

    async saveCustomDocumentAs(document: Document, destination: vscode.Uri): Promise<void> {
        await vscode.workspace.fs.writeFile(destination, textEncoder.encode(await document.get()));
    }

    async revertCustomDocument(document: Document): Promise<void> {
        document.revert();
    }

    async backupCustomDocument(document: Document, context: vscode.CustomDocumentBackupContext): Promise<vscode.CustomDocumentBackup> {
        const content = await document.get();
        await vscode.workspace.fs.writeFile(context.destination, textEncoder.encode(content));

        return {
            id: context.destination.path,
            delete: () => {
                vscode.workspace.fs.delete(context.destination);
            }
        };
    }

    async openCustomDocument(uri: vscode.Uri, openContext: vscode.CustomDocumentOpenContext): Promise<Document> {
        if (openContext.backupId) {
            uri = vscode.Uri.file(openContext.backupId);
        }

        if (openContext.untitledDocumentData) {
            return new this.DocumentType(
                uri,
                textDecoder.decode(openContext.untitledDocumentData)
            );
        }

        const content = textDecoder.decode(await vscode.workspace.fs.readFile(uri));
        return new this.DocumentType(uri, content);
    }

    abstract resolveCustomEditor(
        document: Document,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): void | PromiseLike<void>;
}
