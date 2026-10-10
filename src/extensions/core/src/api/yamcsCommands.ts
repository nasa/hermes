import Long from 'long';

import type * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import type { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { Def, Dictionary, DualKeyMap, Proto, Value } from '@gov.nasa.jpl.hermes/types';

/**
 * A Hermes dictionary of instance's commands, built from YAMCS's mission database
 * as ListCommands returns it. Each command is keyed by its YAMCS qualified name,
 * like /BigData_YamcsDeployment/CdhCore/cmdDisp/CMD_NO_OP_STRING, and keeps that
 * name in metadata.qualifiedName for issuing it.
 *
 * A YAMCS command inherits the arguments of the commands it builds on, and any
 * command in that chain can fix an argument's value. The command's arguments here
 * are the ones nothing fixes, and metadata.assignments holds the fixed values,
 * such as the OpCode fprime-yamcs assigns.
 */
export function yamcsDictionary(instance: string, commands: readonly Rpc.YamcsCommandInfo[]): Proto.IDictionary {
    const dictionary = new Dictionary({ name: instance, type: 'yamcs' });
    const namespace = dictionary.get('');
    for (const info of commands) {
        if (info.qualifiedName && info.name) {
            namespace.addCommand(info.qualifiedName, yamcsCommand(info));
        }
    }
    return { ...dictionary.toProto(), id: `yamcs:${instance}` };
}

function yamcsCommand(info: Rpc.YamcsCommandInfo): Def.Command {
    const qualifiedName = info.qualifiedName!;
    // YAMCS orders a command's arguments from the root of its base command chain down, and cells take them
    // in that order, so we collect the chain root first
    const chain: Rpc.YamcsCommandInfo[] = [];
    for (let c: Rpc.YamcsCommandInfo | undefined = info; c; c = c.baseCommand) {
        chain.unshift(c);
    }
    const assignments = Object.fromEntries(chain.flatMap((c) => c.argumentAssignment ?? []).map((a) => [a.name, a.value]));
    const command: Def.Command = {
        mnemonic: info.name!,
        component: qualifiedName.substring(0, qualifiedName.lastIndexOf('/')),
        arguments: [],
        metadata: { description: info.shortDescription || info.longDescription, qualifiedName, assignments },
    };

    try {
        command.arguments = chain.flatMap((c) => c.argument ?? [])
            .filter((arg) => !Object.hasOwn(assignments, arg.name!))
            .map((arg) => ({ name: arg.name!, type: argumentType(arg.type!), metadata: { description: arg.description } }));
    } catch (err) {
        // The sequence language shows this as an error wherever the command is used
        command.metadata!.error = (err as Error).message;
    }
    return command;
}

/**
 * The Hermes type for a YAMCS argument type. YAMCS names its kinds by engType.
 * Every array's engType ends in a single [], even for an array of arrays, so we
 * read the element from elementType.
 */
function argumentType(type: Rpc.YamcsArgumentTypeInfo): Def.Type {
    if (type.engType?.endsWith('[]')) {
        // YAMCS only issues arrays with one dimension. A dimension can also take its size from another argument
        // or a parameter, which a Hermes array can't express.
        const [dimension, ...more] = type.dimensions ?? [];
        if (dimension?.fixedValue === undefined || more.length > 0) {
            throw new Error(`${type.name} isn't a fixed-size array with one dimension, which isn't supported`);
        }
        return { kind: Def.TypeKind.array, name: type.name, type: argumentType(type.elementType!), size: Number(dimension.fixedValue) };
    }

    switch (type.engType) {
        case 'integer':
            return integerType(type);
        case 'float':
            return { kind: type.dataEncoding?.sizeInBits === 32 ? Def.TypeKind.f32 : Def.TypeKind.f64 };
        case 'string':
            return { kind: Def.TypeKind.string, maxLength: type.maxChars };
        case 'boolean':
            return { kind: Def.TypeKind.boolean };
        case 'enumeration':
            return {
                kind: Def.TypeKind.enum,
                name: type.name ?? '',
                values: new DualKeyMap('value', (type.enumValue ?? []).map((e) => [e.label!, {
                    name: e.label!,
                    value: Number(e.value),
                    metadata: { description: e.description },
                } satisfies Def.EnumItem])),
            };
        case 'aggregate':
            return {
                kind: Def.TypeKind.object,
                name: type.name,
                fields: (type.member ?? []).map((m) => ({
                    name: m.name!,
                    type: argumentType(m.type!),
                    metadata: { description: m.shortDescription || m.longDescription },
                })),
            };
        default:
            throw new Error(`${type.name} has engType ${type.engType}, which isn't supported`);
    }
}

/**
 * The smallest Hermes integer that holds a YAMCS integer type, whose width can be
 * any number of bits. When the width or YAMCS's valid range is narrower than that
 * integer, we set min and max so the editor flags values YAMCS would refuse.
 */
function integerType(type: Rpc.YamcsArgumentTypeInfo): Def.NumberType {
    const bits = type.dataEncoding?.sizeInBits ?? 64;
    const signed = type.signed!;
    const width = [8, 16, 32, 64].find((w) => bits <= w) ?? 64;
    const kinds: Record<number, Def.NumberTypeKind> = signed
        ? { 8: Def.TypeKind.i8, 16: Def.TypeKind.i16, 32: Def.TypeKind.i32, 64: Def.TypeKind.i64 }
        : { 8: Def.TypeKind.u8, 16: Def.TypeKind.u16, 32: Def.TypeKind.u32, 64: Def.TypeKind.u64 };
    const out: Def.NumberType = { kind: kinds[width] };
    // Dictionary.fromProto keeps a range only when it has both ends, so we fill a missing end from the width
    if (bits < width || type.rangeMin !== undefined || type.rangeMax !== undefined) {
        const lowest = signed ? -(2 ** (bits - 1)) : 0;
        const highest = signed ? 2 ** (bits - 1) - 1 : 2 ** bits - 1;
        out.min = Math.max(lowest, type.rangeMin ?? -Infinity);
        out.max = Math.min(highest, type.rangeMax ?? Infinity);
    }
    return out;
}

/**
 * The arguments of cmd as IssueCommand takes them, keyed by argument name
 */
export function yamcsArguments(cmd: CommandValue): Record<string, Rpc.YamcsArgumentValue> {
    return Object.fromEntries(cmd.def.arguments.map((arg, i) => [arg.name, argumentValue(cmd.args[i])]));
}

/**
 * Converts an argument value from a notebook cell into the protobuf Value that
 * YAMCS reads arguments from. YAMCS then checks it against the argument's type.
 */
export function argumentValue(value: Value): Rpc.YamcsArgumentValue {
    if (typeof value === 'string') {
        return { stringValue: value };
    } else if (typeof value === 'number') {
        return { numberValue: value };
    } else if (typeof value === 'boolean') {
        return { boolValue: value };
    } else if (Long.isLong(value) || typeof value === 'bigint') {
        // A protobuf Value holds numbers as doubles, which can't hold every 64-bit integer, and YAMCS also
        // parses integers from text. So we send 64-bit integers as text: a cell's Long, or a bigint from a
        // decoded BigInt64Array or BigUint64Array.
        return { stringValue: value.toString() };
    } else if (Array.isArray(value) || ArrayBuffer.isView(value)) {
        return { listValue: { values: Array.from(value as ArrayLike<Value>, argumentValue) } };
    } else {
        return {
            structValue: {
                fields: Object.fromEntries(Object.entries(value).map(([name, member]) => [name, argumentValue(member)])),
            },
        };
    }
}

// Statuses YAMCS gives a step that failed
const failedStatuses = ['NOK', 'TIMEOUT', 'CANCELLED'];

/**
 * Whether YAMCS has sent the command in entry. YAMCS records each step of
 * sending a command in the command's history as <step>_Status, for example
 * Acknowledge_Queued_Status, and why a step failed as <step>_Message. So we
 * return true once Acknowledge_Sent_Status is OK, false while YAMCS is still
 * working on it, and throw YAMCS's reason once any step has failed before YAMCS
 * sent it.
 *
 * We check for sent first because later steps can still record a failure status
 * for a sent command. For example, once a verifier has completed the command,
 * YAMCS marks the verifiers still pending CANCELLED.
 */
export function commandSent(entry: Rpc.YamcsCommandHistoryEntry): boolean {
    const attributes = new Map((entry.attr ?? []).map((a) => [a.name, a.value?.stringValue]));
    if (attributes.get('Acknowledge_Sent_Status') === 'OK') {
        return true;
    }
    for (const [name, status] of attributes) {
        if (name?.endsWith('_Status') && status && failedStatuses.includes(status)) {
            const step = name.slice(0, -'_Status'.length);
            const reason = attributes.get(`${step}_Message`);
            throw new Error(`YAMCS did not send ${entry.commandName}: ${step} ${status}${reason ? `, ${reason}` : ''}`);
        }
    }
    return false;
}
