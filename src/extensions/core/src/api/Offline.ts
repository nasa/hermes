import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import { Proto } from '@gov.nasa.jpl.hermes/types';
import { generateShortUid } from '@gov.nasa.jpl.hermes/util';

import { yamcsDictionary } from './yamcsCommands';

const nullDisposable: vscode.Disposable = { dispose: () => { } };

// YAMCS mode saves each instance's commands in a file named like fprime-project.yamcs-commands.pb
const savedCommandsSuffix = '.yamcs-commands.pb';

export class Offline implements Hermes.Api {
    private dictionaryCache = new Map<string, Proto.IDictionary>();

    protected constructor(
        readonly context: vscode.ExtensionContext,
        readonly log: Hermes.Log,
    ) { }

    protected async _activate() {
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
                    } else if (name.endsWith(savedCommandsSuffix)) {
                        // We build the dictionary that YAMCS mode builds from these commands, with the same id, so a
                        // language item's saved selection still finds it
                        try {
                            const content = await vscode.workspace.fs.readFile(vscode.Uri.joinPath(this.context.storageUri, name));
                            const dict = yamcsDictionary(name.slice(0, -savedCommandsSuffix.length), Rpc.decodeYamcsCommands(content));
                            this.log.info(`registering dictionary ${dict.id} from the YAMCS commands in ${name}`);
                            this.dictionaryCache.set(dict.id!, dict);
                        } catch (e) {
                            this.log.error(`failed to load YAMCS commands from ${name}: ${e}`);
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
        let id: string;
        let save: boolean;
        if (dict.id) {
            id = dict.id;
            save = false;
        } else {
            id = generateShortUid();
            save = true;
        }

        if (save && this.context.storageUri) {
            await vscode.workspace.fs.createDirectory(this.context.storageUri);
            const dictPath = vscode.Uri.joinPath(
                this.context.storageUri,
                `${id}.dictionary.pb`
            );

            this.log.info(`writing dictionary to ${dictPath.path}`);
            await vscode.workspace.fs.writeFile(dictPath, Proto.Dictionary.encode(dict).finish());
        }

        this.dictionaryCache.set(id, dict);
        this.dictionaryUpdate();
        return id;
    }

    // Saves an instance's commands, so Offline mode can build the instance's dictionary without YAMCS. addDictionary
    // keeps a dictionary that has an id in memory only.
    protected async saveYamcsCommands(instance: string, commands: Rpc.YamcsCommandInfo[]) {
        if (!this.context.storageUri) {
            return;
        }
        try {
            await vscode.workspace.fs.createDirectory(this.context.storageUri);
            const file = vscode.Uri.joinPath(this.context.storageUri, `${instance}${savedCommandsSuffix}`);
            await vscode.workspace.fs.writeFile(file, Rpc.encodeYamcsCommands(commands));
        } catch (err) {
            this.log.warn(`Could not save the commands of YAMCS instance ${instance}: ${err}`);
        }
    }

    async allDictionaries(): Promise<Record<string, Proto.IDictionaryHead>> {
        return Object.fromEntries(Array.from(this.dictionaryCache.entries()).map(([id, dict]) => [
            id, dict.head ?? {}
        ]));
    }

    async removeDictionary(id: string): Promise<void> {
        const dict = this.dictionaryCache.get(id);
        this.dictionaryCache.delete(id);
        this.dictionaryUpdate();

        if (this.context.storageUri) {
            // A YAMCS dictionary is named after its instance, and we save it as that instance's commands
            const dictPath = vscode.Uri.joinPath(
                this.context.storageUri,
                dict?.head?.type === 'yamcs' ? `${dict.head.name}${savedCommandsSuffix}` : `${id}.dictionary.pb`
            );

            this.log.info(`removing cached dictionary from ${dictPath.path}`);
            await vscode.workspace.fs.delete(dictPath);
        }
    }

    onFswChange: vscode.Event<Hermes.Fsw[]> = () => { return nullDisposable; };
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
