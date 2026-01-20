/**
 * FPrime VSCode extension for sequence creation
 * @author Andrei Tumbar
 */

import * as vscode from 'vscode';
import * as path from 'path';

import * as Seq from '@gov.nasa.jpl.hermes/sequence';
import { Def } from '@gov.nasa.jpl.hermes/types';
import {
    Language,
    DictionaryLanguageItem
} from "@gov.nasa.jpl.hermes/vscode";

import { sequenceUplinkRoot } from '../settings';
import {
    FPrimeCommandExpression,
    FPrimeParser,
    TimeSpecifierToken,
    tokenizeLine
} from './language';

export function FPrimeSequenceDBMixin<
    TConstructor extends { new(...args: any): FPrimeParser }
>(base: TConstructor) {
    return class extends base {
        sequenceDb!: FPrimeSequenceDB;
        SequenceReferenceToken: {
            new(
                parent: Seq.Expression,
                schema: Def.Field,
                index: number,
                token: Seq.Token
            ): SequenceReferenceToken;
        };

        constructor(...args: any) {
            super(...args);

            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const this_ = this;

            this.SequenceReferenceToken = class extends SequenceReferenceToken {
                constructor(
                    parent: Seq.Expression,
                    schema: Def.Field,
                    index: number,
                    token: Seq.Token,
                ) {
                    super(parent, schema, index, token, this_.sequenceDb);
                }
            };
        }

        primtive(
            parent: Seq.Expression,
            context: Seq.ParsingContext,
            schema: Def.Field
        ) {
            if (schema.metadata?.other?.sequenceDb) {
                return context.token(parent, this.SequenceReferenceToken, schema, context.advance());
            } else {
                return super.primtive(parent, context, schema);
            }
        }

        getCommand(cmd: Def.Command | undefined): Def.Command | undefined {
            if (!cmd) {
                return;
            }

            switch (cmd.mnemonic) {
                case "CS_RUN":
                case "CS_VALIDATE": {
                    const args = [...cmd.arguments ?? []];
                    const filenameArg = args.shift()!;

                    // Annotate the first argument with the sequence database
                    return {
                        ...cmd,
                        arguments: [
                            {
                                ...filenameArg,
                                metadata: {
                                    ...filenameArg.metadata,
                                    other: {
                                        sequenceDb: "true"
                                    }
                                }
                            },
                            ...args
                        ]
                    };
                }
                default:
                    return cmd;
            }
        }
    };
}

class VSCodeFPrimeParser extends FPrimeSequenceDBMixin(FPrimeParser) {
    constructor(
        sequenceDb: FPrimeSequenceDB,
    ) {
        super();
        this.sequenceDb = sequenceDb;
    }
}

export class SequenceReferenceToken extends Seq.SequenceReferenceToken {
    constructor(
        parent: Seq.Expression,
        readonly schema: Def.Field,
        readonly index: number,
        readonly token: Seq.Token,
        readonly sequenceDb: FPrimeSequenceDB,
    ) {
        super(parent, schema, index, token);
    }

    parseBase() {
        return path.basename(super.parse() as string, '.bin');
    }

    link(): Seq.DocumentLink {
        const link = new vscode.DocumentLink(this.token.range);
        (link as Seq.DocumentLink).resolve = async (token) => {
            const seqName = this.parseBase();
            const seqs = await vscode.workspace.findFiles(`**/${seqName}.seq`, null, 1, token);
            if (seqs.length === 0) {
                throw new Error(`Could not resolve sequence ${seqName} (not found)`);
            } else {
                return new vscode.DocumentLink(this.token.range, seqs[0]);
            }
        };

        return link;
    }

    completionItems(): vscode.CompletionItem[] {
        return super.completionItems().map(v => {
            const sequenceName = v.label as string;
            v.label = {
                label: v.label as string,
                description: vscode.workspace.asRelativePath(this.sequenceDb.get(sequenceName)[0])
            };
            v.insertText = `"${sequenceUplinkRoot()}/${sequenceName}.bin"`;
            return v;
        });
    }

    validate(): vscode.Diagnostic[] {
        const out = super.validate();

        // FPrime strings should be wrapped in quotes
        if (this.schema.type.kind === Def.TypeKind.string) {
            if ((this.token.text[0] !== '"' || this.token.text[this.token.text.length - 1] !== '"') &&
                (this.token.text[0] !== "'" || this.token.text[this.token.text.length - 1] !== "'")
            ) {
                out.push(new vscode.Diagnostic(
                    this.token.range,
                    "Strings should start and end with \" or '",
                ));
            }
        }

        if (!(this.parse() as string).endsWith(".bin")) {
            // This is not a compiled sequence
            out.push(new vscode.Diagnostic(
                this.token.range,
                'Sequence path should end with `.bin` to reference an on-board compiled sequence',
                vscode.DiagnosticSeverity.Warning
            ));
        }

        return out;
    }
}

export class FPrimeSequenceDB extends Language.SequenceDB {
    constructor() {
        super((uri: vscode.Uri) => path.basename(uri.path, '.seq'));
    }

    get(name: string): vscode.Uri[] {
        return super.get(path.basename(name, '.bin'));
    }
}

export class FPrimeExtension extends Language.SequenceLanguage<FPrimeCommandExpression> {
    sequenceDb: FPrimeSequenceDB;
    context: Seq.ParsingContext;
    parser: VSCodeFPrimeParser;

    constructor(dictionaryProvider: DictionaryLanguageItem) {
        super('fprime', dictionaryProvider, {
            completionTriggers: [' ', ',', '.'],
            signatureTriggers: [' ', ','],
        });

        this.context = new Seq.ParsingContext();
        this.sequenceDb = new FPrimeSequenceDB();
        this.parser = new VSCodeFPrimeParser(this.sequenceDb);
        this.subscriptions.push(
            this.sequenceDb,
            this.sequenceDb.event(() => this.refreshAll())
        );
    }

    provideEmptyLineCompletionItems() {
        const psuedoToken = new TimeSpecifierToken(null!, undefined, 0, {
            text: '',
            range: new Seq.InvalidRange()
        });

        return psuedoToken.completionItems();
    }

    protected parse(document: vscode.TextDocument, nextExpr: Seq.NextTokenExpression) {
        const out: FPrimeCommandExpression[] = [];

        // FPrime always uses the primary namespace
        const dict = this.dictionary?.namespaces.get("");

        for (let lineNo = 0; lineNo < document.lineCount; lineNo++) {
            const line = document.lineAt(lineNo);
            if (!line.isEmptyOrWhitespace) {
                this.context.set(tokenizeLine(
                    line.text, line.lineNumber
                ), line.lineNumber);

                if (!this.context.empty()) {
                    out.push(this.parser.command(this.context, dict));

                    if (this.context.next) {
                        nextExpr.add(this.context.next);
                    }
                }
            }
        }

        return out;
    }
}
