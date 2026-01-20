import * as vscode from 'vscode';

export function mergeWorkspaceEdits(
    a: vscode.WorkspaceEdit | undefined,
    b: vscode.WorkspaceEdit | undefined
): vscode.WorkspaceEdit {
    const allEdits = new Map<string, vscode.TextEdit[]>(
        a?.entries().map(([uri, edits]) => [uri.toString(), edits])
    );

    for (const [uri, edits] of (b?.entries() ?? [])) {
        const uriStr = uri.toString();
        let entries = allEdits.get(uriStr);
        if (!entries) {
            entries = edits;
        } else {
            entries.push(...edits);
        }

        allEdits.set(uriStr, entries);
    }

    const out = new vscode.WorkspaceEdit();
    for (const [uriStr, edits] of allEdits.entries()) {
        out.set(vscode.Uri.parse(uriStr), edits);
    }

    return out;
}
