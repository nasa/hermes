import { Expression, TerminalToken } from '../common';

export class NextTokenExpression implements Expression<undefined> {
    parent?: Expression;
    index: number;
    schema: undefined;

    nextTokens: TerminalToken[];

    constructor() {
        this.nextTokens = [];
        this.index = -1;
    }

    add(token: TerminalToken) {
        this.nextTokens.push(token);
    }

    clear() {
        this.nextTokens = [];
    }

    parse() {
        return;
    }

    *traverse() {
        for (const tok of this.nextTokens) {
            yield tok;
        }
    }
}
