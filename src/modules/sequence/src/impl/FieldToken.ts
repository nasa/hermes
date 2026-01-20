import * as vscode from 'vscode';
import Long from "long";

import { Def, PrimitiveValue } from '@gov.nasa.jpl.hermes/types';
import { Expression, TerminalToken, Token } from '../common';
import {
    argumentMarkdown,
    parseBitmaskValue,
    typeCompletionItems,
    typeToSemanticType,
    validateFieldValue
} from '../util';

export class FieldToken extends TerminalToken<Def.Field, PrimitiveValue> {
    constructor(
        parent: Expression,
        readonly schema: Def.Field,
        readonly index: number,
        readonly token: Token
    ) {
        super(parent, schema, index, token);
        this.semanticType = typeToSemanticType(this.schema.type);
    }

    parse(): PrimitiveValue {
        if ((this.schema.type as Def.RuntimeType).parse) {
            return (this.schema.type as Def.RuntimeType).parse!(this.token.text) as PrimitiveValue;
        }

        switch (this.schema.type.kind) {
            case Def.TypeKind.reference:
                return this.token.text;
            case Def.TypeKind.u8:
            case Def.TypeKind.i8:
            case Def.TypeKind.u16:
            case Def.TypeKind.i16:
            case Def.TypeKind.u32:
            case Def.TypeKind.i32:
            case Def.TypeKind.f32:
            case Def.TypeKind.f64: {
                const out = Number(this.token.text);
                if (Number.isNaN(out)) {
                    throw new Error("Malformed number");
                }

                return out;
            }
            case Def.TypeKind.u64:
                return Long.fromString(this.token.text, true);
            case Def.TypeKind.i64:
                return Long.fromString(this.token.text, false);
            case Def.TypeKind.boolean:
                if (this.token.text.toLowerCase() === "true") {
                    return true;
                } else if (this.token.text.toLowerCase() === 'false') {
                    return false;
                } else if (Number(this.token.text) === 0) {
                    return false;
                } else if (Number(this.token.text) === 1) {
                    return true;
                } else {
                    throw new Error('Not a boolean value');
                }
            case Def.TypeKind.string:
                if ((this.token.text[0] === '"' && this.token.text[this.token.text.length - 1] === '"') ||
                    (this.token.text[0] === "'" && this.token.text[this.token.text.length - 1] === "'")
                ) {
                    return this.token.text.substring(1, this.token.text.length - 1);
                }

                return this.token.text;
            case Def.TypeKind.enum: {
                const item =
                    this.schema.type.values.get(this.token.text) ??
                    this.schema.type.values.get(this.token.text.toUpperCase()) ??
                    this.schema.type.values.get(this.token.text.toLowerCase());
                if (item) {
                    return item.value;
                }

                // Attempt to parse as an integer
                const rawInt = parseFloat(this.token.text);
                if (Number.isNaN(rawInt)) {
                    throw new Error(`Not an integer or item in ${this.schema.type.name}`);
                } else if (!Number.isInteger(rawInt)) {
                    throw new Error(`Float is not an integer`);
                }

                return parseInt(this.token.text) | 0;
            }
            case Def.TypeKind.bitmask:
                return parseBitmaskValue(this.schema.type, this.token.text);
            case Def.TypeKind.array:
            case Def.TypeKind.object:
            case Def.TypeKind.bytes:
            case Def.TypeKind.void:
                return this.token.text;
        }
    }

    documentation() {
        return argumentMarkdown(
            this.schema,
            this.token.text
        );
    }

    completionItems() {
        if (this.schema.metadata?.choices) {
            return this.schema.metadata.choices.map(v => {
                const o = new vscode.CompletionItem(v, v.kind);
                o.insertText = v.insertText;
                return o;
            });
        }

        return typeCompletionItems(this.schema.type);
    }

    validate() {
        const out: vscode.Diagnostic[] = [];

        try {
            this.parse();
        } catch (e) {
            out.push(new vscode.Diagnostic(
                this.token.range,
                (<Error>e).message
            ));
        }

        const fieldDiagnostic = validateFieldValue(
            this.schema,
            this.token.text
        );

        if (fieldDiagnostic) {
            const diag = new vscode.Diagnostic(
                this.token.range,
                fieldDiagnostic.message,
                fieldDiagnostic.severity
            );

            diag.code = fieldDiagnostic.id;

            out.push(diag);
        }

        return out;
    }
}
