import { TextDecoder, TextEncoder } from 'util';
import * as vscode from 'vscode';
import * as jsonschema from 'json-schema';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Fprime from '@gov.nasa.jpl.hermes/fprime';
import { DictionaryLanguageItem } from "@gov.nasa.jpl.hermes/vscode";

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export class ParamDbFsSerializer implements vscode.FileSystemProvider {
    constructor(readonly dictionary: DictionaryLanguageItem) { }

    private readonly _event = new vscode.EventEmitter<vscode.FileChangeEvent[]>();
    onDidChangeFile: vscode.Event<vscode.FileChangeEvent[]> = this._event.event;

    private getFs(uri: vscode.Uri) {
        return vscode.Uri.file(uri.path);
    }

    async stat(uri: vscode.Uri): Promise<vscode.FileStat> {
        const stat = await vscode.workspace.fs.stat(this.getFs(uri));

        return {
            type: vscode.FileType.File,
            ctime: stat.ctime,
            mtime: stat.mtime,
            size: 0,
            permissions: stat.permissions
        };
    }

    async readFile(uri: vscode.Uri): Promise<Uint8Array> {
        const dictionary = this.dictionary.active;
        const dataRaw = await vscode.workspace.fs.readFile(this.getFs(uri));
        const entries = Fprime.decodePrmDb(dataRaw, dictionary);

        for (const [key, value] of Object.entries(entries)) {
            const prm = dictionary.getParameter(key);
            if (!prm) {
                throw new Error(`Parameter ${key} not found`);
            }

            switch (prm.type.kind) {
                case Hermes.Def.TypeKind.u64:
                case Hermes.Def.TypeKind.i64:
                    // Convert bigint to normal int
                    entries[key] = Number(value);
                    break;
                case Hermes.Def.TypeKind.enum:
                    // Convert raw enum to string representation
                    entries[key] = prm.type.values.getK2(value as number)?.name ?? value;
                    break;
            }
        }

        const nEntries = Array.from(Object.keys(entries)).length;
        if (nEntries > Fprime.Settings.prmDbNumDbEntries()) {
            vscode.window.showWarningMessage(
                `Parameter Database exceeds maximum entries ${Fprime.Settings.prmDbNumDbEntries()}, got ${nEntries} entries.`,
                "Update max entries"
            ).then((value) => {
                if (value) {
                    vscode.commands.executeCommand("workbench.action.openSettings", Fprime.Settings.names.prmDb.numDbEntries);
                }
            });
        }

        return textEncoder.encode(JSON.stringify(entries, undefined, 4));
    }

    async writeFile(uri: vscode.Uri, content: Uint8Array): Promise<void> {
        const dictionary = await this.getDictionary();

        const json = textDecoder.decode(content);
        const entries: { [name: string]: Hermes.Value } = JSON.parse(json);

        // Make sure we don't have too many entries
        const numEntries = Object.keys(entries).length;
        if (numEntries > Fprime.Settings.prmDbNumDbEntries()) {
            vscode.window.showErrorMessage(
                `Reached maximum parameter database entries: ${Fprime.Settings.prmDbNumDbEntries()}, got ${numEntries}`,
                "Update max entries"
            ).then((value) => {
                if (value) {
                    vscode.commands.executeCommand("workbench.action.openSettings", Fprime.Settings.names.prmDb.numDbEntries);
                }
            });
            throw new Error("Could not encode database");
        }

        const outUri = this.getFs(uri);
        await vscode.workspace.fs.writeFile(outUri, Fprime.encodePrmDb(entries, dictionary));
    }

    watch(uri: vscode.Uri): vscode.Disposable {
        const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(this.getFs(uri), '*'));
        watcher.onDidChange(() => {
            this._event.fire([{ uri: uri, type: vscode.FileChangeType.Changed }]);
        });
        watcher.onDidDelete(() => {
            this._event.fire([{ uri: uri, type: vscode.FileChangeType.Deleted }]);
        });

        return watcher;
    }

    readDirectory(): [string, vscode.FileType][] { throw new Error('Method not implemented.'); }
    createDirectory(): void { throw new Error('Method not implemented.'); }
    delete() { throw new Error('Method not implemented.'); }
    rename(): void { throw new Error('Method not implemented.'); }
}

export class FPrimeParameterJsonSchemaProvider implements vscode.TextDocumentContentProvider, vscode.Disposable {
    dictDisp: vscode.Disposable;
    configDisp: vscode.Disposable;

    constructor(readonly fprime: DictionaryProvider) {
        this.dictDisp = this.fprime.onSelected(() => {
            this.refreshSchema();
        });

        this.configDisp = vscode.workspace.onDidChangeConfiguration((e) => {
            if (e.affectsConfiguration(Fprime.Settings.names.prmDb.numDbEntries)) {
                this.refreshSchema();
            }
        });
    }

    dispose() {
        this.dictDisp.dispose();
        this.configDisp.dispose();
    }

    private refreshSchema() {
        this._event.fire(vscode.Uri.from({ scheme: "fprimeschema", path: "/parameter-database" }));
    }

    private getSchema(): jsonschema.JSONSchema6 | undefined {
        const dictionary = this.fprime.active;
        if (!dictionary) {
            return;
        }

        const parameters: { [name: string]: jsonschema.JSONSchema6 } = {};
        for (const prm of dictionary.getParameters()) {
            const key = `${prm.component}.${prm.name}`;
            parameters[key] = {
                ...Hermes.getTypeSchema(prm.type),
                title: prm.metadata?.default ? `${prm.name} = ${prm.metadata?.default}` : prm.name,
                description: prm.metadata?.description
            };
        }

        return {
            additionalItems: false,
            type: "object",
            maxProperties: Fprime.Settings.prmDbNumDbEntries(),
            title: `${dictionary.name} Parameter Database`,
            properties: { ...parameters }
        };
    }

    private readonly _event = new vscode.EventEmitter<vscode.Uri>();
    onDidChange = this._event.event;

    provideTextDocumentContent(uri: vscode.Uri): vscode.ProviderResult<string> {
        if (uri.path !== "/parameter-database") {
            return;
        }

        const schema = this.getSchema();
        return JSON.stringify(schema) ?? schema;
    }
}
