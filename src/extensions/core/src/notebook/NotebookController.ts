import * as vscode from 'vscode';
import moment from 'moment';

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

    static registerCommands(): vscode.Disposable[] {
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
            })
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

            let success = true;
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
