/**
 * FPrime Dicitionary Parsing
 * @author Andrei Tumbar
 */

import { Def, DictionaryNamespace, DualKeyMap } from '@gov.nasa.jpl.hermes/types';
import { XMLParser } from 'fast-xml-parser';

const alwaysArray: string[] = [
    "dictionary.arrays.array",
    "dictionary.arrays.array.defaults",
    "dictionary.commands.command",
    "dictionary.commands.command.args.arg",
    "dictionary.enums.enum",
    "dictionary.enums.enum.item",
    "dictionary.events.event",
    "dictionary.events.event.args.arg",
    "dictionary.channels.channel",
    "dictionary.serializables.serializable",
    "dictionary.serializables.serializable.members.member",
    "dictionary.parameters.parameter",
];

const MAX_RAW_ARRAY_SIZE = 16;

const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
    isArray: (name: string, jpath: string) => alwaysArray.includes(jpath)
});

const tBoolean: Def.Type = { kind: Def.TypeKind.boolean };
const tU8: Def.Type = { kind: Def.TypeKind.u8 };
const tI8: Def.Type = { kind: Def.TypeKind.i8 };
const tU16: Def.Type = { kind: Def.TypeKind.u16 };
const tI16: Def.Type = { kind: Def.TypeKind.i16 };
const tU32: Def.Type = { kind: Def.TypeKind.u32 };
const tI32: Def.Type = { kind: Def.TypeKind.i32 };
const tU64: Def.Type = { kind: Def.TypeKind.u64 };
const tI64: Def.Type = { kind: Def.TypeKind.i64 };
const tF32: Def.Type = { kind: Def.TypeKind.f32 };
const tF64: Def.Type = { kind: Def.TypeKind.f64 };

export function parseFprimeXmlDictionary(rawXml: string): [DictionaryNamespace, topology: string | undefined] {
    const json = parser.parse(rawXml).dictionary;

    const out = new DictionaryNamespace();

    // Parse Enums
    if (json.enums?.enum) {
        for (const enumXml of json.enums.enum) {
            const e = enumReduce(enumXml);
            out.addType(e.name, e);
        }
    }

    // Parse Serializables
    if (json.serializables?.serializable) {
        for (const serializableXml of json.serializables.serializable) {
            const s = serializableReduce(serializableXml);
            out.addType(s.name!, s);
        }
    }

    // Parse Arrays
    if (json.arrays?.array) {
        for (const arrayXml of json.arrays.array) {
            const a = arrayReduce(arrayXml);
            out.addType(a.name!, a);
        }
    }

    // Parse the events
    if (json.events?.event) {
        for (const eventXml of json.events.event) {
            const e = eventReduce(eventXml);
            out.addEvent(`${e.component}.${e.name}`, e);
        }
    }

    // Parse the telemetry channels
    if (json.channels?.channel) {
        for (const channelXml of json.channels.channel) {
            const c = channelReduce(channelXml);
            out.addTelemetry(`${c.component}.${c.name}`, c);
        }
    }

    // Parse Commands
    if (json.commands?.command) {
        for (const commandXml of json.commands.command) {
            const c = commandReduce(commandXml);
            out.addCommand(`${c.component}.${c.mnemonic}`, c);
        }
    }

    // Parse Parameters
    if (json.parameters?.parameter) {
        for (const parameterXml of json.parameters.parameter) {
            const p = parameterReduce(out, parameterXml);
            out.addParameter(`${p.component}.${p.name}`, p);
        }
    }

    out.resolveReferences();
    return [out, json.topology];
}

function argumentReduce(argXml: any): Def.Field {
    return {
        name: argXml.name,
        type: parseType(argXml),
        metadata: {
            description: argXml.description?.trim() || ""
        }
    };
}

function commandReduce(cmdXml: any): Def.Command {
    return {
        component: cmdXml.component,
        mnemonic: cmdXml.mnemonic,
        opcode: parseInt(cmdXml.opcode, 16),
        arguments: (cmdXml.args?.arg ?? []).map((v: any) => argumentReduce(v)),
        metadata: {
            description: cmdXml.description,
        }
    };
}

function parameterReduce(dictionary: DictionaryNamespace, prmXml: any): Def.Parameter {
    const prmName = `${prmXml.component}.${prmXml.name}`;
    // The type is not explicitely included in the parameter
    // The trick is to look at the _PRM_SET command on this component
    // The 'val' argument (first argument) will have the parameter type
    const cmd = dictionary.getCommand(`${prmName}_PRM_SET`);
    if (!cmd) {
        throw new Error(`Could not find PRM_SET for ${prmName}_PRM_SET`);
    }

    return {
        component: prmXml.component,
        name: prmXml.name,
        id: parseInt(prmXml.id),
        type: cmd.arguments[0].type,
        metadata: {
            default: prmXml.default,
        }
    };
}

function channelReduce(channelXml: any): Def.Telemetry {
    return {
        component: channelXml.component,
        name: channelXml.name,
        id: parseInt(channelXml.id),
        type: parseType(channelXml),
        metadata: {
            description: channelXml.description,
            formatString: channelXml.format_string,
        }
    };
}

function eventReduce(eventXml: any): Def.Event {
    return {
        component: eventXml.component,
        name: eventXml.name,
        id: parseInt(eventXml.id),
        severity: eventXml.severity,
        formatString: eventXml.format_string,
        arguments: (eventXml.args?.arg ?? []).map((v: any) => argumentReduce(v))
    };
}

function enumItemReduce(enumItemXml: any): Def.EnumItem {
    return {
        name: enumItemXml.name,
        value: parseInt(enumItemXml.value),
        metadata: {
            description: enumItemXml.description
        }
    };
}

function enumReduce(enumXml: any): Def.EnumType {
    return {
        kind: Def.TypeKind.enum,
        name: enumXml.type,
        values: new DualKeyMap('value',
            ((enumXml.item ?? []) as any[]).map((element) =>
                [element.name, enumItemReduce(element)])
        )
    };
}

function serializableMemberReduce(serializableMemberXml: any): Def.Field {
    const type = parseType(serializableMemberXml);

    const metadata = {
        description: serializableMemberXml.description,
        formatSpecifier: serializableMemberXml.format_specifier,
    };

    if (serializableMemberXml.size) {
        const size = parseInt(serializableMemberXml.size);
        if (Def.isNumberType(type) && size > MAX_RAW_ARRAY_SIZE) {
            return {
                name: serializableMemberXml.name,
                type: {
                    kind: Def.TypeKind.bytes,
                    size,
                    type: type.kind,
                },
                metadata
            };
        } else {
            return {
                name: serializableMemberXml.name,
                type: {
                    kind: Def.TypeKind.array,
                    size,
                    type: type,
                },
                metadata
            };
        }
    } else {
        return {
            name: serializableMemberXml.name,
            type,
            metadata
        };
    }
}

function serializableReduce(serializableXml: any): Def.ObjectType {
    return {
        name: serializableXml.type,
        kind: Def.TypeKind.object,
        fields: (serializableXml.members.member ?? []).map((v: any) => serializableMemberReduce(v))
    };
}

function arrayReduce(arrayXml: any): Def.ArrayType | Def.BytesType {
    const size = parseInt(arrayXml.size);
    const elTy = parseType(arrayXml);

    if (Def.isNumberTypeKind(elTy.kind) && size > MAX_RAW_ARRAY_SIZE) {
        // Leave this type as raw bytes
        return {
            name: arrayXml.name,
            kind: Def.TypeKind.bytes,
            size: size,
            type: elTy.kind,
        };
    } else {
        return {
            name: arrayXml.name,
            kind: Def.TypeKind.array,
            size: size,
            type: elTy,
        };
    }
}

function parseType(typeXml: any): Def.Type {
    const t = typeXml.type;

    if (typeof t !== "string") {
        throw new Error(`expected string type name got ${JSON.stringify(t)}`);
    }

    switch (t) {
        case "bool":
            return tBoolean;
        case "U8":
            return tU8;
        case "I8":
            return tI8;
        case "U16":
            return tU16;
        case "I16":
            return tI16;
        case "U32":
            return tU32;
        case "I32":
            return tI32;
        case "U64":
            return tU64;
        case "I64":
            return tI64;
        case "F32":
            return tF32;
        case "F64":
            return tF64;
        case "string":
            return {
                kind: Def.TypeKind.string,
                lengthType: Def.TypeKind.u16,
                maxLength: parseInt(typeXml.len)
            };
    }

    return { kind: Def.TypeKind.reference, name: t };
}
