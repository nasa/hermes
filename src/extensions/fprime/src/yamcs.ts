import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';
import { Def, Dictionary, Proto, Value } from '@gov.nasa.jpl.hermes/types';

// Builds an F Prime dictionary from the one YAMCS mode builds for an instance that fprime-yamcs runs
export function fprimeDictionary(yamcsDictionary: Proto.IDictionary): Proto.IDictionary | undefined {
    // fprime-yamcs assigns each command's opcode to an argument called OpCode. F Prime identifies a
    // command by its opcode, so we leave out a command that has no OpCode assignment.
    const commands = [...Dictionary.fromProto(yamcsDictionary).get('').getCommands()]
        .filter((cmd) => cmd.metadata?.assignments?.OpCode !== undefined);
    // If no command has an OpCode assignment, fprime-yamcs doesn't run this instance, so we build no dictionary
    if (commands.length === 0) {
        return undefined;
    }

    const out = new Dictionary({ name: `${yamcsDictionary.head?.name} (F Prime)`, type: 'fprime' });
    for (const cmd of commands) {
        // We name the command the way F Prime does, like CdhCore.cmdDisp.CMD_NO_OP. cmd.component is like
        // /BigData_YamcsDeployment/CdhCore/cmdDisp, so we drop its leading slash and the deployment.
        const component = cmd.component.split('/').slice(2).join('.');
        out.get('').addCommand(`${component}.${cmd.mnemonic}`, {
            // cmd's metadata has the qualified name, which YAMCS mode uses to issue the command
            ...cmd,
            component,
            opcode: Number(cmd.metadata?.assignments?.OpCode),
            arguments: cmd.arguments.map((arg) => ({ ...arg, type: fprimeType(arg.type) })),
        });
    }
    return { ...out.toProto(), id: `${yamcsDictionary.id}:fprime` };
}

function fprimeType(type: Def.Type): Def.Type {
    switch (type.kind) {
        case Def.TypeKind.enum:
            // fprime-yamcs makes F Prime's bool an enumeration called bool, labelled False and True.
            // We turn it back into a boolean so cells keep writing true and false.
            return type.name === 'bool' ? { kind: Def.TypeKind.boolean } : type;
        case Def.TypeKind.array:
            return { ...type, type: fprimeType(type.type) };
        case Def.TypeKind.object:
            return { ...type, fields: type.fields.map((field) => ({ ...field, type: fprimeType(field.type) })) };
        default:
            return type;
    }
}

function yamcsValue(value: Value): Value {
    if (typeof value === 'boolean') {
        // We send a boolean as True or False, the labels of fprime-yamcs's bool enumeration. YAMCS
        // refuses a protobuf boolean for that enumeration.
        return value ? 'True' : 'False';
    } else if (Array.isArray(value)) {
        return value.map(yamcsValue);
    } else if (typeof value === 'object' && value.constructor === Object) {
        // Only a plain object is a struct. A 64-bit integer is also an object, a Long, which we send unchanged.
        return Object.fromEntries(Object.entries(value).map(([name, member]) => [name, yamcsValue(member)]));
    }
    return value;
}

// The part of Core's API that raises YAMCS mode's events. Hermes.Api doesn't declare it.
export interface YamcsEventSource {
    onYamcsEvents(handler: (instance: string, events: YamcsEvent[]) => void): vscode.Disposable;
}

// The events F Prime's command dispatcher raises to say how a command ended
const completionEvents = ['OpCodeCompleted', 'OpCodeError', 'InvalidCommand'];

// The event's name without its component instance, like OpCodeCompleted
function eventName(event: YamcsEvent): string {
    return event.type?.split('.').pop() ?? '';
}

// A command that is waiting for its completion event
interface Waiter {
    opcode?: number;
    // We call done with the command's completion event, or with undefined if the connection changes
    done: (event: YamcsEvent | undefined) => void;
}

// Runs F Prime cells on YAMCS mode's connection
export class YamcsRunner implements vscode.Disposable {
    private readonly waiting = new Set<Waiter>();
    private readonly subscriptions: vscode.Disposable[];

    constructor(api: Hermes.Api) {
        this.subscriptions = [
            // One subscription passes each completion event to the command that is waiting for it
            (api as Hermes.Api & YamcsEventSource).onYamcsEvents((_, events) => {
                for (const event of events) {
                    if (!completionEvents.includes(eventName(event))) {
                        continue;
                    }
                    // A completion event has its command's opcode in an argument called Opcode, which fprime-yamcs
                    // puts in the event's extra map. A Set iterates in the order its members were added, so the
                    // first match is the command that has waited longest for that opcode, and we end its wait.
                    const opcode = Number(event.extra?.Opcode);
                    const waiter = [...this.waiting].find((w) => w.opcode === opcode);
                    if (waiter) {
                        this.waiting.delete(waiter);
                        waiter.done(event);
                    }
                }
            }),
            // Each time YAMCS mode connects, it sends its subscribers the newest events in YAMCS's archive. An
            // archived completion event could end a waiting command's wait, so we fail every waiting command
            // when the connection changes.
            api.onFswChange(() => {
                this.waiting.forEach((waiter) => waiter.done(undefined));
                this.waiting.clear();
            }),
        ];
    }

    async run(fsw: Hermes.Fsw, seq: Hermes.CommandSequence, token: vscode.CancellationToken): Promise<boolean> {
        if (!fsw.command) {
            throw new Error(`${fsw.id} can't run F Prime commands`);
        }

        for (const cmd of seq.commands) {
            // We wait for the command's relative time tag to pass
            await cancellable(delay(Number(cmd.metadata?.relativeTimeDelayMs ?? 0)), token);

            // We start waiting for the completion event before we send the command. The event can reach us
            // before fsw.command resolves, and we drop an event if no command is waiting for it.
            const { promise: completion, resolve: done } = deferred<YamcsEvent | undefined>();
            const waiter: Waiter = { opcode: cmd.def.opcode, done };
            this.waiting.add(waiter);

            const name = `${cmd.def.component}.${cmd.def.mnemonic}`;
            try {
                await fsw.command({ ...cmd, args: cmd.args.map(yamcsValue) }, token);
                // We wait for the completion event. If the user stops the cell, cancellable throws. If the
                // connection changes, we get undefined instead of an event.
                const event = await cancellable(completion, token, `Cancelled before ${name} completed. YAMCS already sent it.`);
                if (!event) {
                    throw new Error(`Hermes lost YAMCS mode's connection before ${name} completed, so its result is unknown`);
                }
                // The cell stops at the first command that fails, with the message of the event that reported the failure
                if (eventName(event) !== 'OpCodeCompleted') {
                    throw new Error(`${name} failed: ${event.message}`);
                }
            } finally {
                // A failed send or a stopped cell leaves the waiter behind. We remove it so that it can't
                // receive the completion event of a later command with the same opcode.
                this.waiting.delete(waiter);
            }
        }
        return true;
    }

    dispose() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// A promise and the function that resolves it
function deferred<T>() {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((r) => { resolve = r; });
    return { promise, resolve };
}

// Waits for promise, but rejects with message as soon as token is cancelled
function cancellable<T>(promise: Promise<T>, token: vscode.CancellationToken, message = 'Cancelled'): Promise<T> {
    return new Promise((resolve, reject) => {
        const onCancel = token.onCancellationRequested(() => reject(new Error(message)));
        if (token.isCancellationRequested) {
            reject(new Error(message));
        }
        promise.then(resolve, reject).finally(() => onCancel.dispose());
    });
}
