import * as vscode from 'vscode';
import { TextDecoder, TextEncoder } from 'util';
import { DisplayEvent, Event, Sourced } from '@gov.nasa.jpl.hermes/types';

import * as Encoding3 from './encoding/3';
import * as Encoding2 from './encoding/2';
import { CellNotebookHeader } from './encoding/common';
import { eventToDisplayEvent } from '@gov.nasa.jpl.hermes/types/src/conversion';


const ENCODING_VERSION = 3.1;

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export class HermesNotebookSerializer implements vscode.NotebookSerializer {
    async serializeNotebook(
        data: vscode.NotebookData,
        _token: vscode.CancellationToken
    ): Promise<Uint8Array> {
        const contents: string[] = [];

        const metaline = (tag: Encoding3.Tag) => {
            return `<!-- hermes: ${JSON.stringify(tag)} -->`;
        };

        contents.push(metaline({ type: Encoding3.TagType.VERSION, value: ENCODING_VERSION }));

        for (const cell of data.cells) {
            contents.push(metaline({
                type: Encoding3.TagType.CELL, value: {
                    language: cell.languageId,
                    kind: cell.kind,
                    metadata: (Object.keys(cell.metadata ?? {}).length > 0 ? cell.metadata : null) ?? null
                }
            }));

            // For code cells, wrap the block in Markdown code block
            if (cell.kind !== vscode.NotebookCellKind.Markup) {
                contents.push('```' + cell.languageId);
            }

            for (const line of cell.value.split('\n')) {
                contents.push(line);
            }

            // Close the cell block
            if (cell.kind !== vscode.NotebookCellKind.Markup) {
                contents.push('```');
            }
            contents.push(metaline({ type: Encoding3.TagType.CELL_END, value: null }));

            // Dump the outputs
            for (const output of cell.outputs ?? []) {
                if (output.items.length === 0) {
                    continue;
                }

                contents.push(metaline({
                    type: Encoding3.TagType.OUTPUT_START, value: output.metadata ?? null
                }));
                for (const item of output.items) {
                    contents.push(metaline({
                        type: Encoding3.TagType.OUTPUT_ITEM, value: { mime: item.mime }
                    }));

                    switch (item.mime) {
                        case 'text/plain':
                        case 'application/vnd.code.notebook.stdout':
                        case 'application/vnd.code.notebook.stderr':
                        case 'application/vnd.code.notebook.error':
                        case 'application/json':
                            contents.push('<details><summary>Execution Outputs</summary><pre>');
                            contents.push(textDecoder.decode(item.data));
                            contents.push('</pre></details>');
                            contents.push('');
                            break;
                        case 'hermes.notebook/evr': {
                            contents.push('<details><summary>Execution Outputs</summary>');
                            contents.push('');
                            contents.push("|Source|Sclk|Time|Severity|Component|Name|Message|");
                            contents.push("|---|---|---|---|---|---|---|");
                            const evrs = textDecoder.decode(item.data).split('\n').map(v => {
                                try {
                                    return JSON.parse(v) as DisplayEvent;
                                } catch {
                                    return null;
                                }
                            }).filter(v => v !== null);
                            const tableRows = evrs.map(evr => (
                                `|${evr.source}|${evr.sclk?.toFixed(6)}|${evr.time?.toFixed(6)}|${evr.severity}|${evr.component}|${evr.name}|${evr.message?.replace(/(\||\n)/g, "&#124;")}|`
                            ));

                            contents.push(...tableRows);
                            if (tableRows.length === 0) {
                                contents.push("");
                            }
                            contents.push('</details>');
                            contents.push('');
                            break;
                        }
                    }

                    contents.push(metaline({ type: Encoding3.TagType.OUTPUT_ITEM_END, value: null }));
                }

                contents.push(metaline({ type: Encoding3.TagType.OUTPUT_END, value: null }));
            }
        }

        return textEncoder.encode(contents.join('\n'));
    }

    async deserializeNotebook(
        content: Uint8Array,
        _token: vscode.CancellationToken
    ): Promise<vscode.NotebookData> {
        const contents = textDecoder.decode(content);

        const file = contents.split('\n');

        const parseMeta = (line: string) => {
            if (!line.startsWith('<!-- hermes: ')) {
                return null;
            } else {
                return <Encoding3.Tag>JSON.parse(line.replace('<!-- hermes: ', '').replace('-->', ''));
            }
        };

        // Get the encoding version
        let versionTag: Encoding3.Tag | null;
        try {
            versionTag = parseMeta(file[0]);
        } catch (e) {
            throw new Error(`Failed to read version from line 1: ${e}`);
        }

        let version: number;
        if (versionTag !== null) {
            if (versionTag.type !== Encoding3.TagType.VERSION) {
                throw new Error(`Expected encoding version: ${JSON.stringify(versionTag)} on line 1: ${file[0]}`);
            }

            version = versionTag.value;
            switch (version) {
                case 3:
                case 3.1:
                    break;
                default:
                    throw new Error(`Encoding version: ${version} is not supported`);
            }
        } else {
            version = 3.1;
        }

        let cell: vscode.NotebookCellData | undefined;
        const cells: vscode.NotebookCellData[] = [];

        let cellContents: string[] = [];
        let outputMime: string | undefined;
        let outputContents: string[] = [];

        const parsingMode: Encoding3.ParsingMode[] = [Encoding3.ParsingMode.CELL];

        for (let lineNo: number = 0; lineNo < file.length; lineNo++) {
            const line = file[lineNo];

            try {
                const metadata = parseMeta(line);
                if (metadata) {
                    switch (metadata.type) {
                        case Encoding3.TagType.VERSION:
                            break; // no-op
                        case Encoding3.TagType.CELL: {
                            // This is the start of a new cell
                            cell = new vscode.NotebookCellData(
                                metadata.value.kind,
                                '',
                                metadata.value.language
                            );

                            cell.metadata = metadata.value.metadata ?? undefined;
                            cells.push(cell);

                            if (cell.kind !== vscode.NotebookCellKind.Markup) {
                                // Skip over '```language'
                                lineNo++;
                            }

                            cellContents = [];
                        }
                            break;
                        case Encoding3.TagType.CELL_END:
                            if (cell!.kind !== vscode.NotebookCellKind.Markup) {
                                // Delete the extra '```' line
                                cellContents.pop();
                            }

                            cell!.value += cellContents.join('\n');
                            break;
                        case Encoding3.TagType.OUTPUT_START:
                            if (!cell) {
                                continue;
                            }

                            cell.outputs = [];
                            break;
                        case Encoding3.TagType.OUTPUT_END:
                            break;
                        case Encoding3.TagType.OUTPUT_ITEM:
                            parsingMode.push(Encoding3.ParsingMode.OUTPUT);
                            outputContents = [];
                            outputMime = metadata.value.mime;
                            lineNo++; // skip the item prefix line
                            break;
                        case Encoding3.TagType.OUTPUT_ITEM_END:
                            // Remove the item closer line
                            outputContents.pop();

                            if (!outputMime) {
                                // No output item start defined before the output item end
                                console.warn("Got an output item end before the output item start");
                            }
                            else if (outputMime === 'hermes.notebook/evr') {
                                switch (version) {
                                    case 3:
                                        cell?.outputs?.push(
                                            new vscode.NotebookCellOutput([
                                                new vscode.NotebookCellOutputItem(
                                                    textEncoder.encode(outputContents
                                                        .map((v) => JSON.parse(v) as Sourced<Event>)
                                                        .map(eventToDisplayEvent)
                                                        .map((v) => JSON.stringify(v))
                                                        .join('\n')
                                                    ),
                                                    outputMime)
                                            ])
                                        );
                                        break;
                                    case 3.1:
                                        // Remove the markdown table header/footer
                                        outputContents = outputContents.slice(3, -1);

                                        cell?.outputs?.push(
                                            new vscode.NotebookCellOutput([
                                                new vscode.NotebookCellOutputItem(
                                                    textEncoder.encode(outputContents.map(v => {
                                                        const cols = v.split("|", 9);

                                                        while (cols.length < 9) {
                                                            cols.push("[unknown]");
                                                        }

                                                        // FIXME(tumbar) Parse the markdown header to get the columns and
                                                        // remove this hardcoded non-sense
                                                        return JSON.stringify({
                                                            source: cols[1],
                                                            sclk: parseFloat(cols[2]),
                                                            time: parseFloat(cols[3]),
                                                            severity: cols[4],
                                                            component: cols[5],
                                                            name: cols[6],
                                                            message: cols[7],
                                                        });
                                                    }).join("\n")),
                                                    outputMime)
                                            ])
                                        );
                                        break;
                                }
                            } else {
                                cell?.outputs?.push(
                                    new vscode.NotebookCellOutput([
                                        new vscode.NotebookCellOutputItem(
                                            textEncoder.encode(outputContents.join('\n')),
                                            outputMime)
                                    ])
                                );
                            }

                            parsingMode.pop();
                            break;
                    }
                } else {
                    switch (parsingMode[parsingMode.length - 1]) {
                        case Encoding3.ParsingMode.CELL:
                            if (!cell) {
                                outputContents = [];
                                cell = new vscode.NotebookCellData(
                                    vscode.NotebookCellKind.Code,
                                    line + '\n',
                                    'plaintext'
                                );
                            } else {
                                // Append to the aready generating cell
                                cellContents.push(line);
                            }
                            break;
                        case Encoding3.ParsingMode.OUTPUT:
                            outputContents.push(line);
                            break;
                    }
                }
            }
            catch (e) {
                throw new Error(`Error on line: ${lineNo + 1}: ${e}`);
            }
        }

        return new vscode.NotebookData(cells);
    }

    async deserializeNotebook_version2(
        content: Uint8Array,
        _token: vscode.CancellationToken
    ): Promise<vscode.NotebookData> {
        const contents = textDecoder.decode(content);

        const file = contents.split('\n');

        // Cells are divided by ';?=' markers lines
        // Like MatLab, a section division can be done by starting a line with ;;

        let cell: vscode.NotebookCellData | undefined;
        const cells: vscode.NotebookCellData[] = [];

        let output: vscode.NotebookCellOutput | undefined;
        let evrOutput: string[] = [];

        let lineNo: number = 0;
        for (const line of file) {
            lineNo++;
            try {
                if (line.startsWith(Encoding2.Marker.CELL_START)) { // cell markers
                    // This is the start of a new cell
                    // This line will contain some metadata about the cell
                    const cellMetadata: CellNotebookHeader = JSON.parse(line.substring(Encoding2.Marker.CELL_START.length));

                    cell = new vscode.NotebookCellData(
                        cellMetadata.kind,
                        '',
                        cellMetadata.language
                    );

                    cell.metadata = cellMetadata.metadata ?? undefined;
                    cells.push(cell);
                } else if (line.startsWith(Encoding2.Marker.WHITESPACE)) { // manual whitespace
                } else if (line.startsWith(Encoding2.Marker.OUTPUT_START)) {
                    if (!cell) {
                        continue;
                    }

                    output = new vscode.NotebookCellOutput([], JSON.parse(line.substring(Encoding2.Marker.OUTPUT_START.length)));
                    if (!cell.outputs) {
                        cell.outputs = [];
                    }

                    cell.outputs.push(output);
                } else if (line.startsWith(Encoding2.Marker.OUTPUT_ITEM)) {
                    const { mime, data } = JSON.parse(line.substring(Encoding2.Marker.OUTPUT_ITEM.length));
                    output?.items.push(new vscode.NotebookCellOutputItem(textEncoder.encode(data), mime));
                } else if (line.startsWith(Encoding2.Marker.EVR_START)) {
                    evrOutput = [];
                } else if (line.startsWith(Encoding2.Marker.EVR)) { // evrs
                    evrOutput.push(line.substring(Encoding2.Marker.EVR.length));
                } else if (line.startsWith(Encoding2.Marker.EVR_END)) {
                    cell?.outputs?.push(
                        new vscode.NotebookCellOutput([
                            new vscode.NotebookCellOutputItem(
                                textEncoder.encode(`[${evrOutput.join(',')}]`),
                                'hermes.notebook/evr')
                        ])
                    );
                    evrOutput = [];
                } else { // code / content line
                    if (!cell) {
                        evrOutput = [];
                        cell = new vscode.NotebookCellData(
                            vscode.NotebookCellKind.Code,
                            line.substring(2),
                            'plaintext'
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
            catch (e) {
                throw new Error(`Error on line: ${lineNo}: ${e}`);
            }
        }

        return new vscode.NotebookData(cells);
    }
}
