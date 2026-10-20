import * as vscode from 'vscode';

import * as Hermes from '@gov.nasa.jpl.hermes/api';
import { Def, Dictionary, Proto, Value } from '@gov.nasa.jpl.hermes/types';

// Builds an F Prime dictionary from the one YAMCS mode builds for an instance that fprime-yamcs runs
export function fprimeDictionary(yamcsDictionary: Proto.IDictionary): Proto.IDictionary | undefined {
    // fprime-yamcs assigns each F Prime command's opcode to an argument called OpCode, so a command with no
    // OpCode assignment isn't an F Prime command and we leave it out.
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
            // cmd's metadata has the command's qualified name and verifiers. YAMCS mode uses the name to issue the
            // command, and the verifiers to tell when the command has completed.
            ...cmd,
            component,
            opcode: Number(cmd.metadata?.assignments?.OpCode),
            arguments: cmd.arguments.map((arg) => ({ ...arg, type: fprimeType(arg.type) })),
        });
    }
    return { ...out.toProto(), id: `${yamcsDictionary.id}:fprime` };
}

// Adds an F Prime dictionary for each YAMCS dictionary that doesn't have one yet, and removes an F Prime dictionary
// whose YAMCS dictionary is gone
export async function updateFprimeDictionaries(api: Hermes.Api): Promise<void> {
    const dictionaries = await api.allDictionaries();
    for (const [id, head] of Object.entries(dictionaries)) {
        // The extension calls this on every dictionary change, and adding a dictionary fires another change, so we
        // skip a YAMCS dictionary that already has its F Prime dictionary
        if (head.type === 'yamcs' && !dictionaries[`${id}:fprime`]) {
            const dictionary = fprimeDictionary(await api.getDictionary(id));
            if (dictionary) {
                await api.addDictionary(dictionary);
            }
        }
        // We remove an F Prime dictionary like yamcs:fprime-project:fprime once yamcs:fprime-project is gone
        const yamcsId = id.match(/^(yamcs:.+):fprime$/)?.[1];
        if (yamcsId && !dictionaries[yamcsId]) {
            await api.removeDictionary(id);
        }
    }
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

// Runs an F Prime cell's commands on YAMCS mode's connection
export async function runOnYamcs(
    fsw: Hermes.Fsw,
    seq: Hermes.CommandSequence,
    token: vscode.CancellationToken,
    onState?: Hermes.CommandStateHandler,
    onWait?: (ms: number) => void,
): Promise<boolean> {
    if (!fsw.command) {
        throw new Error(`${fsw.id} can't run F Prime commands`);
    }

    for (const cmd of seq.commands) {
        // We wait for the command's relative time tag to pass. If that takes any time, we tell the cell how long the wait is.
        const wait = Number(cmd.metadata?.relativeTimeDelayMs ?? 0);
        if (wait > 0) {
            onWait?.(wait);
        }
        await cancellable(delay(wait), token);
        // YAMCS mode's fsw.command waits for YAMCS's verdict on the command and throws if the command failed.
        // A command without verifiers gets no verdict, so fsw.command returns once YAMCS has sent it.
        await fsw.command({ ...cmd, args: cmd.args.map(yamcsValue) }, token, onState);
    }
    return true;
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Waits for promise, but rejects as soon as token is cancelled
function cancellable<T>(promise: Promise<T>, token: vscode.CancellationToken): Promise<T> {
    return new Promise((resolve, reject) => {
        const onCancel = token.onCancellationRequested(() => reject(new Error('Cancelled')));
        if (token.isCancellationRequested) {
            reject(new Error('Cancelled'));
        }
        promise.then(resolve, reject).finally(() => onCancel.dispose());
    });
}
