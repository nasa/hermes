import * as vscode from 'vscode';

import * as child_process from 'child_process';

import { VscodeHermes } from '../context';
import { NotebookLanguageProvider } from '@gov.nasa.jpl.hermes/vscode';

export class ShellScriptLanguageProvider implements NotebookLanguageProvider {
    name = 'bash';
    tooltip = 'ShellScript';
    language = 'shellscript';

    constructor(readonly vscodeContext: VscodeHermes) { }

    execute(
        code: vscode.NotebookCell,
        execution: vscode.NotebookCellExecution,
        token: vscode.CancellationToken
    ): Promise<boolean> {
        const text = code.document.getText();
        const stdout = new vscode.NotebookCellOutput([]);
        const stderr = new vscode.NotebookCellOutput([]);

        execution.appendOutput(stdout);
        execution.appendOutput(stderr);

        const extraPath = this.vscodeContext.getShellscriptPaths().join(':');

        return new Promise<boolean>(async (resolve, reject) => {
            // Write the contents of the script to the temp file
            try {
                const bashProcess = child_process.spawn('bash', ['-s'], {
                    cwd: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
                    env: {
                        ...process.env,
                        // "HERMES_HOST": this.vscodeContext.builtinServerClientSettings.hostAddress,
                        // "HERMES_AUTH_METHOD": this.vscodeContext.builtinServerClientSettings.authMethod,
                        "PATH": `${process.env["PATH"]}:${extraPath}`,
                        // ... (this.vscodeContext.builtinServerClientSettings.authMethod === Hermes.Settings.ClientMiddlewareAuthType.USER_PASS) ? {
                        //     "HERMES_USERPASS_B64": this.vscodeContext.builtinServerClientSettings.credentials
                        // } : {
                        //     "HERMES_TOKEN": this.vscodeContext.builtinServerClientSettings.credentials
                        // }
                    }
                });

                // Execute whats in the cell
                bashProcess.stdin.write(text);
                bashProcess.stdin.destroy();

                // Propagate cancellation via CTRL-C
                token.onCancellationRequested(() => {
                    child_process.exec(`pkill -INT -P ${bashProcess.pid}`);
                });

                bashProcess.stdout.on('data', (data) => {
                    execution.appendOutputItems(
                        vscode.NotebookCellOutputItem.stdout(data.toString()),
                        stdout
                    );
                });

                bashProcess.stderr.on('data', (data) => {
                    execution.appendOutputItems(
                        vscode.NotebookCellOutputItem.stderr(data.toString()),
                        stderr
                    );
                });

                await Promise.all([
                    new Promise(resolve => bashProcess.stdout.on('end', resolve)),
                    new Promise(resolve => bashProcess.stderr.on('end', resolve)),
                    new Promise(resolve => bashProcess.once(`close`, resolve))
                ]);

                if ((bashProcess.exitCode ?? 0) !== 0) {
                    throw new Error(`Process exited with ${bashProcess.exitCode}`);
                }

                resolve(!token.isCancellationRequested);
            } catch (e) {
                reject(e);
            }
        });
    }
}
