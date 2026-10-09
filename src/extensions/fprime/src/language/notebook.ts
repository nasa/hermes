import * as vscode from "vscode";

import * as Hermes from "@gov.nasa.jpl.hermes/api";
import { CommandValue, range } from "@gov.nasa.jpl.hermes/sequence";
import { FswNotebookLanguageProvider } from "@gov.nasa.jpl.hermes/vscode";
import { YamcsRunner } from "../yamcs";
import { FPrimeExtension } from "./vsc";

export class FprimeNotebookLanguageProvider extends FswNotebookLanguageProvider {
    private readonly yamcsRunner: YamcsRunner;

    constructor(api: Hermes.Api, readonly language: FPrimeExtension) {
        super(
            "fprime",
            // F Prime cells can also run on YAMCS mode's connection
            (fsw) => fsw.type === "fprime" || fsw.type === "yamcs",
            api
        );
        this.yamcsRunner = new YamcsRunner(api);
        this.subscriptions.push(this.yamcsRunner);
    }

    async executeSequence(
        cell: vscode.NotebookCell,
        fsw: Hermes.Fsw,
        seq: Hermes.CommandSequence,
        token: vscode.CancellationToken
    ): Promise<boolean> {
        return fsw.type === "yamcs" ? this.yamcsRunner.run(fsw, seq, token) : super.executeSequence(cell, fsw, seq, token);
    }

    async *parse(
        cell: vscode.NotebookCell,
        token: vscode.CancellationToken
    ): AsyncIterable<CommandValue> {
        const exprs = await this.language.provideDocumentExpressions(cell.document, token);
        for (const expr of exprs) {
            try {
                yield expr.parse();
            } catch (err) {
                const r = range(expr);
                if (r) {
                    throw new Error(`line: ${r.start.line + 1}: ${err}`, { cause: err });
                } else {
                    throw err;
                }
            }
        }
    }
}
