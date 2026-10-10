import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';
import { Def, Dictionary, Proto, Value } from '@gov.nasa.jpl.hermes/types';

/**
 * Builds an F Prime dictionary from YAMCS mode's dictionary for a YAMCS instance
 * that fprime-yamcs runs. fprime-yamcs gives each command a qualified name made
 * of the deployment, the component instance's path and the command's name, like
 * /BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING, and fixes its opcode
 * with an argument assignment called OpCode. So we name each command the way F Prime
 * does, CdhCore.cmdDisp.CMD_NO_OP_STRING, and take its opcode from that assignment.
 * Each command keeps its qualified name in its metadata, since YAMCS mode issues
 * commands by that name.
 *
 * We match each command to its completion event by opcode, so we leave out commands
 * without an OpCode assignment. If no command has one, the instance isn't one
 * fprime-yamcs runs, so we return undefined.
 */
export function fprimeDictionary(yamcs: Proto.IDictionary): Proto.IDictionary | undefined {
    const out = new Dictionary({ name: `${yamcs.head?.name} (F Prime)`, type: 'fprime' });
    const namespace = out.get('');
    let count = 0;
    for (const cmd of Dictionary.fromProto(yamcs).get('').getCommands()) {
        const opcode = cmd.metadata?.assignments?.OpCode;
        if (opcode === undefined) {
            continue;
        }
        // In YAMCS mode's dictionary, a command's component is its qualified name without the command's name, which
        // splits on / into an empty string, the deployment and the component's path
        const component = cmd.component.split('/').slice(2).join('.');
        namespace.addCommand(`${component}.${cmd.mnemonic}`, {
            ...cmd,
            component,
            opcode: Number(opcode),
            arguments: cmd.arguments.map((arg) => ({ ...arg, type: fprimeType(arg.type) })),
        });
        count++;
    }
    return count > 0 ? { ...out.toProto(), id: `${yamcs.id}:fprime` } : undefined;
}

// fprime-yamcs makes F Prime's bool an enumeration called bool, labelled False and True.
// We turn it back into a boolean so cells keep writing true and false.
function fprimeType(type: Def.Type): Def.Type {
    switch (type.kind) {
        case Def.TypeKind.enum:
            return type.name === 'bool' ? { kind: Def.TypeKind.boolean } : type;
        case Def.TypeKind.array:
            return { ...type, type: fprimeType(type.type) };
        case Def.TypeKind.object:
            return { ...type, fields: type.fields.map((field) => ({ ...field, type: fprimeType(field.type) })) };
        default:
            return type;
    }
}

// fprime-yamcs's bool enumeration takes its label, True or False, but YAMCS refuses a protobuf
// boolean for it, so we send each boolean as its label. Cells parse U64 and I64 arguments into
// Long objects, so we look inside plain objects only, which are structs.
function yamcsValue(value: Value): Value {
    if (typeof value === 'boolean') {
        return value ? 'True' : 'False';
    } else if (Array.isArray(value)) {
        return value.map(yamcsValue);
    } else if (typeof value === 'object' && value.constructor === Object) {
        return Object.fromEntries(Object.entries(value).map(([name, member]) => [name, yamcsValue(member)]));
    }
    return value;
}

// Core's API, VscodeApi, raises YAMCS mode's events through onYamcsEvents, which Hermes.Api doesn't declare
interface YamcsEventSource {
    onYamcsEvents(handler: (instance: string, events: YamcsEvent[]) => void): vscode.Disposable;
}

// F Prime's command dispatcher reports how each command ended with one of these events.
// fprime-yamcs gives each event a type like CdhCore.cmdDisp.OpCodeCompleted, and puts the
// event's arguments, such as the command's Opcode, in its extra map, keyed by name.
const completionEvents = ['OpCodeCompleted', 'OpCodeError', 'InvalidCommand'];

// The event's name without its component instance, like OpCodeCompleted
function eventName(event: YamcsEvent): string {
    return event.type?.split('.').pop() ?? '';
}

interface Waiter {
    opcode?: number;
    // Takes the command's completion event, or undefined when Hermes drops YAMCS mode's connection
    done: (event: YamcsEvent | undefined) => void;
}

/**
 * Runs F Prime cells on YAMCS mode's connection. Each command waits out its relative
 * time tag, goes out through YAMCS, and then waits for the flight software's completion
 * event with its opcode. The cell stops at the first command that fails, with the event
 * that says why. Each completion event completes the oldest command waiting on its
 * opcode.
 *
 * When the first handler subscribes to YAMCS mode's events, YAMCS mode sends the
 * newest events in YAMCS's archive, which can include an old completion with the
 * opcode of a command we send. So we subscribe once, for as long as the extension
 * runs, and the archived events arrive right after YAMCS mode connects, normally
 * before any cell runs. A reconnect sends them again, so on any connection change
 * we stop waiting for every command.
 */
export class YamcsRunner implements vscode.Disposable {
    private readonly waiting: Waiter[] = [];
    private readonly subscription: vscode.Disposable;
    private readonly connectionChanges: vscode.Disposable;

    constructor(api: Hermes.Api) {
        this.connectionChanges = api.onFswChange(() => this.waiting.splice(0).forEach((w) => w.done(undefined)));
        this.subscription = (api as Hermes.Api & YamcsEventSource).onYamcsEvents((_, events) => {
            for (const event of events) {
                if (!completionEvents.includes(eventName(event))) {
                    continue;
                }
                const i = this.waiting.findIndex((w) => w.opcode === Number(event.extra?.Opcode));
                if (i >= 0) {
                    this.waiting.splice(i, 1)[0].done(event);
                }
            }
        });
    }

    async run(fsw: Hermes.Fsw, seq: Hermes.CommandSequence, token: vscode.CancellationToken): Promise<boolean> {
        if (!fsw.command) {
            throw new Error(`${fsw.id} can't run F Prime commands`);
        }

        for (const cmd of seq.commands) {
            await cancellable(delay(Number(cmd.metadata?.relativeTimeDelayMs ?? 0)), token);

            const name = `${cmd.def.component}.${cmd.def.mnemonic}`;
            // fsw.command resolves once YAMCS has sent the command, and the flight software's completion
            // event can reach us before then. We drop events no command is waiting for, so we start waiting first.
            let waiter!: Waiter;
            const completion = new Promise<YamcsEvent | undefined>((done) => {
                waiter = { opcode: cmd.def.opcode, done };
            });
            this.waiting.push(waiter);

            try {
                await fsw.command({ ...cmd, args: cmd.args.map(yamcsValue) }, token);
                const event = await cancellable(completion, token);
                if (!event) {
                    throw new Error(`Hermes lost YAMCS mode's connection before ${name} completed, so its result is unknown`);
                }
                if (eventName(event) !== 'OpCodeCompleted') {
                    throw new Error(`${name} failed: ${event.message}`);
                }
            } finally {
                // If sending failed or the cell was cancelled, this waiter is still listed. Such a command may never
                // report back, so we drop its waiter rather than let it take the completion of a later command with
                // the same opcode.
                const i = this.waiting.indexOf(waiter);
                if (i >= 0) {
                    this.waiting.splice(i, 1);
                }
            }
        }
        return true;
    }

    dispose() {
        this.subscription.dispose();
        this.connectionChanges.dispose();
    }
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Settles as promise does, or rejects as soon as token is cancelled
function cancellable<T>(promise: Promise<T>, token: vscode.CancellationToken): Promise<T> {
    return new Promise((resolve, reject) => {
        const onCancel = token.onCancellationRequested(() => reject(new Error('Cancelled')));
        if (token.isCancellationRequested) {
            reject(new Error('Cancelled'));
        }
        promise.then(resolve, reject).finally(() => onCancel.dispose());
    });
}
