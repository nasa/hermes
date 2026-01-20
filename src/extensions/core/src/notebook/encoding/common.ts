import * as vscode from 'vscode';

export interface CellNotebookHeader {
    language: string;
    kind: vscode.NotebookCellKind;
    metadata: Record<string, any> | null;
}
