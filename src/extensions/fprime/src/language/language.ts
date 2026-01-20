import * as vscode from 'vscode';

import * as Seq from '@gov.nasa.jpl.hermes/sequence';
import { Def, DictionaryNamespace } from '@gov.nasa.jpl.hermes/types';

export interface RelativeTime {
    type: 'relative';
    hrs: number;
    min: number;
    sec: number;
    subseconds: number;
}

export interface AbsoluteTime {
    type: 'absolute';
    year: number;
    dayOfYear: number;
    hrs: number;
    min: number;
    sec: number;
    subseconds: number;
}

export function parseRelativeTime(timeRaw: string): RelativeTime {
    const m = timeRaw.match(
        /^R([0-9][0-9]?):([0-9][0-9]?):([0-9][0-9]?)(?:\.([0-9]+))?$/y
    );
    if (m === undefined || m === null) {
        throw Error("Malformed time string, must be in format: RHH:MM:SS[.XXX]");
    }

    return {
        type: 'relative',
        hrs: parseInt(m[1]),
        min: parseInt(m[2]),
        sec: parseInt(m[3]),
        subseconds: parseFloat("0." + (m[4] ?? "0"))
    };
}

function makePlural(count: number, s: string): string {
    if (count !== 1) {
        return s + "s";
    }
    return s;
}

export function annotateRelativeTime(timeRaw: string): string {
    try {
        const parsed = parseRelativeTime(timeRaw);

        const arr = [];
        if (parsed.hrs > 0) {
            arr.push(makePlural(parsed.hrs, `${parsed.hrs} hour`));
        }
        if (parsed.min > 0) {
            arr.push(makePlural(parsed.min, `${parsed.min} minute`));
        }
        if (parsed.sec > 0) {
            arr.push(makePlural(parsed.sec, `${parsed.sec} second`));
        }

        if (arr.length === 0) {
            return "No delay";
        }
        else {
            return arr.join(", ");
        }
    }
    catch (e) {
        return `Failed to parse relative time string: ${e}`;
    }
}


export function parseAbsoluteTime(timeRaw: string): AbsoluteTime {
    const m = timeRaw.match(
        /^A([0-9]{4})-([0-9]{3})T([0-9][0-9]?):([0-9][0-9]?):([0-9][0-9]?)(?:\.([0-9]+))?$/y
    );
    if (m === undefined || m === null) {
        throw Error("Malformed time string, must be in format: AYYYY-DDDTHH:MM:SS[.sss]");
    }

    return {
        type: 'absolute',
        year: parseInt(m[1]),
        dayOfYear: parseInt(m[2]),
        hrs: parseInt(m[3]),
        min: parseInt(m[4]),
        sec: parseInt(m[5]),
        subseconds: parseInt(m[6]?.substring(0, 6).padStart(6, "0") || "0")
    };
}

export function annotateAbsoluteTime(timeRaw: string): string {
    try {
        const parsed = parseAbsoluteTime(timeRaw);

        const date = new Date(parsed.year, 0);
        date.setDate(parsed.dayOfYear);
        date.setHours(parsed.hrs);
        date.setMinutes(parsed.min);
        date.setSeconds(parsed.sec);

        return date.toString();
    }
    catch (e) {
        return `Failed to parse absolute time string: ${e}`;
    }
}


export class FprimeMnemonicToken extends Seq.MnemonicToken {
    commandCompletionItem(cmd: Def.Command): vscode.CompletionItem {
        return new vscode.CompletionItem(
            `${cmd.component}.${cmd.mnemonic}`,
            vscode.CompletionItemKind.Function
        );
    }
}

export class TimeSpecifierToken extends Seq.TerminalToken<
    undefined,
    RelativeTime | AbsoluteTime
> {
    index = -1;
    declare parent: Seq.Expression<unknown>;
    semanticType = Seq.SemanticTokenType.property;

    parse() {
        if (this.token.text[0] === 'R') {
            return parseRelativeTime(this.token.text);
        }
        else if (this.token.text[0] === 'A') {
            return parseAbsoluteTime(this.token.text);
        } else {
            throw new Error('Timestring is not absolute or relative syntax');
        }
    }

    documentation() {
        if (this.token.text[0] === 'R') {
            return [new vscode.MarkdownString(annotateRelativeTime(this.token.text))];
        }
        else if (this.token.text[0] === 'A') {
            return [new vscode.MarkdownString(annotateAbsoluteTime(this.token.text))];
        }

        throw new Error("Time string must start with 'R' or 'A'");
    }

    validate() {
        const out: vscode.Diagnostic[] = [];
        if (this.token.text[0] === 'R') {
            try {
                annotateRelativeTime(this.token.text);
            } catch (e) {
                out.push(
                    new vscode.Diagnostic(
                        this.token.range,
                        (e as Error).message
                    )
                );
            }
        }
        else if (this.token.text[0] === 'A') {
            out.push(
                new vscode.Diagnostic(
                    this.token.range,
                    'Absolute timestrings are not recommended',
                    vscode.DiagnosticSeverity.Warning
                )
            );

            try {
                annotateAbsoluteTime(this.token.text);
            } catch (e) {
                new vscode.Diagnostic(
                    this.token.range,
                    (e as Error).message
                );
            }
        } else {
            out.push(
                new vscode.Diagnostic(
                    this.token.range,
                    'Timestring is not absolute or relative syntax'
                )
            );
        }

        return out;
    }

    completionItems(): vscode.CompletionItem[] | null | undefined {
        // TODO(tumbar) Autocomplete absolute timestring?
        if (this.token.text[0] === "R") {
            if (this.token.text.length < 2) {
                return [
                    new vscode.CompletionItem(
                        'R00:00:00',
                        vscode.CompletionItemKind.Property
                    )
                ];
            }

            const tsToks = this.token.text.substring(1).split(":", 3);

            // Complete all written tokens
            for (let i = 0; i < tsToks.length; i++) {
                if (tsToks[i].length < 2) {
                    tsToks[i] = "0".repeat(2 - tsToks[i].length) + tsToks[i];
                }
            }

            // Push unwritten tokens
            while (tsToks.length < 3) {
                tsToks.push("00");
            }

            const item = new vscode.CompletionItem(
                "R" + tsToks.join(":"),
                vscode.CompletionItemKind.Property
            );

            item.range = this.token.range;
            return [item];
        } else if (this.token.text.length === 0) {
            return [
                new vscode.CompletionItem(
                    'R00:00:00',
                    vscode.CompletionItemKind.Property
                )
            ];
        }
    }
}

export class FPrimeCommandExpression implements Seq.Expression<undefined> {
    parent?: Seq.Expression;
    schema: undefined;
    index: number;

    timeSpecifier!: TimeSpecifierToken;
    commandExpr!: Seq.CommandExpression;

    constructor() {
        this.index = 0;
    }

    parse(): Seq.CommandValue {
        const cmdVal = this.commandExpr.parse();
        const timeSpecifier = this.timeSpecifier.parse();
        switch (timeSpecifier.type) {
            case 'absolute':
                // I don't want to support this
                break;
            case 'relative': {
                const delayMs = (
                    timeSpecifier.hrs * 60 * 60 * 1000 +
                    timeSpecifier.min * 60 * 1000 +
                    timeSpecifier.sec * 1000 +
                    timeSpecifier.subseconds * 1000
                );

                cmdVal.metadata = {
                    ...cmdVal.metadata,
                    relativeTimeDelayMs: `${delayMs}`
                };
            }
                break;
        }

        return cmdVal;
    }

    *traverse(): Generator<Seq.TerminalToken | Seq.Expression> {
        yield this.timeSpecifier;
        yield this.commandExpr;
    }
}


export class FPrimeFieldToken extends Seq.FieldToken {
    validate() {
        const out = super.validate() ?? [];

        if (this.schema.type.kind === Def.TypeKind.string) {
            if ((this.token.text[0] !== '"' || this.token.text[this.token.text.length - 1] !== '"') &&
                (this.token.text[0] !== "'" || this.token.text[this.token.text.length - 1] !== "'")
            ) {
                out.push(new vscode.Diagnostic(
                    this.token.range,
                    "Strings should start and end with \" or '"
                ));
            }
        }

        return out;
    }
}

export class FPrimeParser extends Seq.CommandParserMixin(Seq.TypeParser) {
    getCommand(cmd: Def.Command | undefined): Def.Command | undefined {
        return cmd;
    }

    command(
        context: Seq.ParsingContext,
        dictionary: DictionaryNamespace | undefined
    ): FPrimeCommandExpression {
        const out = new FPrimeCommandExpression();

        out.timeSpecifier = context.token(out, TimeSpecifierToken, undefined, -1, true);

        const command = this.getCommand(context.tokens[0] ? dictionary?.getCommand(context.tokens[0].text) : undefined);
        out.commandExpr = new Seq.CommandExpression(command, dictionary, -1);

        out.commandExpr.mnemonic = context.token(out.commandExpr, FprimeMnemonicToken, [dictionary, command], -1, true);
        out.commandExpr.args = command ? this.commandHelper(out.commandExpr, context, command) : [];

        return out;
    }
}

export function tokenizeLine(
    line: string,
    lineNo: number,
    trim: boolean = true
) {
    return Seq.tokenizeLine(line, lineNo, {
        commentPrefix: ';',
        trim
    });
}

let sequenceContext!: Seq.ParsingContext;
let sequenceParser!: FPrimeParser;

function init() {
    sequenceContext = new Seq.ParsingContext();
    sequenceParser = new FPrimeParser();
}

export function parseLine(
    dictionary: DictionaryNamespace,
    line: string,
    lineNo: number = 0
) {
    if (!sequenceContext) {
        init();
    }

    sequenceContext.set(tokenizeLine(
        line, lineNo
    ), lineNo);

    if (!sequenceContext.empty()) {
        const cmd = sequenceParser.command(sequenceContext, dictionary);
        if (cmd) {
            Seq.validate(cmd);
            return cmd.parse();
        }
    }
}
