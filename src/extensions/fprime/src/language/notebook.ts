import * as vscode from "vscode";

import * as Hermes from "@gov.nasa.jpl.hermes/api";
import { CommandValue, range } from "@gov.nasa.jpl.hermes/sequence";
import { FswNotebookLanguageProvider } from "@gov.nasa.jpl.hermes/vscode";
import { runOnYamcs } from "../yamcs";
import { FPrimeExtension } from "./vsc";

export class FprimeNotebookLanguageProvider extends FswNotebookLanguageProvider {
    constructor(api: Hermes.Api, readonly language: FPrimeExtension) {
        super(
            "fprime",
            // F Prime cells can also run on YAMCS mode's connection
            (fsw) => fsw.type === "fprime" || fsw.type === "yamcs",
            api
        );
    }

    async executeSequence(
        cell: vscode.NotebookCell,
        fsw: Hermes.Fsw,
        seq: Hermes.CommandSequence,
        token: vscode.CancellationToken,
        onState?: Hermes.CommandStateHandler,
        onWait?: (ms: number) => void
    ): Promise<boolean> {
        // For YAMCS mode's connection we send the commands ourselves. super.executeSequence calls YAMCS mode's
        // fsw.sequence, which doesn't wait out time tags or send booleans as fprime-yamcs's labels.
        return fsw.type === "yamcs" ? runOnYamcs(fsw, seq, token, onState, onWait) : super.executeSequence(cell, fsw, seq, token, onState);
    }

    async *parse(
        cell: vscode.NotebookCell,
        token: vscode.CancellationToken
    ): AsyncIterable<[CommandValue, vscode.Range]> {
        const exprs = await this.language.provideDocumentExpressions(cell.document, token);
        for (const expr of exprs) {
            try {
                yield [expr.parse(), range(expr)!];
            } catch (err) {
                const r = range(expr);
                if (r) {
                    throw new Error(`line: ${r.start.line + 1}: ${err instanceof Error ? err.message : err}`, { cause: err });
                } else {
                    throw err;
                }
            }
        }
    }
}
