import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';

// One command of a running cell
interface CellCommand {
    // The text of the command's line, and the line's last character, where we draw its status
    text: string;
    range: vscode.Range;
    // When the cell finishes waiting to issue the command, unset if the cell has not waited
    sendsAt?: number;
    // When the cell's connection first reported on the command, and the command's newest state
    started?: number;
    state?: Hermes.CommandState;
    // When the command ended, unset while it is in flight
    ended?: number;
}

// A command's status from a cell's last run, as the cell's metadata saves it in hermes.statuses
interface SavedStatus {
    // The command's line, and the line's text when the cell ran
    line: number;
    text: string;
    // The status drawn after the line, and what the connection recorded for the command, shown on hover
    status: string;
    detail: string;
}

/**
 * Shows the status of each command of a cell after the command's line. The statuses are
 * decorations, which an editor draws without changing its document.
 */
export class CommandStatuses implements vscode.Disposable {
    private readonly decoration = vscode.window.createTextEditorDecorationType({
        after: { margin: '0 0 0 3em', color: new vscode.ThemeColor('editorCodeLens.foreground') },
    });
    // The statuses of each cell, by the cell's document
    private readonly shown = new WeakMap<vscode.TextDocument, vscode.DecorationOptions[]>();
    private readonly subscriptions = [
        this.decoration,
        // We only draw on the visible editors, so we draw again when other editors become visible
        vscode.window.onDidChangeVisibleTextEditors((editors) => this.draw(editors)),
        // When a cell's text is edited, we draw only the saved statuses whose lines haven't changed. VS Code also fires
        // this event when something other than a document's text changes, such as its dirty state, so we look for
        // content changes.
        vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges.length && this.shown.get(e.document)?.length) {
                this.show(e.document, savedStatuses(e.document));
            }
        }),
    ];

    constructor(private readonly language: string) {
        // A notebook can open before we start, so we draw on the cells that are already visible
        this.draw(vscode.window.visibleTextEditors);
    }

    /**
     * Clears the statuses that a cell's last run left, and returns the run that shows the new ones
     */
    run(cell: vscode.NotebookCell): CellRun {
        this.show(cell.document, []);
        return new CellRun(this, cell);
    }

    show(document: vscode.TextDocument, statuses: vscode.DecorationOptions[]) {
        this.shown.set(document, statuses);
        this.draw(vscode.window.visibleTextEditors.filter((editor) => editor.document === document));
    }

    private draw(editors: readonly vscode.TextEditor[]) {
        // Each cell language has a CommandStatuses of its own, so we draw only on the cells of our language
        for (const editor of editors.filter((e) => e.document.languageId === this.language)) {
            // A cell that hasn't run since its notebook opened shows the statuses saved in its metadata
            const statuses = this.shown.get(editor.document) ?? savedStatuses(editor.document);
            this.shown.set(editor.document, statuses);
            editor.setDecorations(this.decoration, statuses);
        }
    }

    dispose() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
    }
}

/**
 * One run of a cell, which draws the status of each of the cell's commands
 */
class CellRun {
    private readonly commands: CellCommand[] = [];
    private readonly version: number;
    private timer?: ReturnType<typeof setInterval>;

    constructor(
        private readonly statuses: CommandStatuses,
        private readonly cell: vscode.NotebookCell,
    ) {
        this.version = cell.document.version;
        // A new run replaces the statuses that the cell's last run saved. We clear them now, because a run whose
        // connection reports nothing, as in Local and Remote modes, saves none when it stops.
        if (cell.metadata.hermes?.statuses?.length) {
            this.save();
        }
    }

    /**
     * Adds the cell's next command, which sits at range in the cell
     */
    add(range: vscode.Range) {
        const line = this.cell.document.lineAt(range.end.line);
        this.commands.push({ text: line.text, range: lastCharacter(line) });
    }

    /**
     * Receives how long the cell waits before it issues its next command
     */
    readonly wait = (ms: number) => {
        this.current().sendsAt = Date.now() + ms;
        this.update();
    };

    /**
     * Receives a command's state from the cell's connection
     */
    readonly report: Hermes.CommandStateHandler = (state) => {
        const command = this.current();
        command.started ??= Date.now();
        command.state = state;
        if (state.passed) {
            command.ended = Date.now();
        }
        this.update();
    };

    /**
     * Stops the redraw timer and saves the statuses when the cell's run ends
     */
    stop() {
        // The timer is unset when the cell has not waited and its connection reported nothing, as in Local and Remote
        // modes, and then we draw and save no statuses
        if (!this.timer) {
            return;
        }
        clearInterval(this.timer);
        for (const command of this.commands) {
            // A command whose wait the cell was counting down shows not sent from here on
            command.sendsAt = undefined;
            // A command that is still in flight ends here, without a result
            command.ended ??= Date.now();
        }
        this.draw();
        this.save();
    }

    // Saves each command's status and steps in the cell's metadata, which the notebook file keeps
    private save() {
        // A command that shows ○ not sent has no steps, so we leave it out
        const statuses: SavedStatus[] = this.commands.filter((c) => c.state).map((c) => ({
            line: c.range.start.line,
            text: c.text,
            status: this.status(c),
            detail: c.state!.detail,
        }));
        const edit = new vscode.WorkspaceEdit();
        // updateCellMetadata replaces the cell's metadata, so we copy in the rest of it, such as the cell's target
        edit.set(this.cell.notebook.uri, [vscode.NotebookEdit.updateCellMetadata(this.cell.index, {
            ...this.cell.metadata,
            hermes: { ...this.cell.metadata.hermes, statuses },
        })]);
        vscode.workspace.applyEdit(edit);
    }

    // A cell's commands are issued one at a time and in order, so the cell is working on the first command that hasn't passed
    private current(): CellCommand {
        return this.commands.find((c) => !c.state?.passed)!;
    }

    // Draws the statuses now and from then on ten times a second, so the time of a wait or of a command in flight advances
    private update() {
        this.timer ??= setInterval(() => this.draw(), 100);
        this.draw();
    }

    private status(command: CellCommand): string {
        if (!command.state) {
            if (command.sendsAt === undefined) {
                return '○ not sent';
            }
            // The wait can run out a moment before the command's first report comes, and then we show 0.0
            const seconds = Math.max(command.sendsAt - Date.now(), 0) / 1000;
            return `◷ sends in ${seconds.toFixed(1)} s`;
        }
        const { label, passed } = command.state;
        if (passed === false) {
            return `✗ ${label}`;
        }
        const seconds = (((command.ended ?? Date.now()) - command.started!) / 1000).toFixed(1);
        // A command that ended without passing or failing has a result we don't know
        return `${passed ? '✓' : command.ended === undefined ? '●' : '?'} ${label} · ${seconds} s`;
    }

    private draw() {
        // Our ranges are for the cell's text as it was when the run started, so we stop drawing once that text has changed
        if (this.cell.document.version !== this.version) {
            return;
        }
        this.statuses.show(this.cell.document, this.commands.map((c) => ({
            range: c.range,
            renderOptions: { after: { contentText: this.status(c) } },
            hoverMessage: c.state && new vscode.MarkdownString().appendCodeblock(c.state.detail),
        })));
    }
}

// The statuses saved in the metadata of the cell with this document, for the commands whose lines still have the text
// they had when the cell ran
function savedStatuses(document: vscode.TextDocument): vscode.DecorationOptions[] {
    const cell = vscode.workspace.notebookDocuments.flatMap((notebook) => notebook.getCells()).find((c) => c.document === document);
    const saved: SavedStatus[] = cell?.metadata.hermes?.statuses ?? [];
    return saved.filter(({ line, text }) => line < document.lineCount && document.lineAt(line).text === text).map((s) => ({
        range: lastCharacter(document.lineAt(s.line)),
        renderOptions: { after: { contentText: s.status } },
        hoverMessage: new vscode.MarkdownString().appendCodeblock(s.detail),
    }));
}

// A decoration's range must not be empty, so we decorate a line's last character, and the status draws after it
function lastCharacter(line: vscode.TextLine): vscode.Range {
    const end = line.range.end;
    return new vscode.Range(end.line, end.character - 1, end.line, end.character);
}
