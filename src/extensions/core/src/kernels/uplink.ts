import * as vscode from 'vscode';
import * as fs from 'fs';
import { stat as fsStat } from 'fs/promises';

import { NotebookLanguageProvider } from '@gov.nasa.jpl.hermes/vscode';
import { Api, Fsw } from '@gov.nasa.jpl.hermes/api';
import { eventToDisplayEvent } from '@gov.nasa.jpl.hermes/types/src/conversion';
import path from 'path';

interface UplinkRequest {
    fsw: Fsw;
    srcPath: string;
    dstPath: string;
    metadata?: Record<string, string>;
}

export class UplinkLanguageProvider implements NotebookLanguageProvider {
    name = 'uplink';
    tooltip = 'Uplink Files';
    language = 'uplink';

    constructor(readonly api: Api) { }

    async execute(
        code: vscode.NotebookCell,
        execution: vscode.NotebookCellExecution,
        token: vscode.CancellationToken
    ): Promise<boolean> {
        const uplinkRequests: UplinkRequest[] = [];
        const fsws = await this.api.allFsw(token);

        for (let lineNo = 0; lineNo < code.document.lineCount; lineNo++) {
            const line = code.document.lineAt(lineNo);
            let text = line.text;
            let metadata: Record<string, string> | undefined;

            try {
                // Extract metadata
                const metadataIdx = text.indexOf('@');
                if (metadataIdx >= 0) {
                    metadata = Object.fromEntries(
                        text.substring(metadataIdx + 1).split(',').map(v => {
                            const mdItem = v.trim();
                            if (!mdItem) {
                                return undefined;
                            }

                            const mdPrm = mdItem.split('=', 2);
                            if (mdPrm.length !== 2) {
                                throw new Error(`Invalid metadata item '${v}'`);
                            }

                            return mdPrm.map(v => v.trim());
                        }).filter(v => v !== undefined)
                    );
                    text = text.substring(0, metadataIdx - 1);
                }

                const spl = text.split(/[\s]+/);
                if (spl.length === 0) {
                    continue;
                }

                if (spl.length !== 3) {
                    throw new Error("Line must be in the form: [FSW] [SRC] [DEST]");
                }

                const fsw = fsws.find(v => v.id === spl[0]);
                if (!fsw) {
                    throw new Error(`FSW '${spl[0]}' not connected`);
                } else if (!fsw.uplink) {
                    throw new Error(`FSW '${spl[0]} does not support uplink`);
                }

                let srcPath: vscode.Uri;
                if (path.isAbsolute(spl[1])) {
                    srcPath = vscode.Uri.file(spl[1]);
                } else {
                    srcPath = vscode.Uri.joinPath(
                        vscode.workspace.workspaceFolders?.[0].uri ?? vscode.Uri.file('/'),
                        spl[1],
                    );
                }

                uplinkRequests.push({
                    fsw,
                    srcPath: srcPath.fsPath,
                    dstPath: spl[2],
                    metadata,
                });
            } catch (err) {
                throw new Error(`Invalid command on line ${lineNo + 1}: ${err}`);
            }
        }

        const out = new vscode.NotebookCellOutput([
            vscode.NotebookCellOutputItem.text('', 'hermes.notebook/evr')
        ]);

        execution.appendOutput(out);

        const evrs: string[] = [];
        const evrDisp = this.api.onEvent((evr) => {
            evrs.push(JSON.stringify(eventToDisplayEvent(evr)));
            execution.replaceOutputItems(
                vscode.NotebookCellOutputItem.text(evrs.join('\n'), 'hermes.notebook/evr'),
                out
            );
        });

        try {
            for (const upl of uplinkRequests) {
                let size: number;
                try {
                    size = (await fsStat(upl.srcPath)).size;
                } catch (err) {
                    throw new Error(`failed to stat file '${upl.srcPath}': ${err}`);
                }

                try {
                    await vscode.window.withProgress({
                        location: vscode.ProgressLocation.Notification,
                    }, async (progress) => {
                        await upl.fsw.uplink!({
                            sourcePath: upl.srcPath,
                            destinationPath: upl.dstPath,
                            size,
                            metadata: upl.metadata,
                        }, fs.createReadStream(upl.srcPath), {
                            report: (value) => {
                                progress.report({
                                    message: `Uplinking ${upl.srcPath} to ${upl.dstPath}`,
                                    increment: value
                                });
                            }
                        }, token);
                    });
                } catch (err) {
                    throw new Error(`failed to uplink '${upl.srcPath}': ${err}`);
                }
            }
        }
        finally {
            evrDisp.dispose();
        }

        return true;
    }
}
