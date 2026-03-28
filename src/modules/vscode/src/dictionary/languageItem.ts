import { Api } from '@gov.nasa.jpl.hermes/api';
import { Dictionary, Proto } from '@gov.nasa.jpl.hermes/types';
import * as vscode from 'vscode';

function dictionaryHeaderToString(head: Proto.IDictionaryHead): string {
    const out: string[] = [head.name ?? "[no-name]"];

    if (head.version) {
        out.push(head.version);
    }

    return out.join(" ");
}

export class DictionaryLanguageItem implements vscode.Disposable {
    id: string;

    private item: vscode.LanguageStatusItem;
    private subscriptions: vscode.Disposable[];
    private dictionaryChanged = new vscode.EventEmitter<void>();
    private activeUid: string | undefined;

    /**
     * Currently selected dictionary for this item
     */
    active: Dictionary | undefined;

    /**
     * Fired when {@link active} changes value
     */
    onDictionaryChanged = this.dictionaryChanged.event;

    constructor(
        readonly context: vscode.ExtensionContext,
        readonly api: Api,
        languageId: string,
        predicate: (head: Proto.IDictionaryHead) => boolean,
        readonly name: string = "dictionary",
        readonly dictionarySections: readonly string[] = [".commands"]
    ) {
        this.id = `hermes.${languageId}.${name}.state`;
        this.item = vscode.languages.createLanguageStatusItem(
            `hermes.${languageId}.${name}`,
            { language: languageId }
        );

        this.item.name = `${name} (Dictionary)`;
        this.item.command = {
            title: "Select",
            command: `hermes.${languageId}.${name}.select`,
        };

        this.activeUid = this.context.workspaceState.get<string>(this.id);
        this.set(this.activeUid);

        this.subscriptions = [
            this.api.onDictionaryChange((dicts) => {
                const filteredDictionaries = Object.entries(dicts).filter(([_, v]) => predicate(v));

                // We didn't have the dictionary before
                // We have it now
                if (this.activeUid && !this.active && dicts[this.activeUid]) {
                    this.set(this.activeUid);
                } else if (!this.activeUid && filteredDictionaries.length > 0) {
                    // Automatically select a dictionary
                    this.set(filteredDictionaries[0][0]);
                }
            }),
            vscode.commands.registerCommand(
                `hermes.${languageId}.${name}.select`,
                () => {
                    vscode.window.showQuickPick((async () => {
                        const dicts = await this.api.allDictionaries();
                        const filteredDictionaries = Object.entries(dicts).filter(([_, v]) => predicate(v));

                        return filteredDictionaries.map(([id, dict]) => ({
                            id,
                            label: dict.name ?? "[unknown name]",
                            description: dict.type ?? undefined,
                            detail: dict.version ?? undefined,
                        } satisfies (vscode.QuickPickItem & { id: string; })));
                    })(), {
                        title: "Select a dictionary",
                        canPickMany: false,
                    }).then((picked) => {
                        if (picked) {
                            this.set(picked.id);
                        }
                    });
                })
        ];
    }

    async set(dictUid: string | undefined) {
        this.activeUid = dictUid;

        if (!this.activeUid) {
            this.item.text = `[${this.name}] (none selected)`;
            this.item.severity = vscode.LanguageStatusSeverity.Warning;

            this.active = undefined;
            this.dictionaryChanged.fire();
        } else {
            this.item.busy = true;
            try {
                const dict = await this.api.getDictionary(this.activeUid, this.dictionarySections);
                this.active = Dictionary.fromProto(dict);

                await this.context.workspaceState.update(this.id, this.activeUid);

                this.item.severity = vscode.LanguageStatusSeverity.Information;
                this.item.text = `[${this.name}] ${dictionaryHeaderToString(this.active)}`;

                this.dictionaryChanged.fire();
            } catch (err) {
                this.active = undefined;
                this.dictionaryChanged.fire();

                this.item.severity = vscode.LanguageStatusSeverity.Error;
                this.item.text = `[${this.name}] ${String(err)}`;
            } finally {
                this.item.busy = false;
            }
        }
    }

    dispose(): void {
        for (const sub of this.subscriptions) {
            sub.dispose();
        }

        this.item.dispose();
    }
}
