import * as vscode from 'vscode';
import { Def, typeName } from "@gov.nasa.jpl.hermes/types";
import * as Seq from "@gov.nasa.jpl.hermes/sequence";
import Long from 'long';

import { Expression, SemanticTokenType, TerminalToken } from "./common";

export class InvalidRange extends vscode.Range {
    isInvalid = true;

    constructor() {
        super(0, 0, 0, 0);
    }
}

export interface IPosition {
    line: number;
    character: number;
}

export class NextRange extends vscode.Range {
    isNextRange = true;

    constructor(position: IPosition) {
        super(
            position.line, position.character,
            position.line, Infinity
        );
    }
}

export function isInvalidRange(range: vscode.Range) {
    return range instanceof InvalidRange || (range as InvalidRange).isInvalid;
}

export function isNextRange(range: vscode.Range) {
    return range instanceof NextRange || (range as NextRange).isNextRange;
}

export function fieldSignature(field: Def.Field) {
    return `${field.name}: ${typeName(field.type)}`;
}

export function fieldsSignatureHelp(fields: Def.Field[]): string {
    return fields.map(fieldSignature).join(', ');
}

export function fieldDocumentation(field: Def.Field) {
    const paramDocs = new vscode.MarkdownString(field.metadata?.description, true);

    const extra: string[] = [];

    if (Def.isNumberType(field.type)) {
        if (field.type.min !== undefined) {
            extra.push(` min: ${field.type.min}`);
        }

        if (field.type.max !== undefined) {
            extra.push(` max: ${field.type.max}`);
        }
    }

    if (field.metadata?.units) {
        extra.push(` (${field.metadata.units})`);
    }

    if (field.metadata?.default) {
        extra.push(` default: ${field.metadata.default}`);
    }

    if (extra.length > 0) {
        paramDocs.appendMarkdown('\n\n');
        paramDocs.appendMarkdown(extra.join('\n'));
    }

    return paramDocs;
}

export function commandSignature(cmd: Def.Command): vscode.SignatureInformation {
    const signature = new vscode.SignatureInformation(
        `${cmd.component}.${cmd.mnemonic} ${fieldsSignatureHelp(cmd.arguments)}`,
        cmd.metadata?.description
    );

    for (const arg of cmd.arguments) {
        signature.parameters.push(new vscode.ParameterInformation(
            fieldSignature(arg),
            fieldDocumentation(arg)
        ));
    }

    return signature;
}

export function commandMarkdown(cmd: Def.Command): vscode.MarkdownString {
    const content = new vscode.MarkdownString(
        `${cmd.component}.**${cmd.mnemonic}** = \`0x${cmd.opcode.toString(16)}\`\n\n`,
        true
    );

    const signature = fieldsSignatureHelp(cmd.arguments);
    if (signature.length > 0) {
        content.appendCodeblock(signature, "typescript");
    }

    if (cmd.metadata?.description) {
        content.appendMarkdown(cmd.metadata?.description);
    }

    const extra: string[] = [];
    if (cmd.metadata?.author) {
        extra.push(`$(person) ${cmd.metadata.author}`);
    }

    if (cmd.metadata?.file) {
        extra.push(`$(file-code) ${cmd.metadata.file}`);
    }

    if (extra.length > 0) {
        content.appendMarkdown('\n\n');
        content.appendMarkdown(extra.join('\n'));
    }

    return content;
}

export function parseBitmaskValue(type: Def.BitmaskType, value: string) {
    const values = value.split('|').map(v => {
        const vNum = parseInt(v);
        if (Number.isNaN(vNum)) {
            const item = type.values.get(v.toUpperCase());
            if (!item) {
                throw new Error(`${v} not an item in ${type.name}`);
            }

            return item.value >>> 0;
        } else {
            return vNum >>> 0;
        }
    });

    let out = 0;
    for (const v of values) {
        out |= v;
    }

    return out >>> 0;
}

export function getEnumItem(token: string, def: Def.EnumType): Def.EnumItem | undefined {
    const rawInt = parseInt(token);
    if (Number.isNaN(rawInt)) {
        return def.values.get(token)
            ?? def.values.get(token.toUpperCase())
            ?? def.values.get(token.toLowerCase());
    } else {
        return def.values.getK2(rawInt | 0);
    }
}

export function argumentMarkdown(arg: Def.Field, value: string | undefined): vscode.MarkdownString[] {
    const out: vscode.MarkdownString[] = [];

    const argInfo = new vscode.MarkdownString();
    argInfo.appendCodeblock(fieldSignature(arg), "typescript");
    out.push(argInfo);
    out.push(fieldDocumentation(arg));
    out.push(new vscode.MarkdownString("---"));

    // See if this argument is an enum
    if ((arg.type as Def.RuntimeType).documentation) {
        const doc = (arg.type as Def.RuntimeType).documentation!(value);
        if (doc) {
            out.push(...doc.map(d => new vscode.MarkdownString(d)));
        }
    } else if (arg.type.kind === Def.TypeKind.enum && value !== undefined) {
        // Add enumerate metadata to the hover information
        const enumerate = getEnumItem(value, arg.type);
        if (enumerate !== undefined) {
            const content = new vscode.MarkdownString(
                `**${enumerate.name}** = \`${enumerate.value}\``
            );

            out.push(content);

            if (enumerate.metadata?.description) {
                out.push(new vscode.MarkdownString(enumerate.metadata.description));
            }
        }
    } else if (arg.type.kind === Def.TypeKind.bitmask && value !== undefined) {
        try {
            const rawValue = parseBitmaskValue(arg.type, value ?? "0x0");
            let fullMask = rawValue >>> 0;

            const masks: Def.EnumItem[] = [];
            const allMasks = Array.from(arg.type.values.values()).sort((a, b) => a.value - b.value);
            for (const mask of allMasks) {
                if (fullMask & (mask.value >>> 0)) {
                    masks.push(mask);
                    fullMask &= ~(mask.value >>> 0);
                }
            }

            let maskStr = masks.map(v => v.name).join("|");
            if (fullMask > 0) {
                maskStr += "|" + fullMask.toString(16);
            }

            out.push(new vscode.MarkdownString(
                `**${maskStr}** = \`0x${rawValue.toString(16)}\``
            ));

            for (const mask of masks) {
                if (mask.metadata?.description) {
                    out.push(new vscode.MarkdownString(`- **${mask.name}** \`0x${mask.value.toString(16)}\`: ${mask.metadata.description}`));
                } else {
                    out.push(new vscode.MarkdownString(`- **${mask.name}** \`0x${mask.value.toString(16)}\``));
                }
            }

            if (fullMask > 0) {
                out.push(new vscode.MarkdownString(`- Remainder \`0x${fullMask.toString(16)}\``));
            }
        } catch (err) {
            out.push(new vscode.MarkdownString(String(err)));
        }
    }

    return out;
}

export function joinMarkdown(markdowns: vscode.MarkdownString[]): vscode.MarkdownString {
    const out = new vscode.MarkdownString(undefined, true);
    for (const markdown of markdowns) {
        out.appendMarkdown(markdown.value);
    }

    return out;
}

export function typeCompletionItems(type: Def.Type): vscode.CompletionItem[] {
    switch (type.kind) {
        case Def.TypeKind.reference:
        case Def.TypeKind.u8:
        case Def.TypeKind.i8:
        case Def.TypeKind.u16:
        case Def.TypeKind.i16:
        case Def.TypeKind.u32:
        case Def.TypeKind.i32:
        case Def.TypeKind.u64:
        case Def.TypeKind.i64:
        case Def.TypeKind.f32:
        case Def.TypeKind.f64:
        case Def.TypeKind.string:
        case Def.TypeKind.array:
        case Def.TypeKind.object:
        case Def.TypeKind.bytes:
        case Def.TypeKind.void:
            return [];

        case Def.TypeKind.boolean:
            return [
                new vscode.CompletionItem("TRUE", vscode.CompletionItemKind.Keyword),
                new vscode.CompletionItem("FALSE", vscode.CompletionItemKind.Keyword)
            ];

        case Def.TypeKind.enum:
        case Def.TypeKind.bitmask:
            return type.values.map((v) => {
                const item = new vscode.CompletionItem({
                    label: v.name,
                    detail: ` = ${v.value}`
                }, vscode.CompletionItemKind.EnumMember);

                if (v.metadata?.description) {
                    item.documentation = new vscode.MarkdownString(v.metadata.description);
                }

                // TODO(tumbar) Provide a nice replacement experience with bitmasks
                return item;
            });
    }
}

export interface Diagnostic {
    severity: vscode.DiagnosticSeverity;
    message: string;
    id: string;
}

const validBooleans = [
    "False", "True",
    "FALSE", "TRUE",
    "false", "true",
    "0", "1"
];

export function validateFieldValue(field: Def.Field, value: string): Diagnostic | null {
    const checkRange = (nVal: Long | number, isInteger: boolean, [min, max]: [Long | number, Long | number]): Diagnostic | null => {
        if (Number.isNaN(nVal)) {
            return {
                severity: vscode.DiagnosticSeverity.Error,
                message: "Malformed float or integer",
                id: 'number'
            };
        }

        if (isInteger && !Number.isInteger(nVal)) {
            return {
                severity: vscode.DiagnosticSeverity.Error,
                message: "Expected integer not float",
                id: 'integer'
            };
        }

        if (nVal < min) {
            return {
                severity: vscode.DiagnosticSeverity.Error,
                message: `Less than minimum ${min}`,
                id: 'range'
            };
        }

        if (nVal > max) {
            return {
                severity: vscode.DiagnosticSeverity.Error,
                message: `Greater than maximum ${max}`,
                id: 'range'
            };
        }

        return null;
    };

    if ((field.type as Def.RuntimeType).validate) {
        return (field.type as Def.RuntimeType).validate!(value);
    }

    const parsed = Number(value);

    switch (field.type.kind) {
        case Def.TypeKind.u8:
            return checkRange(parsed, true, [field.type.min ?? 0, field.type.max ?? 255]);
        case Def.TypeKind.i8:
            return checkRange(parsed, true, [field.type.min ?? -128, field.type.max ?? 127]);
        case Def.TypeKind.u16:
            return checkRange(parsed, true, [field.type.min ?? 0, field.type.max ?? 65535]);
        case Def.TypeKind.i16:
            return checkRange(parsed, true, [field.type.min ?? -32768, field.type.max ?? 32767]);
        case Def.TypeKind.u32:
            return checkRange(parsed, true, [field.type.min ?? 0, field.type.max ?? 4294967295]);
        case Def.TypeKind.i32:
            return checkRange(parsed, true, [field.type.min ?? Long.fromString("-2147483648", false), field.type.max ?? Long.fromString("2147483647", false)]);
        case Def.TypeKind.u64:
            return checkRange(parsed, true, [field.type.min ?? 0, field.type.max ?? Long.fromString("18446744073709551615", true)]);
        case Def.TypeKind.i64:
            return checkRange(parsed, true, [field.type.min ?? Long.fromString("-9223372036854775808", false), field.type.max ?? Long.fromString("9223372036854775807", false)]);
        case Def.TypeKind.f32:
        case Def.TypeKind.f64:
            return checkRange(parsed, false, [field.type.min ?? -Infinity, field.type.max ?? Infinity]);
        case Def.TypeKind.boolean:
            if (!(typeof value === 'boolean') && !validBooleans.includes(value)) {
                return {
                    severity: vscode.DiagnosticSeverity.Error,
                    message: "Boolean must be 'TRUE' or 'FALSE'",
                    id: 'boolean'
                };
            } else {
                return null;
            }
        case Def.TypeKind.string: {
            if (field.type.maxLength) {
                let length;
                if ((value[0] !== '"' || value[value.length - 1] !== '"') &&
                    (value[0] !== "'" || value[value.length - 1] !== "'")
                ) {
                    length = (value as string).length;
                } else {
                    length = (value as string).length - 2;
                }

                if ((length > field.type.maxLength)) {
                    return {
                        severity: vscode.DiagnosticSeverity.Error,
                        message: `String exceeds maximum length ${field.type.maxLength}`,
                        id: 'stringLength'
                    };
                }
            }

            break;
        }
        case Def.TypeKind.enum:
        case Def.TypeKind.bitmask:
        case Def.TypeKind.bytes:
        case Def.TypeKind.void:
        case Def.TypeKind.array:
        case Def.TypeKind.object:
        case Def.TypeKind.reference:
    }

    return null;
}

export function typeToSemanticType(type: Def.Type): SemanticTokenType | undefined {
    switch (type.kind) {
        case Def.TypeKind.u8:
        case Def.TypeKind.i8:
        case Def.TypeKind.u16:
        case Def.TypeKind.i16:
        case Def.TypeKind.u32:
        case Def.TypeKind.i32:
        case Def.TypeKind.u64:
        case Def.TypeKind.i64:
        case Def.TypeKind.f32:
        case Def.TypeKind.f64:
            return SemanticTokenType.number;
        case Def.TypeKind.string:
            return SemanticTokenType.string;
        case Def.TypeKind.enum:
        case Def.TypeKind.bitmask:
            return SemanticTokenType.enumMember;
        case Def.TypeKind.array:
        case Def.TypeKind.object:
        case Def.TypeKind.reference:
        case Def.TypeKind.boolean:
        default:
            return;
    }
}

export function* traverse(
    tokOrExpr: TerminalToken | Expression | undefined
): Iterable<TerminalToken> {
    if (tokOrExpr instanceof Seq.TerminalToken) {
        return tokOrExpr;
    } else if (!tokOrExpr) {
        return;
    }

    for (const tok of tokOrExpr.traverse()) {
        if (tok instanceof Seq.TerminalToken) {
            yield tok;
        } else {
            for (const child of traverse(tok)) {
                yield child;
            }
        }
    }
}

export function range(
    tokOrExpr: TerminalToken | Expression | undefined
): vscode.Range | undefined | null {
    if (tokOrExpr instanceof Seq.TerminalToken) {
        return tokOrExpr.token.range;
    } else if (!tokOrExpr) {
        return;
    }

    let firstTok: TerminalToken | undefined;
    let lastToken: TerminalToken | undefined;

    const traverse = (expr: Expression) => {
        for (const tok of expr.traverse()) {
            if (tok instanceof Seq.TerminalToken) {
                if (!firstTok) {
                    firstTok = tok;
                }

                lastToken = tok;
            } else {
                traverse(tok);
            }
        }
    };

    traverse(tokOrExpr);

    if (!firstTok) {
        return;
    }

    return new vscode.Range(
        firstTok.token.range.start,
        lastToken!.token.range.end
    );
}

function toError(diagnostics: vscode.Diagnostic[] | undefined | null): string | undefined {
    if (diagnostics) {
        for (const diag of diagnostics) {
            if (diag.severity === vscode.DiagnosticSeverity.Error) {
                return diag.message;
            }
        }
    }
}

export function validate(expr: Expression | TerminalToken) {
    const err = toError(expr.validate?.());
    if (err) {
        if (expr.index >= 0) {
            throw new Error(`Token ${expr.index}: ${err}`);
        }

        throw new Error(err);
    }

    if ('traverse' in expr) {
        for (const sub of expr.traverse()) {
            validate(sub);
        }
    }
}

export function oldestParent(expr: Expression): Expression {
    let current: Expression | undefined = expr;
    let last = expr;
    while (current) {
        last = current;
        current = current.parent;
    }

    return last;
}
