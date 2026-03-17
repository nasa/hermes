import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import {
    Proto,
} from '@gov.nasa.jpl.hermes/types';
import { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { showEvr } from '../settings';
import { NotebookLanguageProvider } from './common';
import { eventToDisplayEvent } from '@gov.nasa.jpl.hermes/types/src/conversion';

async function setCellFsw(cell: vscode.NotebookCell, fswId: string | undefined) {
    const cellMetadata = { ...cell.metadata };
    if (!cellMetadata.hermes) {
        cellMetadata.hermes = {};
    }

    cellMetadata.hermes.fsw = fswId;

    // create workspace edit to update context
    const edit = new vscode.WorkspaceEdit();
    const nbEdit = vscode.NotebookEdit.updateCellMetadata(cell.index, {
        ...cellMetadata,
    });
    edit.set(cell.notebook.uri, [nbEdit]);
    await vscode.workspace.applyEdit(edit);
}

interface FswLanguageProviderQuickPickItem extends vscode.QuickPickItem {
    context?: string;
    selectCustom?: boolean;
}

/**
 * Subscribe to EVRs from the EVR event bus that are related
 * to the given FSW. By default only EVRs from this FSW are shown.
 * 
 * If the given FSW target includes fields in `forwards`, those
 * additional FSWs will be listened to.
 * @param output NotebookCellExecution to write EVRs to
 * @param api Hermes Api
 * @param fsw FSW to listen to
 * @returns disposable that released to the EVR subscription
 */
export function evrOutput(
    output: vscode.NotebookCellExecution,
    api: Hermes.Api,
    fsw: Hermes.Fsw,
): vscode.Disposable {
    const out = new vscode.NotebookCellOutput([
        vscode.NotebookCellOutputItem.text('', 'hermes.notebook/evr')
    ]);
    const evrs: string[] = [];

    output.appendOutput(out);

    if (fsw.forwards) {
        return api.onEvent((evr) => {
            if (fsw.forwards!.includes(evr.source) && showEvr(evr.def.severity)) {
                evrs.push(JSON.stringify(eventToDisplayEvent(evr)));
                output.replaceOutputItems(
                    vscode.NotebookCellOutputItem.text(evrs.join('\n'), 'hermes.notebook/evr'),
                    out
                );
            }
        });
    } else {
        return api.onEvent((evr) => {
            if (evr.source === fsw.id) {
                if (showEvr(evr.def.severity)) {
                    evrs.push(JSON.stringify(eventToDisplayEvent(evr)));
                    output.replaceOutputItems(
                        vscode.NotebookCellOutputItem.text(evrs.join('\n'), 'hermes.notebook/evr'),
                        out
                    );
                }
            }
        }, { source: fsw.id });
    }
}

export abstract class FswNotebookLanguageProvider implements NotebookLanguageProvider {
    didChangeCellStatusBarItems = new vscode.EventEmitter<void>();
    onDidChangeCellStatusBarItems = this.didChangeCellStatusBarItems.event;

    private didFswStatusChange = true;
    private statusBarItems: vscode.NotebookCellStatusBarItem[] = [];

    protected subscriptions: vscode.Disposable[];

    private async validFsws(token?: vscode.CancellationToken): Promise<Hermes.Fsw[]> {
        return (await this.api.allFsw(token))
            .filter((f) => f.sequence !== undefined)
            .filter(this.connectionPredicate)
            .sort((a, b) => a.id.localeCompare(b.id));
    }

    constructor(
        readonly id: string,
        readonly connectionPredicate: (fsw: Proto.IFsw) => boolean,
        readonly api: Hermes.Api,
    ) {

        this.subscriptions = [
            this.api.onFswChange(() => {
                this.didFswStatusChange = true;
                this.didChangeCellStatusBarItems.fire();
            }),

            vscode.commands.registerCommand(`hermes.notebook.${this.id}.select`, (
                cell: vscode.NotebookCell,
                token?: vscode.CancellationToken
            ) => {
                vscode.window.showQuickPick<FswLanguageProviderQuickPickItem>((async () => {
                    const connectedFsws = await this.validFsws(token);

                    return [
                        {
                            label: 'Automatic',
                            kind: vscode.QuickPickItemKind.Default,
                            detail: 'Automatically selects first avaiable context when one becomes available',
                        },
                        {
                            label: 'Custom',
                            description: 'Manually input execution context',
                            kind: vscode.QuickPickItemKind.Default,
                            detail: 'Use when your FSW or language context is inactive',
                            selectCustom: true
                        },
                        {
                            label: '',
                            kind: vscode.QuickPickItemKind.Separator,
                        },
                        ...connectedFsws.map(v => ({
                            label: v.id ?? "(unknown)",
                            context: v.id ?? undefined,
                            kind: vscode.QuickPickItemKind.Default,
                        } satisfies FswLanguageProviderQuickPickItem))
                    ] satisfies FswLanguageProviderQuickPickItem[];
                })(), {
                    title: 'Select target connection',
                    canPickMany: false
                }).then((value) => {
                    if (value) {
                        this.didFswStatusChange = true;
                        if (value.selectCustom) {
                            vscode.window.showInputBox({
                                title: 'Connection Name',
                                prompt: 'FSW ID to execute cell on'
                            }).then((manualId) => {
                                if (manualId) {
                                    setCellFsw(cell, manualId);
                                }
                            });
                        } else {
                            setCellFsw(cell, value.context);
                        }
                    }
                });
            }),
        ];
    }

    /**
     * Parse the document and yield out each parsed command to send to the FSW connection
     * @param code Code cell to parse
     * @param token cancellation token
     */
    abstract parse(
        cell: vscode.NotebookCell,
        token: vscode.CancellationToken,
    ): AsyncIterable<CommandValue>;

    /**
     * Convert a set of commands to a sequence object
     * This should be extended by applying metadata after the this call
     * @param cell Notebook cell
     * @param commands commands generated by {@link parse}
     * @returns a command sequence with metadata
     */
    sequence(
        cell: vscode.NotebookCell,
        commands: CommandValue[]
    ): Hermes.CommandSequence {
        return {
            commands,
            language: cell.document.languageId,
            metadata: {},
        };
    }

    /**
     * Overridable behavior to command the FSW
     * This function is called after the flight software is chosen by the UI
     * and the commands have been parsed/validated.
     * 
     * By default this will call out to {@link Hermes.Fsw["sequence"]} but behavior can be
     * overridden for example to force immediate commanding.
     * 
     * @param cell Notebook cell being executed
     * @param fsw Flight software to command
     * @param seq Parsed command sequence
     * @param token Cancellation token
     * @returns Promise to boolean indicated success/failure
     */
    async executeSequence(
        cell: vscode.NotebookCell,
        fsw: Hermes.Fsw,
        seq: Hermes.CommandSequence,
        token: vscode.CancellationToken
    ): Promise<boolean> {
        if (!fsw.sequence) {
            throw new Error(`FSW connection ${fsw.id} does not support commanding`);
        }

        return await fsw.sequence(seq, token);
    }

    private async getFsw(cell: vscode.NotebookCell, token?: vscode.CancellationToken): Promise<Hermes.Fsw | undefined> {
        const allFsws = await this.validFsws(token);

        const fswName = cell.metadata.hermes?.fsw as string | undefined;
        if (fswName) {
            return allFsws.find(v => v.id === fswName);
        } else {
            return allFsws[0];
        }
    }

    async execute(
        cell: vscode.NotebookCell,
        execution: vscode.NotebookCellExecution,
        token: vscode.CancellationToken,
    ): Promise<boolean> {
        const fsw = await this.getFsw(cell, token);
        if (!fsw) {
            throw new Error("No target FSW set on this cell (or connected)");
        }

        const output = evrOutput(execution, this.api, fsw);

        try {
            const commands: CommandValue[] = [];
            for await (const cmd of this.parse(cell, token)) {
                commands.push(cmd);
            }

            return await this.executeSequence(cell, fsw, this.sequence(cell, commands), token);
        } finally {
            // Wait for a short amount of time to flush the EVRs through
            await new Promise((resolve) => setTimeout(resolve, 50));
            output.dispose();
        }
    }

    async provideCellStatusBarItems(
        cell: vscode.NotebookCell,
        token: vscode.CancellationToken,
    ): Promise<vscode.NotebookCellStatusBarItem[]> {
        if (!this.didFswStatusChange) {
            return [...this.statusBarItems];
        }

        const item = new vscode.NotebookCellStatusBarItem(
            '',
            vscode.NotebookCellStatusBarAlignment.Left
        );

        item.command = {
            title: 'Select Context',
            command: `hermes.notebook.${this.id}.select`,
            arguments: [
                cell,
                token,
            ]
        };

        const fsw = await this.getFsw(cell, token);
        const auto = cell.metadata.hermes?.fsw === undefined;

        if (fsw) {
            if (auto) {
                item.text = `$(vm) ${fsw.id}`;
            } else {
                item.text = `$(vm-active) ${fsw.id}`;
            }

            item.tooltip = fsw.type;
        } else if (cell.metadata.hermes?.fsw) {
            item.text = `$(debug-disconnect) ${cell.metadata.hermes?.fsw}`;
            item.tooltip = `${cell.metadata.hermes?.fsw} is not connected`;
        } else {
            item.text = '$(circle-large-outline)';
            item.tooltip = 'No fsw set or connected';
        }

        this.didFswStatusChange = false;
        this.statusBarItems = [item];
        return [...this.statusBarItems];
    }

    dispose() {
        for (const disp of this.subscriptions) {
            disp.dispose();
        }
    }
}
