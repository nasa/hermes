import { Range } from "vscode";
import { Token } from "./common";

export interface TokenizeOptions {
    /**
     * Prefix to use for striping out comments
     * Default: '#'
     */
    commentPrefix: string;

    /**
     * Trim the whitespace around every token and the entire line
     */
    trim: boolean;
}

export function tokenizeLine(
    line: string,
    lineNo: number,
    options?: Partial<TokenizeOptions>
): Token[] {
    const opts: TokenizeOptions = {
        commentPrefix: '#',
        trim: true,
        ...options
    };

    // Trim comment
    const commentIndex = line.indexOf(opts.commentPrefix);
    if (commentIndex >= 0) {
        line = line.substring(0, commentIndex);
    }

    // Remove indent
    const dedentedLine = line.trimStart();
    const indent = line.length - dedentedLine.length;
    line = dedentedLine;

    if (line.trim().length === 0) {
        // empty line
        return [];
    }

    // Parse the Sequence command
    // Split by one or multiple spaces
    let lastToken = 0;
    const tokens: Token[] = [];
    const originalLine = line;

    // Trailing whitespace should not be parsed as a token
    if (opts.trim) {
        line = line.trimEnd();
    }

    // Replace delimiters in quoted areas with '*'s
    for (const v of [/"[^"]*"/g, /'[^']*'/g]) {
        [...line.matchAll(v)].forEach(quoted => {
            if (quoted === null ||
                quoted === undefined ||
                quoted.index === undefined) {
                return;
            }

            line = line.substring(0, quoted.index) + ("*".repeat(quoted[0].length)) +
                line.substring(quoted.index + quoted[0].length);
        });
    }

    // Replace ',' with spaces
    // Normalizes the delimiters to make the matching simpler
    line = line.replace(/,/gi, " ");

    // Split the line by multi space
    [...line.matchAll(/\s+/g)].forEach(whitespace => {
        if (whitespace === null ||
            whitespace === undefined ||
            whitespace.index === undefined) {
            return;
        }

        tokens.push({
            text: originalLine.substring(lastToken, whitespace.index),
            range: new Range(lineNo, lastToken + indent, lineNo, whitespace.index + indent)
        });

        lastToken = whitespace.index + whitespace[0].length;
    });

    tokens.push({
        text: originalLine.substring(lastToken, line.length),
        range: new Range(lineNo, lastToken + indent, lineNo, line.length + indent)
    });

    return tokens;
}
