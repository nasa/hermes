import * as vscode from 'vscode';
import { exec, ExecException } from 'child_process';
import { join } from "path";

// Blatantly stolen from https://github.com/microsoft/vscode/issues/48674
// Get your shit together Microsoft!

// TODO: https://github.com/TomasHubelbauer/vscode-extension-findFilesWithExcludes
// TODO: https://github.com/Microsoft/vscode/issues/48674 for finding MarkDown files that VS Code considers not ignored
// TODO: https://github.com/Microsoft/vscode/issues/47645 for finding MarkDown files no matter the extension (VS Code language to extension)
// TODO: https://github.com/Microsoft/vscode/issues/11838 for maybe telling if file is MarkDown using an API
// TODO: https://github.com/Microsoft/vscode/blob/release/1.27/extensions/git/src/api/git.d.ts instead of Git shell if possible
export async function findNonIgnoredFiles(
    pattern: string,
    token?: vscode.CancellationToken,
    checkGitIgnore = true
) {
    const exclude = [
        ...Object.keys(await vscode.workspace.getConfiguration('search', null).get('exclude') || {}),
        ...Object.keys(await vscode.workspace.getConfiguration('files', null).get('exclude') || {})
    ].join(',');

    const uris = await vscode.workspace.findFiles(pattern, `{${exclude}}`, undefined, token);
    if (!checkGitIgnore) {
        return uris;
    }

    const workspaceRelativePaths = uris.map(uri => vscode.workspace.asRelativePath(uri, false));
    for (const workspaceDirectory of vscode.workspace.workspaceFolders ?? []) {
        const workspaceDirectoryPath = workspaceDirectory.uri.fsPath;
        try {
            const { stdout, stderr } = await new Promise<{ stdout: string, stderr: string }>((resolve, reject) => {
                const searchProcess = exec(
                    `git check-ignore ${workspaceRelativePaths.join(' ')}`,
                    { cwd: workspaceDirectoryPath },
                    // https://git-scm.com/docs/git-check-ignore#_exit_status
                    (error: null | ExecException, stdout, stderr) => {
                        killDisposable?.dispose();
                        if (error && (error.code !== 0 && error.code !== 1)) {
                            reject(error);
                            return;
                        }

                        resolve({ stdout, stderr });
                    },
                );

                const killDisposable = token?.onCancellationRequested(() => {
                    searchProcess.kill();
                });
            });

            if (stderr) {
                throw new Error(stderr);
            }

            for (let relativePath of stdout.split('\n')) {
                // Remove quotes if they exist
                if (relativePath[0] === '"' || relativePath[0] === "'") {
                    relativePath = relativePath.slice(1);
                }
                if (relativePath[relativePath.length - 1] === '"' || relativePath[relativePath.length - 1] === "'") {
                    relativePath = relativePath.slice(0, -1);
                }

                const uri = vscode.Uri.file(join(workspaceDirectoryPath, relativePath));
                const index = uris.findIndex(u => u.fsPath === uri.fsPath);
                if (index > -1) {
                    uris.splice(index, 1);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    return uris;
}
