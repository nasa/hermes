import * as vscode from 'vscode';
import moment from 'moment';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Settings } from '@gov.nasa.jpl.hermes/vscode';
import { NotebookLanguageManager } from './NotebookLanguageManager';

export class NotebookController implements vscode.Disposable {
    private readonly controller: vscode.NotebookController;
    private executionOrder = 0;

    constructor(
        private readonly notebookType: string,
        private readonly languageManager: NotebookLanguageManager,
    ) {
        this.controller = vscode.notebooks.createNotebookController(
            `hermes.${notebookType}`,
            this.notebookType,
            'Hermes'
        );

        this.controller.description = 'hermes';
        this.controller.supportsExecutionOrder = true;
        this.controller.executeHandler = this.executeCells.bind(this);
    }

    private static getSignoff(): string {
        // Grab the template from the settings
        let template = Settings.signoffTemplate();
        const dtFormat = Settings.signoffDatetime();
        const name = Settings.signoffName();

        // Format the template
        const datetime = moment().format(dtFormat);
        template = template.replace("{date}", datetime);
        template = template.replace("{name}", name);
        return template;
    }

    // Sets the target connection of every F Prime and YAMCS cell in the active notebook
    private static async setCellTargets(api: Hermes.Api) {
        const notebook = vscode.window.activeNotebookEditor?.notebook;
        if (!notebook) {
            return;
        }
        const ids = (await api.allFsw()).filter((fsw) => fsw.sequence).map((fsw) => fsw.id).sort();
        const fsw = await vscode.window.showQuickPick(ids, { title: 'Target connection for every F Prime and YAMCS cell' });
        if (!fsw) {
            return;
        }

        // Only F Prime and YAMCS cells read a target, so we leave the other cells' metadata alone
        const edit = new vscode.WorkspaceEdit();
        edit.set(notebook.uri, notebook.getCells()
            .filter((cell) => cell.document.languageId === 'fprime' || cell.document.languageId === 'yamcs')
            .map((cell) => vscode.NotebookEdit.updateCellMetadata(cell.index, { ...cell.metadata, hermes: { ...cell.metadata.hermes, fsw } })));
        await vscode.workspace.applyEdit(edit);
    }

    static registerCommands(api: Hermes.Api): vscode.Disposable[] {
        return [
            vscode.commands.registerCommand('hermes.testbed.signoff', async (cell: vscode.NotebookCell) => {
                // Add a signoff to the notebook cell
                const nbEdit = vscode.NotebookEdit.replaceCells(
                    // Replace just this cell with the new contents
                    new vscode.NotebookRange(cell.index, cell.index + 1),
                    [new vscode.NotebookCellData(cell.kind, `${cell.document.getText()}\n\n${NotebookController.getSignoff()}`, 'markdown')]
                );

                const wsEdit = new vscode.WorkspaceEdit();
                wsEdit.set(cell.notebook.uri, [nbEdit]);
                vscode.workspace.applyEdit(wsEdit);
            }),
            vscode.commands.registerCommand('hermes.notebook.setCellTargets', () => NotebookController.setCellTargets(api)),
        ];
    }

    dispose() {
        this.controller.dispose();
    }

    private async executeCells(cells: vscode.NotebookCell[]) {
        for (const cell of cells) {
            const execution = this.controller.createNotebookCellExecution(cell);
            execution.executionOrder = ++this.executionOrder;
            execution.start(Date.now());
            execution.clearOutput();

            let success: boolean;
            try {
                const provider = this.languageManager.get(cell.document.languageId);
                if (!provider) {
                    throw new Error(`No language execution provider registered for '${cell.document.languageId}'`);
                }

                success = await provider.execute(cell, execution, execution.token);
            } catch (e) {
                success = false;
                console.error(e);
                execution.appendOutput(
                    new vscode.NotebookCellOutput([
                        vscode.NotebookCellOutputItem.text(`${e}`)
                    ])
                );
            }

            execution.end(success, Date.now());
        }
    }
}
