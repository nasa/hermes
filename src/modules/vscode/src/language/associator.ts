import * as vscode from 'vscode';
import { TerminalToken, Token } from "@gov.nasa.jpl.hermes/sequence";

interface IPosition {
    line: number;
    character: number;
}

export function tokenContainsPosition(token: Token, position: IPosition): boolean {
    return (
        token.range.start.character <= position.character &&
        position.character <= token.range.end.character
    );
}

export class RangeAssociator implements Iterable<TerminalToken> {
    private lines = new Map<number, TerminalToken[]>();

    *[Symbol.iterator](): Iterator<TerminalToken> {
        for (const [_, tokens] of this.lines) {
            for (const token of tokens) {
                yield token;
            }
        }
    }

    clear() {
        this.lines.clear();
    }

    add(value: TerminalToken) {
        const range = value.token.range;
        if (range.start.line !== range.end.line) {
            throw new Error(`Invalid token range across multiple lines from token: ${JSON.stringify(value)}`);
        }

        for (let line = range.start.line; line <= range.end.line; line++) {
            if (!this.lines.has(line)) {
                this.lines.set(line, [value]);
            } else {
                this.lines.get(line)!.push(value);
            }
        }
    }

    *all(range: vscode.Range): Iterable<TerminalToken> {
        for (let lineI = range.start.line; lineI <= range.end.line; lineI++) {
            const tokens = this.lines.get(lineI);
            if (!tokens) {
                continue;
            }

            for (const tok of tokens) {
                // Check if the token range overlaps the requested range
                if (range.intersection(tok.token.range)) {
                    yield tok;
                }
            }
        }
    }

    get(position: IPosition): TerminalToken | undefined {
        const tokens = this.lines.get(position.line);
        if (!tokens) {
            return undefined;
        }

        for (const tok of tokens) {
            // Check if the position is contained in the range
            if (tokenContainsPosition(tok.token, position)) {
                return tok;
            }
        }
    }

    getClose(position: IPosition, where: 'before' | 'after'): TerminalToken | undefined {
        // Get the token who's end is closest to this position
        const tokens = this.lines.get(position.line);
        if (!tokens) {
            return undefined;
        }

        let distance = where === 'before' ? Infinity : -Infinity;
        let chosen: TerminalToken | undefined;
        for (const tok of tokens) {
            if (tokenContainsPosition(tok.token, position)) {
                return tok;
            }

            // Check if the position is contained in the range
            const newDistance = position.character - tok.token.range.end.character;
            if (where === 'before') {
                if (newDistance > 0 && newDistance < distance) {
                    distance = newDistance;
                    chosen = tok;
                }
            } else {
                if (newDistance < 0 && newDistance > distance) {
                    distance = newDistance;
                    chosen = tok;
                }
            }
        }

        return chosen;
    }
}
