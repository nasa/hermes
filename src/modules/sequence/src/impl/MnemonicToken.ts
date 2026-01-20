import * as vscode from 'vscode';

import { TerminalToken, Token, Expression, SemanticTokenType } from '../common';
import { Def, DictionaryNamespace } from '@gov.nasa.jpl.hermes/types';
import { fieldsSignatureHelp, isInvalidRange, isNextRange } from '../util';

function getCommandMarkdown(def: Def.Command) {
    const content = new vscode.MarkdownString(
        `${def.component}.**${def.mnemonic}** = \`0x${def.opcode.toString(16)}\`\n\n`,
        true
    );

    const signature = fieldsSignatureHelp(def.arguments);
    if (signature.length > 0) {
        content.appendCodeblock(signature, "typescript");
    }

    if (def.metadata?.description) {
        content.appendMarkdown(def.metadata?.description);
    }

    const extra: string[] = [];
    if (def.metadata?.author) {
        extra.push(`$(person) ${def.metadata.author}`);
    }

    if (def.metadata?.file) {
        extra.push(`$(file-code) ${def.metadata.file}`);
    }

    if (extra.length > 0) {
        content.appendMarkdown('\n\n');
        content.appendMarkdown(extra.join('\n'));
    }

    return content;
}

export class MnemonicToken extends TerminalToken<
    [DictionaryNamespace | undefined, Def.Command | undefined],
    string
> {
    semanticType = SemanticTokenType.function;

    dictionary?: DictionaryNamespace;
    def?: Def.Command;

    constructor(
        parent: Expression,
        readonly schema: [DictionaryNamespace | undefined, Def.Command | undefined],
        readonly index: number,
        readonly token: Token
    ) {
        super(parent, schema, index, token);
        this.dictionary = schema[0];
        this.def = schema[1];
    }

    parse() {
        return this.token.text;
    }

    documentation(): vscode.MarkdownString[] {
        if (!this.def) {
            return [new vscode.MarkdownString("No dictionary definition")];
        }

        return [getCommandMarkdown(this.def)];
    }

    commandCompletionItem(cmd: Def.Command): vscode.CompletionItem {
        return new vscode.CompletionItem(
            cmd.mnemonic,
            vscode.CompletionItemKind.Function
        );
    }

    protected allCommands(): Iterable<Def.Command> {
        return this.dictionary?.getCommands() ?? [];
    }

    completionItems(): vscode.CompletionItem[] | undefined {
        const completions: vscode.CompletionItem[] = [];
        for (const cmd of this.allCommands()) {
            const item = this.commandCompletionItem(cmd);

            item.kind = vscode.CompletionItemKind.Function;
            item.detail = fieldsSignatureHelp(cmd.arguments);
            item.documentation = getCommandMarkdown(cmd);

            if (!isInvalidRange(this.token.range) && !isNextRange(this.token.range)) {
                item.range = this.token.range;
            }

            completions.push(item);
        }

        return completions;
    }

    validate(): vscode.Diagnostic[] | null | undefined {
        if (!this.def) {
            const diag = new vscode.Diagnostic(
                this.token.range,
                `Command '${this.token.text}' could not found`,
                vscode.DiagnosticSeverity.Error
            );

            diag.code = '(command not found)';
            return [diag];
        } else if (this.def.metadata?.error) {
            const diag = new vscode.Diagnostic(
                this.token.range,
                this.def.metadata.error,
                vscode.DiagnosticSeverity.Error
            );

            diag.code = '(command not found)';
            return [diag];
        }
    }
}
