import * as vscode from 'vscode';

import { Api } from '@gov.nasa.jpl.hermes/api';
import * as Seq from '@gov.nasa.jpl.hermes/sequence';
import { Def, DictionaryNamespace } from '@gov.nasa.jpl.hermes/types';
import { DictionaryLanguageItem, FswNotebookLanguageProvider, Language } from '@gov.nasa.jpl.hermes/vscode';

// MnemonicToken completes a command by its mnemonic alone, but a YAMCS cell names a command by its
// qualified name, which is how YAMCS mode's dictionary keys it. That dictionary splits the qualified
// name at its last slash into component and mnemonic, so we complete component/mnemonic.
class YamcsMnemonicToken extends Seq.MnemonicToken {
    commandCompletionItem(cmd: Def.Command): vscode.CompletionItem {
        return new vscode.CompletionItem(`${cmd.component}/${cmd.mnemonic}`, vscode.CompletionItemKind.Function);
    }
}

class YamcsParser extends Seq.CommandParserMixin(Seq.TypeParser) {
    command(context: Seq.ParsingContext, dictionary: DictionaryNamespace | undefined): Seq.CommandExpression {
        const def = dictionary?.getCommand(context.tokens[0].text);
        const out = new Seq.CommandExpression(def, dictionary, -1);
        out.mnemonic = context.token(out, YamcsMnemonicToken, [dictionary, def], -1, true);
        out.args = def ? this.commandHelper(out, context, def) : [];
        return out;
    }
}

/**
 * A YAMCS cell: one command per line, the command's qualified name and then its
 * arguments, for example
 * /BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello". A line
 * starting with # is a comment.
 */
export class YamcsLanguage extends Language.SequenceLanguage<Seq.CommandExpression> {
    private readonly context = new Seq.ParsingContext();
    private readonly parser = new YamcsParser();

    constructor(dictionaryProvider: DictionaryLanguageItem) {
        super('yamcs', dictionaryProvider, {
            completionTriggers: [' ', ',', '/'],
            signatureTriggers: [' ', ','],
        });
    }

    protected parse(document: vscode.TextDocument, nextExpr: Seq.NextTokenExpression) {
        const out: Seq.CommandExpression[] = [];
        const dictionary = this.dictionary?.namespaces.get('');
        for (let lineNo = 0; lineNo < document.lineCount; lineNo++) {
            const line = document.lineAt(lineNo);
            // The lexer cuts a line at its comment prefix even inside a quoted string, and a YAMCS
            // string argument can hold a #. So we skip comment lines here and give the lexer a
            // newline as its comment prefix, which no line contains.
            if (!line.isEmptyOrWhitespace && !line.text.trimStart().startsWith('#')) {
                this.context.set(Seq.tokenizeLine(line.text, line.lineNumber, { commentPrefix: '\n' }), line.lineNumber);
                if (!this.context.empty()) {
                    out.push(this.parser.command(this.context, dictionary));
                    if (this.context.next) {
                        nextExpr.add(this.context.next);
                    }
                }
            }
        }
        return out;
    }
}

// Runs YAMCS cells on YAMCS mode's flight software connection
export class YamcsNotebookLanguageProvider extends FswNotebookLanguageProvider {
    constructor(api: Api, readonly language: YamcsLanguage) {
        super('yamcs', (fsw) => fsw.type === 'yamcs', api);
    }

    async *parse(cell: vscode.NotebookCell, token: vscode.CancellationToken): AsyncIterable<Seq.CommandValue> {
        for (const expr of await this.language.provideDocumentExpressions(cell.document, token)) {
            try {
                yield expr.parse();
            } catch (err) {
                const r = Seq.range(expr);
                throw r ? new Error(`line: ${r.start.line + 1}: ${err}`, { cause: err }) : err;
            }
        }
    }
}
