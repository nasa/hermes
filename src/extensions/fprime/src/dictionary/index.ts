import * as vscode from 'vscode';
import * as path from 'path';

import { Dictionary } from '@gov.nasa.jpl.hermes/types';
import { FileDictionaryProvider, } from "@gov.nasa.jpl.hermes/vscode";

import { parseFprimeXmlDictionary } from './xml';
import { parseFprimeJsonDictionary } from './json';

const textDecoder = new TextDecoder();

export class FprimeXmlDictionaryProvider extends FileDictionaryProvider {
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

export class FprimeJsonDictionaryProvider extends FileDictionaryProvider {
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
