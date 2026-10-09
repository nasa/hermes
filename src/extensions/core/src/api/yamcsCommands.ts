import type * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import { Def, Dictionary, DualKeyMap, Proto } from '@gov.nasa.jpl.hermes/types';

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
