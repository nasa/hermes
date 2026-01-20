import * as vscode from 'vscode';
import { DisplayEvent } from '@gov.nasa.jpl.hermes/types';

import { TextDecoder, TextEncoder } from 'util';

interface RawSeqNotebookHeader {
    language: string;
    kind: vscode.NotebookCellKind;
    metadata?: Record<string, any>;
}

export class FPrimeNotebookSerializer implements vscode.NotebookSerializer {
    async deserializeNotebook(
        content: Uint8Array,
        _token: vscode.CancellationToken
    ): Promise<vscode.NotebookData> {
        const contents = new TextDecoder().decode(content);
        const encoder = new TextEncoder();

        const file = contents.split('\n');

        // Cells are divided by ';?=' markers lines
        // Like MatLab, a section division can be done by starting a line with ;;

        let cell: vscode.NotebookCellData | undefined = undefined;
        const cells: vscode.NotebookCellData[] = [];
        let evrOutput: string[] = [];

        for (const line of file) {
            if (line.startsWith(';?=')) { // cell markers
                // This is the start of a new cell
                // This line will contain some metadata about the cell
                const cellMetadata: RawSeqNotebookHeader = JSON.parse(line.substring(3));

                if (cell && evrOutput) {
                    // Push the currently acrued EVRs to the cell
                    cell.outputs = [new vscode.NotebookCellOutput([
                        new vscode.NotebookCellOutputItem(
                            encoder.encode(evrOutput.join('\n')),
                            'hermes.notebook/evr')
                    ])];
                    cells.push(cell);
                }

                evrOutput = [];
                cell = new vscode.NotebookCellData(
                    cellMetadata.kind,
                    '',
                    cellMetadata.language
                );

                cell.metadata = cellMetadata.metadata;
            } else if (line.startsWith(';?s')) { // manual whitespace
            } else if (line.startsWith(';?e')) { // evrs
                if (!cell) {
                    continue;
                }

                if (!cell.outputs) {
                    cell.outputs = [];
                }

                evrOutput.push(line.substring(3));
            } else { // code / content line
                if (!cell) {
                    evrOutput = [];
                    cell = new vscode.NotebookCellData(
                        vscode.NotebookCellKind.Code,
                        line.substring(2),
                        'fprime'
                    );
                } else {
                    // Append to the aready generating cell
                    if (cell.value) {
                        cell.value += '\n';
                    }

                    if (cell.kind === vscode.NotebookCellKind.Markup) {
                        // Don't add the '; '
                        cell.value += line.substring(2);
                    } else {
                        // Raw code block
                        // Add the entire line to the value
                        cell.value += line;
                    }
                }
            }
        }

        if (cell && evrOutput) {
            cell.outputs = [
                new vscode.NotebookCellOutput([
                    new vscode.NotebookCellOutputItem(
                        encoder.encode(evrOutput.join('\n')),
                        'hermes.notebook/evr'
                    )
                ])
            ];
        }

        if (cell) {
            cells.push(cell);
        }

        return new vscode.NotebookData(cells);
    }

    async serializeNotebook(
        data: vscode.NotebookData,
        _token: vscode.CancellationToken
    ): Promise<Uint8Array> {
        const contents: string[] = [];
        const decoder = new TextDecoder();

        let firstCell = true;
        for (const cell of data.cells) {
            const header: RawSeqNotebookHeader = {
                language: cell.languageId,
                kind: cell.kind,
                metadata: Object.keys(cell.metadata ?? {}).length > 0 ? cell.metadata : undefined
            };

            if (!firstCell) {
                contents.push(';?s');
            }

            firstCell = false;

            contents.push(';?= ' + JSON.stringify(header));
            for (const line of cell.value.split('\n')) {
                if (cell.kind === vscode.NotebookCellKind.Markup) {
                    contents.push('; ' + line);
                } else {
                    contents.push(line);
                }
            }

            for (const output of cell.outputs ?? []) {
                for (const item of output.items) {
                    // TODO(tumbar) Implement more output mimes
                    if (item.mime === 'hermes.notebook/evr' && item.data.length > 0) {
                        const evrs = decoder.decode(item.data).split('\n').map(v => JSON.parse(v) as DisplayEvent);
                        for (const evr of evrs) {
                            contents.push(';?e ' + JSON.stringify(evr));
                        }
                    }
                }
            }
        }

        return new TextEncoder().encode(contents.join('\n'));
    }
}
