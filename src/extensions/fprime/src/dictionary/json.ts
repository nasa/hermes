/**
 * FPrime Dicitionary Parsing
 * @author Andrei Tumbar
 */

import { Def, Dictionary, DualKeyMap, EvrSeverity, typeKindName } from '@gov.nasa.jpl.hermes/types';

/**
 * Schema for FPP JSON dictionaries
 */
interface FppJsonDictionary {
    metadata?: {
        deploymentName?: string
        frameworkVersion?: string
        projectVersion?: string
        libraryVersions?: string[]
        dictionarySpecVersion?: string
        [k: string]: unknown
    }
    typeDefinitions?: (
        | {
            kind: "array"
            qualifiedName: string
            size: number
            elementType: TypeDescriptor
            default: unknown[]
            annotation?: string
            [k: string]: unknown
        }
        | {
            kind: "enum"
            qualifiedName: string
            representationType: TypeDescriptor
            enumeratedConstants: EnumeratedConstantsDescriptor[]
            default: string
            annotation?: string
            [k: string]: unknown
        }
        | {
            kind: "struct"
            qualifiedName: string
            annotation?: string
            members: {
                [k: string]: StructMemberDescriptor
            }
            default: {
                [k: string]:
                | string
                | number
                | boolean
                | unknown[]
                | {
                    [k: string]: unknown
                }
            }
            [k: string]: unknown
        }
        | {
            kind: "alias"
            qualifiedName: string
            type: TypeDescriptor
            underlyingType: TypeDescriptor
            annotation?: string
            [k: string]: unknown
        }
    )[]
    commands?: {
        name: string
        commandKind: string
        opcode: number
        annotation?: string
        formalParams: FormalParameter[]
        priority?: number
        queueFullBehavior?: "assert" | "block" | "drop"
        [k: string]: unknown
    }[]
    parameters?: {
        name: string
        annotation?: string
        type: TypeDescriptor
        default?:
        | number
        | string
        | boolean
        | {
            [k: string]: unknown
        }
        | unknown[]
        id: number
        [k: string]: unknown
    }[]
    events?: {
        name: string
        annotation?: string
        severity:
        | "ACTIVITY_HI"
        | "ACTIVITY_LO"
        | "COMMAND"
        | "DIAGNOSTIC"
        | "FATAL"
        | "WARNING_HI"
        | "WARNING_LO"
        formalParams: FormalParameter[]
        id: number
        format?: string
        throttle?: number
        [k: string]: unknown
    }[]
    telemetryChannels?: {
        name: string
        annotation?: string
        type: TypeDescriptor
        id: number
        telemetryUpdate: "always" | "on change"
        format?: string
        limit?: {
            high?: {
                yellow?: number
                orange?: number
                red?: number
                [k: string]: unknown
            }
            low?: {
                yellow?: number
                orange?: number
                red?: number
                [k: string]: unknown
            }
            [k: string]: unknown
        }
        [k: string]: unknown
    }[]
    records?: {
        name: string
        annotation?: string
        type: TypeDescriptor
        array?: boolean
        id: number
        [k: string]: unknown
    }[]
    containers?: {
        name: string
        annotation?: string
        id: number
        defaultPriority?: number
        [k: string]: unknown
    }[]
    telemetryPacketSets?: {
        name: string
        members: TelemetryPacket[]
        omitted: string[]
        [k: string]: unknown
    }[]
    constants?: {
        kind: "constant",
        qualifiedName: string,
        type: TypeDescriptor,
        value: any,
        annotation: string,
    }[]
    [k: string]: unknown
}

interface TypeDescriptor {
    name: string
    kind: "integer" | "float" | "bool" | "string" | "qualifiedIdentifier"
    size?: number
    signed?: boolean
    [k: string]: unknown
}

interface EnumeratedConstantsDescriptor {
    name: string
    value: number
    annotation?: string
    [k: string]: unknown
}

interface StructMemberDescriptor {
    type: TypeDescriptor
    index: number
    size?: number
    format?: string
    annotation?: string
    [k: string]: unknown
}

interface FormalParameter {
    name: string
    annotation?: string
    type: TypeDescriptor
    ref: boolean
    [k: string]: unknown
}

interface TelemetryPacket {
    name: string
    id: number
    group: number
    members: string[]
    [k: string]: unknown
}

function integerKind(size?: number, signed?: boolean): Def.IntegerTypeKind {
    switch (size) {
        case 8:
            return (signed ?? false) ? Def.TypeKind.i8 : Def.TypeKind.u8;
        case 16:
            return (signed ?? false) ? Def.TypeKind.i16 : Def.TypeKind.u16;
        case 32:
            return (signed ?? false) ? Def.TypeKind.i32 : Def.TypeKind.u32;
        case 64:
            return (signed ?? false) ? Def.TypeKind.i64 : Def.TypeKind.u64;
        default:
            throw new Error(`Invalid integer size: ${size} must be 8,16,32,64`);
    }
}

function floatKind(size?: number): Def.FloatTypeKind {
    switch (size) {
        case 32:
            return Def.TypeKind.f32;
        case 64:
            return Def.TypeKind.f64;
        default:
            throw new Error(`Invalid float size: ${size} must be 32,64`);
    }
}

function parseType(type: TypeDescriptor): Def.Type {
    switch (type.kind) {
        case 'string':
            return {
                kind: Def.TypeKind.string,
                maxLength: type.size,
                lengthType: Def.TypeKind.u16,
            };
        case 'integer':
            return {
                kind: integerKind(type.size, type.signed),
            };
        case 'float':
            return {
                kind: floatKind(type.size),
            };
        case 'bool':
            return {
                kind: Def.TypeKind.boolean,
            };
        case 'qualifiedIdentifier':
            return {
                kind: Def.TypeKind.reference,
                name: type.name,
            };
    }
}

function parseName(s: string): { component: string, name: string } {
    const nameSplit = s.lastIndexOf('.');
    if (nameSplit < 0) {
        throw new Error(`Expected name to have dot separated identifiers: ${s}`);
    }

    return {
        component: s.substring(0, nameSplit),
        name: s.substring(nameSplit + 1),
    };
}

function nameKey(s: string): string {
    const name = parseName(s);
    return `${name.component}.${name.name}`;
}

function parseSeverity(raw: (
    | "ACTIVITY_HI"
    | "ACTIVITY_LO"
    | "COMMAND"
    | "DIAGNOSTIC"
    | "FATAL"
    | "WARNING_HI"
    | "WARNING_LO"
    | string
)): EvrSeverity {
    switch (raw) {
        case 'ACTIVITY_HI':
            return EvrSeverity.activityHigh;
        case 'ACTIVITY_LO':
            return EvrSeverity.activityLow;
        case 'COMMAND':
            return EvrSeverity.command;
        case 'DIAGNOSTIC':
            return EvrSeverity.diagnostic;
        case 'FATAL':
            return EvrSeverity.fatal;
        case 'WARNING_HI':
            return EvrSeverity.warningHigh;
        case 'WARNING_LO':
            return EvrSeverity.warningLow;
        default:
            throw new Error(`Invalid EVR severity: ${raw}`);
    }
}

const regex = /{(\d*\.?\d*[cdxoefgCDXOEFG])}/g;

function preprocessFPPFormatString(s: string): string {
    return s.replace(regex, "%$1").replace(/{}/g, "%v");
}

export function parseFprimeJsonDictionary(rawJson: string): Dictionary {
    const json = JSON.parse(rawJson) as FppJsonDictionary;

    const out = new Dictionary({
        name: json.metadata?.deploymentName,
        version: json.metadata?.projectVersion,
        type: "fprime"
    });

    const ns = out.get("");
    const tlmPkts = out.get("telemetry-packets");

    for (const type of json.typeDefinitions ?? []) {
        switch (type.kind) {
            case 'array':
                ns.addType(type.qualifiedName, {
                    kind: Def.TypeKind.array,
                    name: type.qualifiedName,
                    size: type.size,
                    lengthType: Def.TypeKind.u32,
                    type: parseType(type.elementType),
                    metadata: {
                        description: type.annotation
                    }
                });
                break;
            case 'enum': {
                const encodeType = parseType(type.representationType);
                switch (encodeType.kind) {
                    case Def.TypeKind.u8:
                    case Def.TypeKind.i8:
                    case Def.TypeKind.u16:
                    case Def.TypeKind.i16:
                    case Def.TypeKind.u32:
                    case Def.TypeKind.i32:
                    case Def.TypeKind.u64:
                        break;
                    default:
                        throw new Error(`Enums must be encoded as an integer type not ${typeKindName(encodeType.kind)}`);
                }

                ns.addType(type.qualifiedName, {
                    kind: Def.TypeKind.enum,
                    name: type.qualifiedName,
                    encodeType: encodeType.kind,
                    metadata: {
                        description: type.annotation
                    },
                    values: new DualKeyMap("value", type.enumeratedConstants.map(c => ([c.name, {
                        name: c.name,
                        value: c.value,
                        metadata: {
                            description: c.annotation
                        }
                    } satisfies Def.EnumItem])))
                });
            }
                break;
            case 'struct':
                ns.addType(type.qualifiedName, {
                    kind: Def.TypeKind.object,
                    name: type.qualifiedName,
                    metadata: {
                        description: type.annotation
                    },
                    fields: Object.entries(type.members).sort((a, b) => a[1].index - b[1].index).map(([name, field]) => ({
                        name,
                        type: field.size !== undefined ? {
                            kind: Def.TypeKind.array,
                            type: parseType(field.type),
                            size: field.size
                        } : parseType(field.type),
                        metadata: {
                            description: field.annotation
                        },
                    } satisfies Def.Field))
                });
                break;
            case 'alias':
                ns.addType(
                    type.qualifiedName,
                    parseType(type.underlyingType),
                );
                break;
        }
    }

    for (const e of json.events ?? []) {
        const { component, name } = parseName(e.name);

        ns.addEvent(`${component}.${name}`, {
            id: e.id,
            name,
            component,
            severity: parseSeverity(e.severity),
            formatString: preprocessFPPFormatString(e.format ?? "unknown message"),
            metadata: {
                description: e.annotation,
            },
            arguments: e.formalParams.map((param) => ({
                name: param.name,
                type: parseType(param.type),
                metadata: {
                    description: param.annotation
                }
            } satisfies Def.Field)),
        });
    }

    for (const c of json.telemetryChannels ?? []) {
        const { component, name } = parseName(c.name);
        ns.addTelemetry(`${component}.${name}`, {
            id: c.id,
            name,
            component,
            type: parseType(c.type),
            metadata: {
                description: c.annotation,
            },
        });
    }

    for (const c of json.commands ?? []) {
        const { component, name } = parseName(c.name);
        ns.addCommand(`${component}.${name}`, {
            opcode: c.opcode,
            mnemonic: name,
            component,
            arguments: c.formalParams.map((param) => ({
                name: param.name,
                type: parseType(param.type),
                metadata: {
                    description: param.annotation
                }
            } satisfies Def.Field)),
            metadata: {
                description: c.annotation,
            },
        });
    }

    for (const p of json.parameters ?? []) {
        const { component, name } = parseName(p.name);
        ns.addParameter(`${component}.${name}`, {
            id: p.id,
            name,
            component,
            type: parseType(p.type),
            metadata: {
                description: p.annotation,
                default: p.default !== undefined ? JSON.stringify(p.default) : undefined,
            },
        });
    }

    for (const s of json.telemetryPacketSets ?? []) {
        for (const pkt of s.members) {
            // Resolve the telemetry packet as a single struct type
            const type: Def.ObjectType = {
                kind: Def.TypeKind.object,
                name: pkt.name,
                fields: pkt.members.map((memberName) => {
                    const key = nameKey(memberName);
                    const memberTlm = ns.getTelemetry(key);
                    if (!memberTlm) {
                        throw new Error(`No telemetry with name '${key}'`);
                    }

                    return {
                        name: key.replaceAll('.', '_'),
                        type: memberTlm.type,
                    };
                })
            };

            tlmPkts.addTelemetry(pkt.name, {
                name: pkt.name,
                id: pkt.id,
                component: '_',
                type,
                metadata: {
                    group: pkt.group,
                }
            });
        }
    }

    if (json.telemetryPacketSets) {
        for (const [name, type] of ns.getTypes()) {
            tlmPkts.addType(name, type);
        }
    }

    const scid = json.constants?.find((f) => f.qualifiedName === "ComCfg.SpacecraftId");
    if (scid) {
        if (typeof scid.value !== "number") {
            throw new Error(`expected numeric value for 'ComCfg.SpacecraftId', got ${typeof scid.value}`);
        }

        out.metadata["SpacecraftId"] = scid.value.toString();
    }

    out.resolveReferences();
    return out;
}
