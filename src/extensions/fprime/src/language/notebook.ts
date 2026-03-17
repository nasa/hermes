import * as vscode from "vscode";

import { Api, Fsw } from "@gov.nasa.jpl.hermes/api";
import { CommandValue, range } from "@gov.nasa.jpl.hermes/sequence";
import { FswNotebookLanguageProvider } from "@gov.nasa.jpl.hermes/vscode";
import { FPrimeExtension } from "./vsc";

export class FprimeNotebookLanguageProvider extends FswNotebookLanguageProvider {
    constructor(api: Api, readonly language: FPrimeExtension) {
        super(
            "fprime",
            (fsw) => fsw.type === "fprime",
            api
        );
    }

    async getFsw(
        cell: vscode.NotebookCell,
        token?: vscode.CancellationToken
    ): Promise<Fsw | undefined> {
        const fsw = await super.getFsw(cell, token);
        if (fsw && fsw.dictionary) {
            this.language.dictionaryProvider.set(fsw.dictionary);
        }

        return fsw;
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
                    throw new Error(`line: ${r.start.line + 1}: ${err}`);
                } else {
                    throw err;
                }
            }
        }
    }
}
