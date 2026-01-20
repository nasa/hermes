import * as vscode from 'vscode';

import { FieldToken } from './FieldToken';

export interface SequenceDB extends vscode.EventEmitter<void> {
    refresh(): Promise<void>;
    add(uri: vscode.Uri): SequenceDB;
    delete(uri: vscode.Uri): SequenceDB;
    all(): string[];
    get(name: string): vscode.Uri[];
}

export abstract class SequenceReferenceToken extends FieldToken {
    protected resolved?: vscode.Uri[];
    abstract sequenceDb: SequenceDB;

    documentation(): vscode.MarkdownString[] {
        const additional: vscode.MarkdownString[] = [];
        if (this.resolved) {
            for (const uri of this.resolved) {
                const mark = new vscode.MarkdownString();
                mark.appendCodeblock(`"${uri.path}"`, 'typescript');
                additional.push(mark);
            }
        }

        return [
            ...super.documentation(),
            ...additional
        ];
    }

    completionItems(): vscode.CompletionItem[] {
        return this.sequenceDb.all().map(v => new vscode.CompletionItem(
            v, vscode.CompletionItemKind.File
        ));
    }

    definition(): vscode.DefinitionLink[] | undefined {
        return this.resolved?.map((v) => ({
            targetUri: v,
            targetRange: new vscode.Range(0, 0, 0, 0),
            originSelectionRange: this.token.range
        }));
    }

    validate() {
        const diagnostics: vscode.Diagnostic[] = [];
        const sequenceName = this.parse() as string;

        const found = this.sequenceDb.get(sequenceName);
        if (!found || found.length === 0) {
            diagnostics.push(
                new vscode.Diagnostic(
                    this.token.range,
                    `Could not find sequence '${sequenceName}' in workspace`,
                    vscode.DiagnosticSeverity.Warning
                )
            );
        } else {
            this.resolved = found;
        }

        return [
            ...diagnostics,
            ...super.validate() ?? []
        ];
    }
}
