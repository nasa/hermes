import {
    TerminalToken,
    TerminalTokenConstructor,
    Token,
    Expression,
} from './common';
import { InvalidRange, NextRange } from './util';

export interface ParsingFrame {
    schema: unknown;
    index: number;
}

export class ParsingContext {
    next?: TerminalToken;
    nextOptional: boolean;
    protected lastToken?: Token;
    protected lineNo: number;

    /**
     * Indicies in each parsing frame
     */
    private stack: ParsingFrame[];
    tokens: Token[];

    constructor() {
        this.tokens = [];
        this.stack = [];
        this.lineNo = 0;
        this.nextOptional = false;
    }

    empty() {
        return this.tokens.length === 0;
    }

    done() {
        return this.empty() && this.next !== undefined;
    }

    /**
     * Create a placeholder token to fill in text and range for
     * token that is not provided
     */
    placeHolderToken(): Token {
        return {
            text: '',
            range: this.next ? new InvalidRange() : new NextRange(
                this.lastToken?.range.end ?? {
                    line: this.lineNo,
                    character: 0
                }
            )
        };
    }

    token<
        S,
        V,
        E extends Expression<unknown>,
        Terminal extends TerminalToken<any, V>
    >(
        parent: E,
        constructor: TerminalTokenConstructor<S, V, E, Terminal>,
        schema: S,
        index: number,
        returnPlaceholder: true
    ): Terminal;

    token<
        S,
        V,
        E extends Expression<unknown>,
        Terminal extends TerminalToken<any, V>
    >(
        parent: E,
        constructor: TerminalTokenConstructor<S, V, E, Terminal>,
        schema: S,
        index: number
    ): Terminal | null;

    token<
        S,
        V,
        E extends Expression<unknown>,
        Terminal extends TerminalToken<any, V>
    >(
        parent: E,
        constructor: TerminalTokenConstructor<S, V, E, Terminal>,
        schema: S,
        index: number,
        returnPlaceholder?: boolean
    ): Terminal | null {
        const tok = this.tokens.shift();
        if (tok) {
            this.lastToken = tok;
            return new constructor(parent, schema, index, tok);
        } else {
            // Fill in the expected next token
            const placeHolder = new constructor(parent, schema, index, this.placeHolderToken());
            placeHolder.isOptional = this.nextOptional;

            if (!this.next) {
                this.next = placeHolder;
            }

            if (returnPlaceholder) {
                return placeHolder;
            }

            return null;
        }
    }

    push(schema: unknown) {
        this.stack.push({ index: 0, schema });
    }

    pop() {
        if (this.stack.length === 0) {
            throw new Error('Parsing stack underflow');
        }
        this.stack.pop();
    }

    advance(): number {
        if (this.stack.length === 0) {
            return 0;
        }

        return this.stack[this.stack.length - 1].index++;
    }

    set(tokens: Token[], lineNo: number) {
        this.tokens = tokens;
        this.stack = [];
        this.next = undefined;
        this.lastToken = undefined;
        this.lineNo = lineNo;
        this.nextOptional = false;
    }
}
