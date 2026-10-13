import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';

// One command of a running cell
interface CellCommand {
    // The command's text in the cell, and the last character of its line, where we draw its status
    text: string;
    range: vscode.Range;
    // What the cell's connection has reported: when its first report came, and the command's newest state
    started?: number;
    state?: Hermes.CommandState;
    // When the command ended, unset while it is in flight
    ended?: number;
}

/**
 * Shows the status of each command of a cell after the command's line. The statuses are
 * decorations, which an editor draws without changing its document.
 */
export class CommandStatuses implements vscode.Disposable {
    private readonly decoration = vscode.window.createTextEditorDecorationType({
        after: { margin: '0 0 0 3em', color: new vscode.ThemeColor('editorCodeLens.foreground') },
    });
    // The statuses of each cell that has run, by the cell's document. A notebook that is closed and opened again gets
    // new documents, so it starts without statuses.
    private readonly shown = new WeakMap<vscode.TextDocument, vscode.DecorationOptions[]>();
    private readonly subscriptions = [
        this.decoration,
        // We only draw on the visible editors, so we draw again when other editors become visible
        vscode.window.onDidChangeVisibleTextEditors((editors) => this.draw(editors)),
        // We clear a cell's statuses when its text is edited. VS Code also fires this event when something
        // other than a document's text changes, such as its dirty state, so we look for content changes.
        vscode.workspace.onDidChangeTextDocument((e) => {
            if (e.contentChanges.length && this.shown.get(e.document)?.length) {
                this.show(e.document, []);
            }
        }),
    ];

    /**
     * Clears the statuses that a cell's last run left, and returns the run that shows the new ones
     */
    run(cell: vscode.NotebookCell, execution: vscode.NotebookCellExecution): CellRun {
        this.show(cell.document, []);
        return new CellRun(this, cell, execution);
    }

    show(document: vscode.TextDocument, statuses: vscode.DecorationOptions[]) {
        this.shown.set(document, statuses);
        this.draw(vscode.window.visibleTextEditors.filter((editor) => editor.document === document));
    }

    private draw(editors: readonly vscode.TextEditor[]) {
        for (const editor of editors) {
            const statuses = this.shown.get(editor.document);
            if (statuses) {
                editor.setDecorations(this.decoration, statuses);
            }
        }
    }

    dispose() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
    }
}

/**
 * One run of a cell. While the cell runs we show each command's status after its line.
 */
class CellRun {
    private readonly commands: CellCommand[] = [];
    private readonly version: number;
    private timer?: ReturnType<typeof setInterval>;

    constructor(
        private readonly statuses: CommandStatuses,
        private readonly cell: vscode.NotebookCell,
        private readonly execution: vscode.NotebookCellExecution,
    ) {
        this.version = cell.document.version;
    }

    /**
     * Adds the cell's next command, which sits at range in the cell
     */
    add(range: vscode.Range) {
        const end = this.cell.document.lineAt(range.end.line).range.end;
        // A decoration's range must not be empty, so we decorate the line's last character, and the status draws after it
        const last = new vscode.Range(end.line, end.character - 1, end.line, end.character);
        this.commands.push({ text: this.cell.document.getText(range), range: last });
    }

    /**
     * Receives a command's state from the cell's connection. A connection that reports no state,
     * as in Local and Remote modes, never calls this, so the cell gets no statuses.
     */
    readonly report: Hermes.CommandStateHandler = (state) => {
        // A cell's commands are issued one at a time and in order, so the state is for the first command that hasn't passed
        const command = this.commands.find((c) => !c.state?.passed)!;
        command.started ??= Date.now();
        command.state = state;
        if (state.passed) {
            command.ended = Date.now();
            // Editing the cell clears its statuses but not its output, so a command that passed also gets a line in
            // the output. A command that didn't pass is named in the cell's error.
            const line = `${command.text}  ${this.status(command)}`;
            this.execution.appendOutput(new vscode.NotebookCellOutput([vscode.NotebookCellOutputItem.text(line)]));
        }
        this.update();
    };

    /**
     * Stops the redraw timer when the cell's run ends
     */
    stop() {
        // The timer is unset when the cell's connection reported nothing, and then we draw no statuses
        if (!this.timer) {
            return;
        }
        clearInterval(this.timer);
        for (const command of this.commands) {
            // A command that is still in flight ends here, without a result
            command.ended ??= Date.now();
        }
        this.draw();
    }

    // Draws the statuses now and from then on ten times a second, so the time of a command in flight advances
    private update() {
        this.timer ??= setInterval(() => this.draw(), 100);
        this.draw();
    }

    private status(command: CellCommand): string {
        if (!command.state) {
            return '○ not sent';
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
