import * as vscode from 'vscode';

/**
 * A NotebookLanguageProvider provides Hermes with a mechanism for executing code in a code
 * cell. This is very generic because code other than a "sequence of commands" may be used in
 * an Hermes notebook (think Python, TypeScript, ShellScript/Bash code blocks).
 * 
 * Language providers may extend {@link vscode.NotebookCellStatusBarItemProvider} to prompt the
 * cell with additional parameters such as a target to execute on (such as a FSW connection)
 * or other language related parameters such as dictionary etc.
 */
export interface NotebookLanguageProvider extends Partial<vscode.NotebookCellStatusBarItemProvider>, Partial<vscode.Disposable> {
    /**
     * Execute the code in the code cell
     * @param cell notebook cell to execute
     * @param execution notebook cell execution for writing outputs
     * @param token execution cancellation token
     */
    execute(
        cell: vscode.NotebookCell,
        execution: vscode.NotebookCellExecution,
        token: vscode.CancellationToken
    ): Promise<boolean>;
}
