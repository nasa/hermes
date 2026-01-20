import { Def, PrimitiveValue, typeKindName, Value } from '@gov.nasa.jpl.hermes/types';
import { FieldToken } from "./FieldToken";
import type { ParsingContext } from '../context';
import { ObjectExpression } from './ObjectExpression';
import { ArrayExpression } from './ArrayExpression';
import type { Token, Expression, TerminalToken } from '../common';

export type BaseTypeExpression = Expression<Def.Field, Value> | TerminalToken<Def.Field, PrimitiveValue>;
export type TypeExpression = ArrayExpression | ObjectExpression | FieldToken;

export interface FieldTokenConstructor {
    new(
        parent: Expression,
        schema: Def.Field,
        index: number,
        token: Token
    ): FieldToken;
}

export interface ArrayExpressionConstructor {
    new(
        parent: Expression,
        schema: Def.Field,
        index: number
    ): ArrayExpression;
}

export interface ObjectExpressionConstructor {
    new(
        parent: Expression,
        schema: Def.Field,
        index: number
    ): ObjectExpression;
}

export class TypeParser {
    FieldToken: FieldTokenConstructor;
    ArrayExpression: ArrayExpressionConstructor;
    ObjectExpression: ObjectExpressionConstructor;

    constructor(
        FieldToken_: FieldTokenConstructor = FieldToken,
        ArrayExpression_: ArrayExpressionConstructor = ArrayExpression,
        ObjectExpression_: ObjectExpressionConstructor = ObjectExpression
    ) {
        this.FieldToken = FieldToken_;
        this.ArrayExpression = ArrayExpression_;
        this.ObjectExpression = ObjectExpression_;
    }

    array(parent: Expression, context: ParsingContext, schema: Def.Field): ArrayExpression {
        if (schema.type.kind !== Def.TypeKind.array) {
            throw new Error(`Passing TypeKind ${typeKindName(schema.type.kind)} to arrayExprRule`);
        }

        const out = new this.ArrayExpression(parent, schema, context.advance());

        context.push(schema);

        let length: number;
        let minLength: number;
        const omitLengthPrefix: boolean = schema.metadata?.omitLengthPrefix ?? false;

        if (omitLengthPrefix || typeof schema.type.size === 'number') {
            // We can determine the size of the array either statically or by absorbing
            // the rest of the arguments
            // We don't need to prefix this command with the length of the array.
            // We will just try to absorb as many tokens as we can
            if (typeof schema.type.size === "number") {
                // The array is a static size
                length = schema.type.size;
                minLength = schema.type.size;
            } else if (typeof schema.type.size === "object") {
                // Array is a range of sizes
                const [minCount, maxCount] = schema.type.size;
                length = maxCount;
                minLength = minCount;
            } else {
                // Array has an unbounded size
                length = Infinity;
                minLength = Infinity;
            }
        } else {
            // This array is not at the end of the command set which means
            // we can not determine its length. The user must specify the
            // array length as an additional argument before the rest of
            // the array parameters
            const sizeType: Def.NumberType = {
                kind: schema.type.lengthType ?? Def.TypeKind.u32,
            };

            // Check if the size is bounded
            if (typeof schema.type.size === "object") {
                const [minCount, maxCount] = schema.type.size;
                sizeType.min = minCount;
                sizeType.max = maxCount;
            }

            const sizeField: Def.Field = {
                name: `${schema.name} count`,
                type: sizeType
            };

            out.sizePrefix = context.token(out, this.FieldToken, sizeField, context.advance(), true);

            if (out.sizePrefix) {
                length = out.sizePrefix.parse() as number;
                minLength = length;
                if (Number.isNaN(length)) {
                    length = 0;
                }
            } else {
                length = 0;
                minLength = 0;
            }
        }

        out.tokens = [];
        for (let i = 0; i < length && !context.done(); i++) {
            if (i >= minLength && context.empty()) {
                // Push the next token into the pipeline
                // (don't validate the token though)
                context.nextOptional = true;
            }

            const tok = this.field(out, context, {
                type: schema.type.type,
                name: `${schema.name}[${i}]`
            });

            if (tok) {
                out.tokens.push(tok);
            }
        }

        context.pop();

        return out;
    }

    object(parent: Expression, context: ParsingContext, schema: Def.Field): ObjectExpression {
        if (schema.type.kind !== Def.TypeKind.object) {
            throw new Error('Expected object type field in schema');
        }

        const out = new this.ObjectExpression(parent, schema, context.advance());

        context.push(schema);

        out.tokens = [];
        const filtered = schema.type.fields.filter(v => v.value === undefined);
        for (const field of filtered) {
            if (context.done()) {
                break;
            }

            const tok = this.field(out, context, field);
            if (tok) {
                out.tokens.push(tok);
            }
        }

        context.pop();
        return out;
    }

    primtive(parent: Expression, context: ParsingContext, schema: Def.Field) {
        return context.token(parent, this.FieldToken, schema, context.advance());
    }

    field(parent: Expression, context: ParsingContext, schema: Def.Field): TypeExpression | null {
        switch (schema.type.kind) {
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
            case Def.TypeKind.boolean:
            case Def.TypeKind.string:
            case Def.TypeKind.enum:
            case Def.TypeKind.bitmask:
                return this.primtive(parent, context, schema) as unknown as TypeExpression;
            case Def.TypeKind.array:
                return this.array(parent, context, schema) as unknown as TypeExpression;
            case Def.TypeKind.object:
                return this.object(parent, context, schema) as unknown as TypeExpression;
            default:
                throw new Error(`Invalid command field type kind: ${(schema.type as any).kind} ${JSON.stringify(schema.type)}`);
        }
    }
}
