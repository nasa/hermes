import * as vscode from 'vscode';
import { randomBytes } from 'crypto';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Proto } from '@gov.nasa.jpl.hermes/types';

const nullDisposable: vscode.Disposable = { dispose: () => { } };

function generateShortUid(): string {
    return randomBytes(4).toString('hex'); // Generate a short UID
}

export class Offline implements Hermes.Api {
    private dictionaryCache = new Map<string, Proto.IDictionary>();

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly log: Hermes.Log,
    ) { }

    private async _activate() {
        if (!this.context.storageUri) {
            return;
        }

        this.dictionaryCache.clear();
        this.log.info(`loading workspace dictionaries from ${this.context.storageUri.path}`);

        try {
            for (const [name, type] of await vscode.workspace.fs.readDirectory(this.context.storageUri)) {
                if (type === vscode.FileType.File) {
                    if (name.endsWith(".dictionary.pb")) {
                        this.log.info(`loading dictionary from ${name}`);
                        let dictContent: Uint8Array;
                        try {
                            dictContent = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(this.context.storageUri, name));
                        } catch (e) {
                            this.log.error(`failed to read dictionary from ${name}: ${e}`);
                            continue;
                        }

                        const id = name.replace(".dictionary.pb", "");

                        try {
                            const dict = Proto.Dictionary.decode(dictContent);
                            this.log.info(`registering dictionary ${id}: ${dict.head?.name} (version=${dict.head?.version}, type=${dict.head?.type})`);
                            this.dictionaryCache.set(id, dict);
                        } catch (e) {
                            this.log.error(`failed to parse dictionary ${id}: ${e}`);
                        }
                    }
                }
            }
        } catch (err) {
            this.log.warn(`failed to load workspace dictionaries: ${err}`);
        }
    }

    static async activate(
        context: vscode.ExtensionContext,
        log: Hermes.Log,
        _token?: vscode.CancellationToken
    ): Promise<Offline> {
        const out = new Offline(context, log);
        await out._activate();
        return out;
    }


    getFsw(id: string): Promise<Hermes.Fsw> {
        throw new Error(`FSW with id ${id} is not connected`);
    }

    async allFsw(): Promise<Hermes.Fsw[]> {
        return [];
    }

    startProfile(id: string): Promise<void> {
        throw new Error(`No profile with id ${id}`);
    }

    stopProfile(id: string): Promise<void> {
        throw new Error(`No profile with id ${id}`);
    }

    updateProfile(id: string): Promise<void> {
        throw new Error(`No profile with id ${id}`);
    }

    addProfile(): Promise<string> {
        throw new Error(`Cannot add profile in local mode, connect to a host first`);

    }
    removeProfile(id: string): Promise<void> {
        throw new Error(`No profile with id ${id}`);
    }

    async allProfiles(): Promise<Record<string, Proto.IStatefulProfile>> {
        return {};
    }

    async allProviders(): Promise<Proto.IProfileProvider[]> {
        return [];
    }

    async getFileTransferState(): Promise<Proto.IFileTransferState> {
        return {};
    }

    async clearDownlinkTransferState(): Promise<void> { }
    async clearUplinkTransferState(): Promise<void> { }

    async getDictionary(id: string): Promise<Proto.IDictionary> {
        const out = this.dictionaryCache.get(id);
        if (!out) {
            throw new Error(`No dictionary with id ${id}`);
        }

        return out;
    }

    private dictionaryUpdate() {
        this.allDictionaries().then((all) => {
            this.dictionaryChanged.fire(all);
        });
    }

    async addDictionary(dict: Proto.IDictionary): Promise<string> {
        const id = generateShortUid();

        if (!this.context.storageUri) {
            this.dictionaryCache.set(id, dict);
            this.dictionaryUpdate();
            return id;
        }

        await vscode.workspace.fs.createDirectory(this.context.storageUri);
        const dictPath = vscode.Uri.joinPath(
            this.context.storageUri,
            `${id}.dictionary.pb`
        );

        this.log.info(`writing dictionary to ${dictPath.path}`);
        await vscode.workspace.fs.writeFile(dictPath, Proto.Dictionary.encode(dict).finish());

        this.dictionaryCache.set(id, dict);
        this.dictionaryUpdate();
        return id;
    }

    async allDictionaries(): Promise<Record<string, Proto.IDictionaryHead>> {
        return Object.fromEntries(Array.from(this.dictionaryCache.entries()).map(([id, dict]) => [
            id, dict.head ?? {}
        ]));
    }

    async removeDictionary(id: string): Promise<void> {
        this.dictionaryCache.delete(id);
        this.dictionaryUpdate();

        if (this.context.storageUri) {
            const dictPath = vscode.Uri.joinPath(
                this.context.storageUri,
                `${id}.dictionary.pb`
            );

            this.log.info(`removing cached dictionary from ${dictPath.path}`);
            await vscode.workspace.fs.delete(dictPath);
        }
    }

    onFswChange = () => { return nullDisposable; };
    onProvidersChange = () => { return nullDisposable; };
    onProfilesChange = () => { return nullDisposable; };

    dictionaryChanged = new vscode.EventEmitter<Record<string, Proto.IDictionaryHead>>();
    onDictionaryChange = this.dictionaryChanged.event;

    onEvent(): vscode.Disposable {
        return nullDisposable;
    }

    onTelemetry(): vscode.Disposable {
        return nullDisposable;
    }

    onFileDownlink(): vscode.Disposable {
        return nullDisposable;
    }

    onFileUplink(): vscode.Disposable {
        return nullDisposable;
    }

    onFileTransfer() {
        return nullDisposable;
    }

    dispose() { }
}
