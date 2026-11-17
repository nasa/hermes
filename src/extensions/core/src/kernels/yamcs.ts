import * as vscode from 'vscode';

import { Api } from '@gov.nasa.jpl.hermes/api';
import * as Seq from '@gov.nasa.jpl.hermes/sequence';
import { Def, Dictionary, DictionaryNamespace } from '@gov.nasa.jpl.hermes/types';
import { DictionaryLanguageItem, FswNotebookLanguageProvider, Language } from '@gov.nasa.jpl.hermes/vscode';

// We complete a command with its qualified name, which is how a YAMCS cell names it. YAMCS mode's
// dictionary splits that name at its last slash into component and mnemonic, so we join the two.
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
 * Returns the line without its comment. A # starts a comment unless it is inside a
 * "..." or '...' string, so a string argument can hold a #.
 */
export function stripComment(text: string): string {
    let quote: string | undefined;
    for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (quote) {
            if (c === quote) {
                quote = undefined;
            }
        } else if (c === '"' || c === "'") {
            quote = c;
        } else if (c === '#') {
            return text.substring(0, i);
        }
    }
    return text;
}

/**
 * A YAMCS cell: one command per line, the command's qualified name and then its
 * arguments, for example
 * /BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING "hello". A # outside
 * a string starts a comment.
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

    protected parse(document: vscode.TextDocument, dict: Dictionary | undefined, nextExpr: Seq.NextTokenExpression) {
        const out: Seq.CommandExpression[] = [];
        const dictionary = dict?.namespaces.get('');
        for (let lineNo = 0; lineNo < document.lineCount; lineNo++) {
            const line = document.lineAt(lineNo);
            // We cut the comment ourselves, because tokenizeLine cuts at its comment prefix even inside a
            // quoted string. So we pass a newline as the prefix, which no line contains.
            const text = stripComment(line.text);
            if (text.trim().length > 0) {
                this.context.set(Seq.tokenizeLine(text, line.lineNumber, { commentPrefix: '\n' }), line.lineNumber);
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

    async *parse(cell: vscode.NotebookCell, token: vscode.CancellationToken): AsyncIterable<[Seq.CommandValue, vscode.Range]> {
        for (const expr of await this.language.provideDocumentExpressions(cell.document, token)) {
            try {
                yield [expr.parse(), Seq.range(expr)!];
            } catch (err) {
                const r = Seq.range(expr);
                throw r ? new Error(`line: ${r.start.line + 1}: ${err instanceof Error ? err.message : err}`, { cause: err }) : err;
            }
        }
    }
}
