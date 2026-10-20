import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { componentAndName, type YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';
import {
    DisplayEvent,
    Proto,
} from '@gov.nasa.jpl.hermes/types';
import { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { showEvr } from '../settings';
import { CommandStatuses } from './commandStatus';
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
        ...componentAndName(event),
        // fprime-yamcs puts an F Prime event's own severity in extra.fprime_severity. We show that one, because
        // the notebook's severity settings use F Prime's severity names. Any other event has no
        // extra.fprime_severity, so we show YAMCS's severity, which is INFO when YAMCS leaves it out.
        severity: event.extra?.fprime_severity ?? event.severity ?? 'INFO',
        message: event.message ?? '',
    };
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

    // In YAMCS mode Hermes decodes no events itself, so we list the ones YAMCS raises
    if (fsw.type === 'yamcs') {
        // YAMCS mode sends the newest events in YAMCS's archive when its first handler subscribes. The events panel
        // subscribes when Hermes starts, so a cell is never that handler, and subscribing here doesn't put the
        // archived events in the cell's list.
        const listing = (api as Hermes.Api & YamcsEventSource).onYamcsEvents((instance, events) => {
            // We list only the events of the cell's instance. YAMCS mode sends every instance's events to each
            // handler, and names an instance's connection yamcs:<instance>.
            if (fsw.id !== `yamcs:${instance}`) {
                return;
            }
            const shown = events.map((event) => yamcsDisplayEvent(fsw.id, event)).filter((evr) => showEvr(evr.severity));
            if (shown.length) {
                evrs.push(...shown.map((evr) => JSON.stringify(evr)));
                output.replaceOutputItems(
                    vscode.NotebookCellOutputItem.text(evrs.join('\n'), 'hermes.notebook/evr'),
                    out
                );
            }
        });
        // When YAMCS mode reconnects, it sends the archived events to every handler. Hermes first reports that the
        // cell's connection is gone, and we stop listing then.
        const gone = api.onFswChange((connections) => {
            if (!connections.includes(fsw)) {
                listing.dispose();
            }
        });
        return { dispose: () => [listing, gone].forEach((subscription) => subscription.dispose()) };
    }

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

function severalYamcs(fsws: Hermes.Fsw[]): boolean {
    return fsws.filter((f) => f.type === 'yamcs').length > 1;
}

export abstract class FswNotebookLanguageProvider implements NotebookLanguageProvider {
    didChangeCellStatusBarItems = new vscode.EventEmitter<void>();
    onDidChangeCellStatusBarItems = this.didChangeCellStatusBarItems.event;

    // VS Code asks for a cell's status bar item every time the cell changes, so we keep the list of
    // connections between calls and list them again only after they change
    private statusBarFsws?: Promise<Hermes.Fsw[]>;
    private readonly commandStatuses: CommandStatuses;

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
        this.commandStatuses = new CommandStatuses(id);
        this.subscriptions = [
            this.commandStatuses,
            this.api.onFswChange(() => {
                this.statusBarFsws = undefined;
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
                            detail: 'Selects the first available connection, or none while several YAMCS instances are connected',
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
     * Parse the document and yield out each parsed command to send to the FSW connection,
     * with the range of the command's text in the cell
     * @param code Code cell to parse
     * @param token cancellation token
     */
    abstract parse(
        cell: vscode.NotebookCell,
        token: vscode.CancellationToken,
    ): AsyncIterable<[CommandValue, vscode.Range]>;

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
     * @param onState Shows each command's status in the cell
     * @param _onWait Shows in the cell how long the next command waits before it is issued, in milliseconds. The cell finds
     * the next command from the states that onState receives, so call this only on a connection that reports states.
     * @returns Promise to boolean indicated success/failure
     */
    async executeSequence(
        cell: vscode.NotebookCell,
        fsw: Hermes.Fsw,
        seq: Hermes.CommandSequence,
        token: vscode.CancellationToken,
        onState?: Hermes.CommandStateHandler,
        _onWait?: (ms: number) => void
    ): Promise<boolean> {
        if (!fsw.sequence) {
            throw new Error(`FSW connection ${fsw.id} does not support commanding`);
        }

        return await fsw.sequence(seq, token, onState);
    }

    private getFsw(cell: vscode.NotebookCell, allFsws: Hermes.Fsw[]): Hermes.Fsw | undefined {
        const fswName = cell.metadata.hermes?.fsw as string | undefined;
        if (fswName) {
            return allFsws.find(v => v.id === fswName);
        } else if (severalYamcs(allFsws)) {
            // Automatic would pick the first connection, which may be the wrong instance, so with several YAMCS
            // instances it picks none
            return undefined;
        } else {
            return allFsws[0];
        }
    }

    async execute(
        cell: vscode.NotebookCell,
        execution: vscode.NotebookCellExecution,
        token: vscode.CancellationToken,
    ): Promise<boolean> {
        const run = this.commandStatuses.run(cell);
        const allFsws = await this.validFsws(token);
        if (!cell.metadata.hermes?.fsw && severalYamcs(allFsws)) {
            throw new Error("Several YAMCS instances are connected. Pick this cell's target from its status bar.");
        }
        const fsw = this.getFsw(cell, allFsws);
        if (!fsw) {
            throw new Error("No target FSW set on this cell (or connected)");
        }

        const output = evrOutput(execution, this.api, fsw);

        try {
            const commands: CommandValue[] = [];
            for await (const [cmd, range] of this.parse(cell, token)) {
                commands.push(cmd);
                run.add(range);
            }

            return await this.executeSequence(cell, fsw, this.sequence(cell, commands), token, run.report, run.wait);
        } finally {
            run.stop();
            // Wait for a short amount of time to flush the EVRs through. In YAMCS mode a command without verifiers
            // ends once YAMCS has sent it, and the flight software's events for it can reach Hermes about a second
            // later, so we wait a second there.
            await new Promise((resolve) => setTimeout(resolve, fsw.type === 'yamcs' ? 1000 : 50));
            output.dispose();
        }
    }

    async provideCellStatusBarItems(
        cell: vscode.NotebookCell,
        token: vscode.CancellationToken,
    ): Promise<vscode.NotebookCellStatusBarItem[]> {
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

        this.statusBarFsws ??= this.validFsws();
        const fsw = this.getFsw(cell, await this.statusBarFsws);
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

        return [item];
    }

    dispose() {
        for (const disp of this.subscriptions) {
            disp.dispose();
        }
    }
}
