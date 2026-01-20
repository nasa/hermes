import * as vscode from 'vscode';

import { Def } from "@gov.nasa.jpl.hermes/types";

import { FieldToken } from "../impl/FieldToken";
import { TypeParser } from '../impl/TypeExpression';
import { oldestParent, range, traverse } from '../util';
import { TerminalToken } from '../common';

interface FieldTokenConstructor {
    new(...args: any[]): FieldToken;
}

/**
 * A field token mixin that adds a code action that enumerates enum constants
 * on the parent expression over all the matches in the enum.
 * 
 * This code action replaces the entire parent rule (top-level expression) with
 * all the enum constant matches on a regex rule. It allows quick expansion of many
 * commands given some rule. Great for building parameter setting sequences.
 * @param base FieldTokenConstructor to mixin
 * @returns The mixed in class
 */
export function RegexEnumMixin<T extends FieldTokenConstructor>(base: T) {
    return class extends base {
        private getEnumExpansion(): Def.EnumItem[] | undefined {
            // Make sure this is an enum token
            if (this.schema.type.kind !== Def.TypeKind.enum) {
                return undefined;
            }

            const text = this.token.text;

            // Check if the user input a regex expression
            if (text.startsWith('/') && text.endsWith('/')) {
                const regex = new RegExp(text.substring(1, text.length - 1));

                // Get a set of all the matching tokens in this enum
                const cases: Def.EnumItem[] = [];

                for (const item of this.schema.type.values.values()) {
                    if (regex.test(item.name)) {
                        cases.push(item);
                    }
                }

                cases.sort((a, b) => a.name.localeCompare(b.name));

                if (cases.length > 0) {
                    return cases;
                }
            }
        }

        codeActions(
            document: vscode.TextDocument,
            context: vscode.CodeActionContext
        ): vscode.CodeAction[] | undefined {
            const actions = super.codeActions?.(document, context) ?? [];

            const enumCases = this.getEnumExpansion();
            if (enumCases) {
                // Get the highest parent in the AST
                const topParent = oldestParent(this.parent);

                const parentRange = range(topParent);

                if (!parentRange) {
                    return actions;
                }

                // Get all the tokens in this expression
                const parentTokens = Array.from(traverse(topParent));

                const edit = new vscode.WorkspaceEdit();
                const lines: string[] = [];
                for (const enumItem of enumCases) {
                    const line: string[] = [];
                    for (const tok of parentTokens) {
                        if (tok === this) {
                            // Replace the current token with the 'replaced' item
                            line.push(enumItem.name);
                        } else if (tok instanceof TerminalToken) {
                            // Keep all the other tokens the same
                            line.push(tok.token.text);
                        }
                    }

                    // Whitespace separation works in pretty must all cases
                    lines.push(line.join(' '));
                }

                edit.replace(
                    document.uri,
                    parentRange,
                    lines.join('\n'),
                    {
                        needsConfirmation: false,
                        label: `Expand regular expression over ${enumCases.length} matches`,
                    },
                );

                const action = new vscode.CodeAction(
                    `Expand expression regex matches over '${this.schema.name}'`,
                    vscode.CodeActionKind.QuickFix
                );

                action.edit = edit;
                action.isPreferred = true;
                action.diagnostics = [...context.diagnostics];

                actions.push(action);
            }

            return actions;
        }

        validate(): vscode.Diagnostic[] {
            const diags = super.validate();

            const enumCases = this.getEnumExpansion();
            if (enumCases) {
                diags.push(new vscode.Diagnostic(
                    this.token.range,
                    `Expand regular expression over ${enumCases.length} matches`,
                    vscode.DiagnosticSeverity.Hint
                ));
            }

            return diags;
        }
    };
}

export function RegexEnumParserMixin<
    ParserBase extends { new(...args: any[]): TypeParser; }
>(base: ParserBase) {
    return class extends base {
        constructor(...args: any[]) {
            super(...args);
            this.FieldToken = RegexEnumMixin(this.FieldToken);
        }
    };
}
