import * as vscode from 'vscode';
import * as path from 'path';

import { Dictionary } from '@gov.nasa.jpl.hermes/types';
import {
    getApi,
    FileDictionaryProvider,
    DictionaryLanguageItem
} from "@gov.nasa.jpl.hermes/vscode";

import { FPrimeNotebookSerializer } from './notebook';
import { FPrimeExtension } from './language';
import { parseFprimeXmlDictionary } from './dictionaryXml';
import { FprimeNotebookLanguageProvider } from './language/notebook';
import { parseFprimeJsonDictionary } from './dictionaryJson';
import { FprimeDeploymentProvider } from './task';

const textDecoder = new TextDecoder();

class FprimeXmlDictionaryProvider extends FileDictionaryProvider {
    title = "F Prime (XML, <4.0)";

    constructor() {
        super({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'XML': ['xml'] }
        });
    }

    async parse(file: vscode.Uri): Promise<Dictionary> {
        const content = await vscode.workspace.fs.readFile(file);
        const [ns, topology] = parseFprimeXmlDictionary(textDecoder.decode(content));

        const name = path.basename(file.path, '.xml');

        const out = new Dictionary({
            name: topology ?? name,
            type: "fprime",
        });

        out.namespaces.set("", ns);
        return out;
    }
}

class FprimeJsonDictionaryProvider extends FileDictionaryProvider {
    title = "F Prime (JSON, >=4.0)";

    private _onExternalDictionariesUpdated = new vscode.EventEmitter<void>();
    onExternalDictionariesUpdated = this._onExternalDictionariesUpdated.event;

    private dictionaryWatcher?: vscode.FileSystemWatcher;

    constructor() {
        super({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: false,
            filters: { 'JSON': ['json'] }
        });
    }

    async parse(file: vscode.Uri): Promise<Dictionary> {
        const content = await vscode.workspace.fs.readFile(file);
        return parseFprimeJsonDictionary(textDecoder.decode(content));
    }

    /**
     * Provide auto-discovered dictionaries from build-artifacts
     * Returns dictionaries with deterministic IDs based on deployment name
     */
    async provideExternalDictionaries(): Promise<Dictionary[]> {
        const dictUris = await vscode.workspace.findFiles(
            '**/build-artifacts/**/dict/*.json'
        );

        const dictionaries: Dictionary[] = [];
        for (const uri of dictUris) {
            try {
                const dict = await this.parse(uri);
                dict.id = dict.name;

                dictionaries.push(dict);
            } catch (err) {
                console.error(`Failed to load dictionary ${uri.fsPath}:`, err);
            }
        }

        return dictionaries;
    }

    /**
     * Start watching workspace for dictionary changes
     * Called from extension activate(), not part of DictionaryProvider interface
     */
    startWatching(): vscode.Disposable {
        this.dictionaryWatcher = vscode.workspace.createFileSystemWatcher(
            '**/build-artifacts/**/dict/*.json'
        );

        this.dictionaryWatcher.onDidCreate(() => this._onExternalDictionariesUpdated.fire());
        this.dictionaryWatcher.onDidChange(() => this._onExternalDictionariesUpdated.fire());
        this.dictionaryWatcher.onDidDelete(() => this._onExternalDictionariesUpdated.fire());

        return vscode.Disposable.from(this.dictionaryWatcher, this._onExternalDictionariesUpdated);
    }
}

export async function activate(context: vscode.ExtensionContext) {
    const hermesVSCode = getApi();
    const dictionaryItem = new DictionaryLanguageItem(
        context,
        hermesVSCode.api,
        'fprime',
        (head) => head.type === "fprime",
    );

    const ext = new FPrimeExtension(dictionaryItem);
    const nbLanguage = new FprimeNotebookLanguageProvider(hermesVSCode.api, ext);

    // Create dictionary providers
    const jsonProvider = new FprimeJsonDictionaryProvider();
    const xmlProvider = new FprimeXmlDictionaryProvider();

    context.subscriptions.push(
        hermesVSCode.registerDictionaryProvider("fprime.json", jsonProvider),
        hermesVSCode.registerDictionaryProvider("fprime.xml", xmlProvider),
        hermesVSCode.registerLanguageDictionaryItem(dictionaryItem),
        hermesVSCode.registerNotebookLanguageProvider("fprime", nbLanguage),
        jsonProvider.startWatching(),

        // Register task provider for F Prime deployment auto-discovery
        vscode.tasks.registerTaskProvider(
            'hermes-fprime-deployment',
            new FprimeDeploymentProvider(hermesVSCode.api)
        ),

        vscode.commands.registerCommand(
            "hermes.fprime.uplink.file.cancel",
            async () => {
                // Look up all the 'fprime' FSWs connected
                const allFprime = (await hermesVSCode.api.allFsw()).filter((f) => f.type === "fprime" && f.request);
                if (allFprime.length > 1) {
                    // More than one connections made, show a prompt to see which one to send to
                    vscode.window.showQuickPick(allFprime.map(f => f.id))
                        .then(async (fswId) => {
                            if (fswId) {
                                const fsw = allFprime.find(f => f.id === fswId)!;
                                hermesVSCode.log.info(`Transmitting FILE_CANCEL packet to ${fsw.id}`);
                                try {
                                    await fsw.request!("cancel");
                                } catch (err) {
                                    vscode.window.showErrorMessage(`Failed to send FILE_CANCEL packet: ${err}`);
                                }
                            }
                        });
                } else if (allFprime.length === 1) {
                    const fsw = allFprime[0];
                    hermesVSCode.log.info(`Transmitting FILE_CANCEL packet to ${fsw.id}`);
                    try {
                        await fsw.request!("cancel");
                    } catch (err) {
                        vscode.window.showErrorMessage(`Failed to send FILE_CANCEL packet: ${err}`);
                    }
                } else {
                    vscode.window.showErrorMessage("No F Prime FSW connection to send FILE_CANCEL packet to");
                }
            }
        ),

        // Parameter Database
        // vscode.workspace.registerFileSystemProvider("fprimeprm", new ParamDbFsSerializer(dict)),
        // vscode.workspace.registerTextDocumentContentProvider("fprimeschema", new FPrimeParameterJsonSchemaProvider(dict)),
        // vscode.commands.registerCommand("hermes.fprime.prm.open", async (t: vscode.Uri) => {
        //     try {
        //         const doc = await vscode.workspace.openTextDocument(vscode.Uri.from({ scheme: "fprimeprm", path: t.path }));
        //         await vscode.window.showTextDocument(doc, { preview: false });
        //     } catch (e) {
        //         vscode.window.showErrorMessage(`${e}`);
        //     }
        // }),

        // Notebook
        hermesVSCode.registerNotebookType("fprime-notebook"),
        vscode.workspace.registerNotebookSerializer('fprime-notebook', new FPrimeNotebookSerializer()),
        dictionaryItem,
        ext,
        nbLanguage,
    );
}
