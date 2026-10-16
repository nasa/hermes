import { expect, jest, test } from '@jest/globals';

// Jest swaps 'vscode' for the stub in src/fallback/vscode, which has no notebook classes, so we mock the ones
// the serializer uses.
jest.mock('vscode', () => ({
    NotebookCellKind: { Markup: 1, Code: 2 },
    NotebookData: class { constructor(readonly cells: object[]) { } },
    NotebookCellData: class { constructor(readonly kind: number, public value: string, readonly languageId: string) { } },
    NotebookCellOutput: class { constructor(readonly items: object[]) { } },
    NotebookCellOutputItem: class { constructor(readonly data: Uint8Array, readonly mime: string) { } },
}));

import * as vscode from 'vscode';
import { HermesNotebookSerializer } from '../src/notebook/HermesNotebookSerializer';

test('loads every output of a saved cell, each with the text it had when it was saved', async () => {
    const output = (text: string, mime: string) => new vscode.NotebookCellOutput([
        new vscode.NotebookCellOutputItem(new TextEncoder().encode(text), mime),
    ]);
    const cell = new vscode.NotebookCellData(vscode.NotebookCellKind.Code, 'CMD_NO_OP', 'fprime');
    // An event list with no rows, then the error of a failed command
    cell.outputs = [output('', 'hermes.notebook/evr'), output('Error: EXECUTION_ERROR', 'text/plain')];
    const token: vscode.CancellationToken = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => { } }) };

    const serializer = new HermesNotebookSerializer();
    const saved = await serializer.serializeNotebook(new vscode.NotebookData([cell]), token);
    const loaded = await serializer.deserializeNotebook(saved, token);

    const texts = loaded.cells[0].outputs?.map((loadedOutput) => new TextDecoder().decode(loadedOutput.items[0].data));
    expect(texts).toEqual(['', 'Error: EXECUTION_ERROR']);
});
