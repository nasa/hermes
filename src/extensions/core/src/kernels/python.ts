import * as vscode from 'vscode';
import * as child_process from 'child_process';
import { VscodeHermes } from '../context';
import { NotebookLanguageProvider } from '@gov.nasa.jpl.hermes/vscode';

export class PythonLanguageProvider implements NotebookLanguageProvider {
    name = 'python';
    tooltip = 'Python';
    language = 'python';

    constructor(private vscodeContext: VscodeHermes) { }

    async execute(
        code: vscode.NotebookCell,
        execution: vscode.NotebookCellExecution,
        token: vscode.CancellationToken
    ): Promise<boolean> {
        const text = code.document.getText();
        const stdout = new vscode.NotebookCellOutput([]);
        const stderr = new vscode.NotebookCellOutput([]);
        execution.appendOutput(stdout);
        execution.appendOutput(stderr);

        // Get the interpreter path from the Python extension only.
        let interpreterPath: string | undefined;
        try {
            const pythonExt = vscode.extensions.getExtension('ms-python.python');
            if (pythonExt) {
                if (!pythonExt.isActive) {
                    await pythonExt.activate();
                }
                const pythonApi = pythonExt.exports;
                if (pythonApi && pythonApi.environments && pythonApi.environments.getActiveEnvironmentPath) {
                    const activeEnv = await pythonApi.environments.getActiveEnvironmentPath();
                    // activeEnv may be an object, extract the path property
                    if (activeEnv && typeof activeEnv === 'object' && activeEnv.path) {
                        interpreterPath = activeEnv.path;
                    } else if (typeof activeEnv === 'string') {
                        interpreterPath = activeEnv;
                    }
                }
            }
        } catch { /* ignore */ }

        if (!interpreterPath) {
            // If no Python interpreter is selected, show an error notification with an action button.
            // The user can choose "Select Interpreter" to open the interpreter selector, or "Cancel" to dismiss.
            vscode.window.showErrorMessage(
                "No Python interpreter selected. Please select a Python interpreter to continue.",
                "Select Interpreter",
                "Cancel"
            ).then(selection => {
                if (selection === "Select Interpreter") {
                    vscode.commands.executeCommand('python.selectInterpreter');
                }
            });
            return false;
        }

        return new Promise<boolean>((resolve, _reject) => {
            const pythonProcess = child_process.spawn(interpreterPath, ['-u', '-'], {
                cwd: vscode.workspace.workspaceFolders?.[0].uri.fsPath,
                env: { ...process.env },
            });

            pythonProcess.stdin.write(text);
            pythonProcess.stdin.end();

            token.onCancellationRequested(() => {
                if (pythonProcess.pid) {
                    try {
                        process.kill(pythonProcess.pid, 'SIGINT');
                    } catch {
                        /* ignore */
                    }
                }
            });

            pythonProcess.stdout.on('data', data => {
                execution.appendOutputItems(
                    [vscode.NotebookCellOutputItem.stdout(data.toString())],
                    stdout
                );
            });

            pythonProcess.stderr.on('data', data => {
                execution.appendOutputItems(
                    [vscode.NotebookCellOutputItem.stderr(data.toString())],
                    stderr
                );
            });

            pythonProcess.on('close', code => {
                resolve(code === 0);
            });

            pythonProcess.on('error', err => {
                execution.appendOutputItems(
                    [vscode.NotebookCellOutputItem.stderr(`Python execution failed: ${err.message}`)],
                    stderr
                );
                resolve(false);
            });
        });
    }
}
