import * as vscode from 'vscode';

import { type Def, type ArrayValue, typeName } from '@gov.nasa.jpl.hermes/types';
import type { Expression, TerminalToken } from "../common";
import { BaseTypeExpression, TypeExpression } from './TypeExpression';
import { argumentMarkdown, joinMarkdown } from '../util';

export class ArrayExpression<
    Child extends BaseTypeExpression = TypeExpression
> implements Expression<Def.Field, ArrayValue> {
    type: Def.ArrayType;

    sizePrefix?: TerminalToken<Def.Field>;
    tokens?: Child[];

    constructor(
        readonly parent: Expression,
        readonly schema: Def.Field,
        readonly index: number
    ) {
        this.type = schema.type as Def.ArrayType;
    }

    documentation(): vscode.MarkdownString[] {
        return argumentMarkdown(
            this.schema,
            undefined
        );
    }

    signature() {
        const parentLabel = this.parent.signature?.()?.parameters[this.index]?.label;
        return new vscode.SignatureInformation(
            `${parentLabel ?? this.schema.name}: ${typeName(this.schema.type)}`,
            joinMarkdown(this.documentation())
        );
    }

    *traverse() {
        if (this.sizePrefix) {
            yield this.sizePrefix;
        }

        if (this.tokens) {
            for (const tok of this.tokens) {
                yield tok;
            }
        }
    }

    parse(): ArrayValue {
        // Arrays of objects will place a empty 'placeholder' lookahead object
        // We should keep parsing until we reach this lookahead object.
        const out: ArrayValue = [];
        for (const tok of this.tokens ?? []) {
            const p = tok.parse();
            if (p !== undefined) {
                out.push(p);
            } else {
                break;
            }
        }

        return out;
    }
}
