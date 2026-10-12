import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';
import {
    DisplayEvent,
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

// The part of Core's API that raises YAMCS mode's events. Hermes.Api doesn't declare it.
interface YamcsEventSource {
    onYamcsEvents(handler: (instance: string, events: YamcsEvent[]) => void): vscode.Disposable;
}

// A YAMCS event as a row of a cell's event list
function yamcsDisplayEvent(source: string, event: YamcsEvent): Omit<DisplayEvent, 'severity'> & { severity: string } {
    const time = event.generationTime;
    return {
        time: Number(time?.seconds ?? 0) * 1000 + (time?.nanos ?? 0) / 1e6,
        // YAMCS has no SCLK
        sclk: NaN,
        source,
        // As in the events panel, YAMCS's source goes in the component column and its type in the name column
        component: event.source ?? '',
        name: event.type ?? '',
        // fprime-yamcs puts an F Prime event's own severity in extra.fprime_severity. We show that one, because
        // the notebook's severity settings and the renderer's row colors use F Prime's severity names. An event
        // YAMCS raised itself has no extra.fprime_severity, so we show YAMCS's severity, which is INFO when
        // YAMCS leaves it out.
        severity: event.extra?.fprime_severity ?? event.severity ?? 'INFO',
        message: event.message ?? '',
    };
}

export abstract class FswNotebookLanguageProvider implements NotebookLanguageProvider {
    didChangeCellStatusBarItems = new vscode.EventEmitter<void>();
    onDidChangeCellStatusBarItems = this.didChangeCellStatusBarItems.event;

    private didFswStatusChange = true;
    private statusBarItems: vscode.NotebookCellStatusBarItem[] = [];

    protected subscriptions: vscode.Disposable[];

    // One listener for each cell that is running on YAMCS mode's connection
    private readonly yamcsListeners = new Set<(events: YamcsEvent[]) => void>();

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
                // This listener runs when YAMCS mode connects, before YAMCS mode sends its subscribers the
                // newest events in YAMCS's archive. A cell lists only the events raised while it runs, so the
                // cells that are running now stop listing events.
                this.yamcsListeners.clear();
            }),

            // One subscription passes YAMCS mode's events to every running cell
            (this.api as Hermes.Api & YamcsEventSource).onYamcsEvents((_, events) => {
                this.yamcsListeners.forEach((listener) => listener(events));
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

    // Adds YAMCS mode's events to the cell's output until the returned disposable is disposed
    private yamcsEvrOutput(output: vscode.NotebookCellExecution, fsw: Hermes.Fsw): vscode.Disposable {
        const out = new vscode.NotebookCellOutput([
            vscode.NotebookCellOutputItem.text('', 'hermes.notebook/evr')
        ]);
        const evrs: string[] = [];

        output.appendOutput(out);

        const listener = (events: YamcsEvent[]) => {
            const shown = events.map((event) => yamcsDisplayEvent(fsw.id, event)).filter((evr) => showEvr(evr.severity));
            evrs.push(...shown.map((evr) => JSON.stringify(evr)));
            output.replaceOutputItems(
                vscode.NotebookCellOutputItem.text(evrs.join('\n'), 'hermes.notebook/evr'),
                out
            );
        };
        this.yamcsListeners.add(listener);
        return { dispose: () => this.yamcsListeners.delete(listener) };
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

        // In YAMCS mode Hermes decodes no events itself, so we list the ones YAMCS raises
        const output = fsw.type === 'yamcs' ? this.yamcsEvrOutput(execution, fsw) : evrOutput(execution, this.api, fsw);

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
