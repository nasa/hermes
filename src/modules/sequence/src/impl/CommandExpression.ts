import * as vscode from 'vscode';
import { Def, DictionaryNamespace, Value } from '@gov.nasa.jpl.hermes/types';

import { Expression, TerminalToken } from '../common';
import { MnemonicToken } from './MnemonicToken';
import { BaseTypeExpression, TypeExpression } from './TypeExpression';
import { commandSignature, range } from '../util';

export interface CommandOptions {
    /**
     * Don't wait for the command to reply before resolving the command promise
     * This promise will resolve once the command is sent to the FSW.
     */
    noWait: boolean;
}

export interface CommandValue {
    // Command definition
    def: Def.Command;

    // Command arguments
    args: Value[];

    /**
     * Optional execution options to include in command dispatch
     */
    options?: Partial<CommandOptions>;

    // Additional fields associated with this command
    // This has flight-software specific meaning
    metadata?: Record<string, string>;
}

export class CommandExpression<
    MneomnicTokenT extends MnemonicToken = MnemonicToken,
    TypeExpressionT extends BaseTypeExpression = TypeExpression
> implements Expression<DictionaryNamespace | undefined> {
    mnemonic: MneomnicTokenT | undefined;
    args: TypeExpressionT[] = [];
    options: Partial<CommandOptions>;

    constructor(
        public def: Def.Command | undefined,
        readonly schema: DictionaryNamespace | undefined,
        readonly index: number,
    ) {
        this.options = {};
    }

    parse(): CommandValue {
        if (!this.def) {
            throw new Error(`Command not found ${this.mnemonic?.token.text}`);
        }

        const exprs = [
            ...(this.validate() ?? []),
            ...(this.mnemonic?.validate() ?? []),
            ...this.args.flatMap(v => v.validate?.())
        ]?.filter(v => v !== null && v !== undefined)
            .filter(v => v?.severity === vscode.DiagnosticSeverity.Error);

        const errors = exprs;
        if (errors?.length) {
            throw new Error(errors.map(v => v.message).join('\n'));
        }

        return {
            def: this.def,
            args: this.args.map(v => {
                try {
                    return v.parse();
                } catch (e) {
                    throw new Error(`Argument ${v.schema.name}: ${(<Error>e).message}`);
                }
            }),
            options: this.options,
        };
    }

    *traverse(): Generator<Expression | TerminalToken> {
        if (this.mnemonic) {
            yield this.mnemonic;
        }

        if (this.args) {
            for (const arg of this.args) {
                yield arg;
            }
        }
    }

    signature() {
        return this.def ? commandSignature(this.def) : null;
    }

    validate(): vscode.Diagnostic[] | null | undefined {
        if (!this.def) {
            return;
        }

        const lastArg = this.args?.length ? this.args[this.args.length - 1] : this.mnemonic;

        // Check to make sure the number of arguments are ok
        if ((this.args?.length ?? 0) < this.def.arguments.length) {
            const pos = lastArg ? range(lastArg)?.end ?? this.mnemonic!.token.range.end : this.mnemonic!.token.range.end;
            return [
                new vscode.Diagnostic(
                    new vscode.Range(pos, pos),
                    `Expected ${this.def.arguments.length} arguments but got ${this.args.length}`
                )
            ];
        } else if ((this.args?.length ?? 0) > this.def.arguments.length) {
            return [
                new vscode.Diagnostic(
                    new vscode.Range(
                        range(this.args[this.def.arguments.length])!.start,
                        range(this.args[this.args.length - 1])!.end,
                    ),
                    `Expected ${this.def.arguments.length} arguments but got ${this.args.length}`
                )
            ];
        }
    }
}
