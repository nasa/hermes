import * as vscode from 'vscode';

import { Def, ObjectValue } from '@gov.nasa.jpl.hermes/types';
import type { Expression, TerminalToken, Token } from '../common';
import { argumentMarkdown, fieldDocumentation, fieldSignature, fieldsSignatureHelp, joinMarkdown } from '../util';
import { BaseTypeExpression, TypeExpression } from './TypeExpression';

function finalToken(expr: Expression): Token {
    // Get the final terminal token
    const terminals: Token[] = [];
    let toks = Array.from(expr.traverse()) as any[];
    while (toks.length > 0) {
        const tok = toks.pop();
        if ((tok as Expression).traverse !== undefined) {
            toks = Array.from((tok as Expression).traverse()).concat(toks);
        } else {
            terminals.push((tok as TerminalToken).token);
        }
    }

    terminals.sort((a, b) => {
        if (a.range.end.line === b.range.end.line) {
            return a.range.end.character - b.range.end.character;
        } else {
            return a.range.end.line - b.range.end.line;
        }
    });

    if (terminals.length > 0) {
        return terminals[terminals.length - 1];
    } else if (expr.parent) {
        return finalToken(expr.parent);
    } else {
        // This should never happen otherwise it's an empty line
        return {
            text: '[invalid]',
            range: new vscode.Range(0, 0, 0, 0)
        };
    }
}

export class ObjectExpression<
    Child extends BaseTypeExpression = TypeExpression
> implements Expression<Def.Field, ObjectValue> {
    readonly type: Def.ObjectType;

    tokens?: Child[];

    constructor(
        readonly parent: Expression,
        readonly schema: Def.Field,
        readonly index: number,
    ) {
        this.type = schema.type as Def.ObjectType;
    }

    *traverse() {
        if (this.tokens) {
            for (const tok of this.tokens) {
                yield tok;
            }
        }
    }

    parse(): ObjectValue {
        if ((this.tokens?.length ?? 0) === 0) {
            return undefined as any;
        }

        const out: Record<string, any> = {};
        if (this.tokens) {
            for (const tok of this.tokens) {
                if (tok.schema) {
                    out[tok.schema.name] = tok.parse();
                }
            }
        }

        return out;
    }

    validate(): vscode.Diagnostic[] | null | undefined {
        // Empty objects are fine since they are probably lookahead objects
        if ((this.tokens?.length ?? 0) === 0) {
            return;
        }

        // Check if there are enough tokens
        const requiredFields = this.type.fields.filter(v => v.value === undefined);
        if (this.tokens?.length !== requiredFields.length) {
            const finalTok = finalToken(this);
            return [
                new vscode.Diagnostic(
                    new vscode.Range(
                        finalTok.range.end,
                        finalTok.range.end
                    ),
                    `Missing required fields for ${this.schema.name}: ${requiredFields.slice((this.tokens?.length ?? 0)).map(v => v.name).join(", ")}`
                )
            ];
        }
    }

    documentation(): vscode.MarkdownString[] {
        return argumentMarkdown(
            this.schema,
            undefined
        );
    }

    signature() {
        const filtered = this.type.fields.filter(v => v.value === undefined);
        const parentLabel = this.parent.signature?.()?.parameters[this.index]?.label;
        const signature = new vscode.SignatureInformation(
            `${parentLabel ?? this.schema.name}: ${fieldsSignatureHelp(filtered)}`,
            joinMarkdown(this.documentation())
        );

        for (const field of filtered) {
            signature.parameters.push(new vscode.ParameterInformation(
                fieldSignature(field),
                fieldDocumentation(field)
            ));
        }

        return signature;
    }
}
