import { randomBytes } from 'crypto';
import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Dictionary, Proto } from '@gov.nasa.jpl.hermes/types';
import { FileDictionaryProvider } from '@gov.nasa.jpl.hermes/vscode';

const nullDisposable: vscode.Disposable = { dispose: () => { } };

// In a message that protobufjs decodes, a field missing from the file reads as its default, so a YAMCS command, which
// has no opcode, would read as opcode 0. toObject leaves those fields out. With longs: Number it also turns each int64
// into a number, because Dictionary.fromProto drops an integer's min and max unless they're numbers.
function decodeDictionary(bytes: Uint8Array): Proto.IDictionary {
    return Proto.Dictionary.toObject(Proto.Dictionary.decode(bytes), { longs: Number });
}

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

                        const id = decodeURIComponent(name.replace(".dictionary.pb", ""));

                        try {
                            const dict = decodeDictionary(dictContent);
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
            // YAMCS mode's dictionaries have an id, and we save them so Offline mode keeps them
            save = dict.head?.type === 'yamcs';
        } else {
            id = randomBytes(4).toString('hex');
            save = true;
        }

        if (save && this.context.storageUri) {
            try {
                await vscode.workspace.fs.createDirectory(this.context.storageUri);
                // On Windows, a colon in a file name starts a stream name, so yamcs:fprime-project.dictionary.pb would
                // write to a hidden stream of a file called yamcs, which the loader never finds. We escape the id instead.
                const dictPath = vscode.Uri.joinPath(
                    this.context.storageUri,
                    `${encodeURIComponent(id)}.dictionary.pb`
                );

                this.log.info(`writing dictionary to ${dictPath.path}`);
                await vscode.workspace.fs.writeFile(dictPath, Proto.Dictionary.encode(dict).finish());
            } catch (err) {
                if (dict.head?.type !== 'yamcs') {
                    throw err;
                }
                // YAMCS mode adds its dictionary while connecting and builds it again each time, so we warn rather
                // than fail the connection
                this.log.warn(`Could not save YAMCS dictionary ${id}: ${err}`);
            }
        }

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
        const dict = this.dictionaryCache.get(id);
        this.dictionaryCache.delete(id);
        this.dictionaryUpdate();

        // We delete a file only if addDictionary saved one, which it does for a dictionary added without an id and for
        // a YAMCS dictionary
        if (this.context.storageUri && (!dict?.id || dict.head?.type === 'yamcs')) {
            const dictPath = vscode.Uri.joinPath(
                this.context.storageUri,
                `${encodeURIComponent(id)}.dictionary.pb`
            );

            this.log.info(`removing cached dictionary from ${dictPath.path}`);
            await vscode.workspace.fs.delete(dictPath);
        }
    }

    onFswChange: vscode.Event<Hermes.Fsw[]> = () => { return nullDisposable; };

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

    onFileTransfer: vscode.Event<Proto.IFileTransferState> = () => { return nullDisposable; };

    dispose() { }
}

export class HermesDictionaryProvider extends FileDictionaryProvider {
    title = "Hermes dictionary";

    constructor() {
        super({ filters: { 'Hermes dictionary': ['pb'] } });
    }

    async parse(file: vscode.Uri): Promise<Dictionary> {
        const proto = decodeDictionary(await vscode.workspace.fs.readFile(file));
        // An empty file, or a protobuf file of another kind, can decode without an error
        if (!proto.head?.type || !proto.content) {
            throw new Error(`${file.fsPath} is not a Hermes dictionary`);
        }
        const out = Dictionary.fromProto(proto);
        // We keep a YAMCS dictionary's id, like yamcs:ref, so cells that target its instance find it. We add any other
        // dictionary without its id, so addDictionary gives it a new one and saves it.
        if (proto.head?.type === 'yamcs') {
            out.id = proto.id ?? undefined;
        }
        return out;
    }
}
