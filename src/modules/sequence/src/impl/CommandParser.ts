import { Def } from '@gov.nasa.jpl.hermes/types';

import type { ParsingContext } from '../context';
import { Expression, TerminalToken } from '../common';
import { TypeExpression, TypeParser } from "./TypeExpression";

const extraSchema: Def.Field = { name: 'additional', type: { kind: Def.TypeKind.string } };
class ExtraToken extends TerminalToken<
    Def.Field, string
> {
    parse() {
        return this.token.text;
    }
}

export function CommandParserMixin<
    ParserBase extends { new(...args: any[]): TypeParser; }
>(base: ParserBase) {
    return class extends base {
        /**
         * A helper function for parsing arguments of a command
         * This function will parse all the tokens left in the context and mark the
         * extra tokens as `ExtraToken`
         * @param context Parsing context with remaining tokens
         * @param command Command to parse tokens for
         * @returns Parsed command fields
         */
        commandHelper(
            expr: Expression,
            context: ParsingContext,
            command: Def.Command
        ): TypeExpression[] {
            context.push(null);
            const args: TypeExpression[] = [];
            for (const arg of command.arguments) {
                if (context.done()) {
                    break;
                }

                const tok = this.field(expr, context, arg);
                if (tok) {
                    args.push(tok);
                }
            }

            while (!context.empty()) {
                // Push the rest of the fields as raw schemaless tokens
                args.push(context.token(expr, ExtraToken, extraSchema, context.advance())! as unknown as TypeExpression);
            }

            context.pop();
            return args;
        }
    };
}
