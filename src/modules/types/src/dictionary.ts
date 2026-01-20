import * as Def from './def';
import * as Proto from './proto';

import { typeKindName, validateEqualTypes } from './util';
import { DualKeyMap } from './DualKeyMap';
import {
    ConversionContext,

    commandFromProto,
    commandToProto,
    eventFromProto,
    eventToProto,
    parameterFromProto,
    parameterToProto,
    telemetryFromProto,
    telemetryToProto,
    typeFromProto,
    typeToProto
} from './conversion';

export class DictionaryNamespace {
    /**
     * Structures and enum definitions
     * 
     * Additional schemas beyond the built-in primtives
     * that this dictionary provides. This is only applicable
     * for FSW frameworks that support complex-typed telemetry
     * points or special packet types that include structured
     * data.
     * 
     * These schemas are similar to JSON schemas and describe
     * the layout of the type so that it may be encoded as protobuf and decoded
     * from its raw format while communicating with FSW.
     * 
     * While there is only a single mapping for all enums in the entire dictionary,
     * if you need to disambiguate enums from different parts of the dictionary, you
     * should prefix the name of the enum with the part of the dictionary you want and
     * make sure these enums are referenced properly in the command, parameters, and evrs etc.
     */
    private types: Map<string, Def.Type>;

    /**
     * Dictionary commands used both in encoding uplink and integrating with sequence language features
     */
    private commands: DualKeyMap<Def.Command, 'opcode'>;

    /**
     * Event records (log messages).
     * Usually FSWs don't send the entire message as a string but rather just their ID and parameters.
     * These entries will help decode this data
     */
    private events: DualKeyMap<Def.Event, 'id'>;

    /**
     * Channelized Telemetry
     */
    private telemetry: DualKeyMap<Def.Telemetry, 'id'>;

    /**
     * Usually parameters are indexed by `${component}.${name}` but it should be unique across the dictionary
     */
    private parameters: DualKeyMap<Def.Parameter, 'id'>;

    private precomputedValues: Map<string, any>;

    constructor() {
        this.commands = new DualKeyMap("opcode");
        this.events = new DualKeyMap("id");
        this.telemetry = new DualKeyMap("id");
        this.parameters = new DualKeyMap("id");
        this.precomputedValues = new Map();

        this.types = new Map();
    }

    static fromProto(proto: Proto.IDictionaryNamespace): DictionaryNamespace {
        const out = new DictionaryNamespace();
        const ctx = new ConversionContext([]);

        if (proto.commands) {
            for (const [key, cmd] of Object.entries(proto.commands)) {
                out.addCommand(key, commandFromProto(cmd, ctx.with(
                    'cmd', cmd.mnemonic ?? "unknown"
                )));
            }
        }

        if (proto.events) {
            for (const [key, ev] of Object.entries(proto.events)) {
                out.addEvent(key, eventFromProto(ev, ctx.with(
                    'evr', ev.name ?? "unknown"
                )));
            }
        }

        if (proto.parameters) {
            for (const [key, prm] of Object.entries(proto.parameters)) {
                out.addParameter(key, parameterFromProto(prm, ctx.with(
                    'prm', prm.name ?? "unknown"
                )));
            }
        }

        if (proto.telemetry) {
            for (const [key, tlm] of Object.entries(proto.telemetry)) {
                out.addTelemetry(key, telemetryFromProto(tlm, ctx.with(
                    'tlm', tlm.name ?? "unknown"
                )));
            }
        }

        if (proto.types) {
            for (const [name, type] of Object.entries(proto.types)) {
                const processedType = typeFromProto(type, ctx.with('type', name));
                out.addType(name, processedType);
            }
        }

        out.resolveReferences();
        return out;
    }

    toProto(): Proto.IDictionaryNamespace {
        const out: Proto.IDictionaryNamespace = {
            commands: {},
            events: {},
            telemetry: {},
            parameters: {},
            types: {},
        };

        for (const [name, cmd] of this.commands.entries()) {
            out.commands![name] = commandToProto(cmd);
        }

        for (const [name, evr] of this.events.entries()) {
            out.events![name] = eventToProto(evr);
        }

        for (const [name, prm] of this.parameters.entries()) {
            out.parameters![name] = parameterToProto(prm);
        }

        for (const [name, tlm] of this.telemetry.entries()) {
            out.telemetry![name] = telemetryToProto(tlm);
        }

        for (const [name, type] of this.types.entries()) {
            out.types![name] = typeToProto(type);
        }

        return out;
    }

    /**
     * Precompute a structure to store with this dictionary
     * This allows some caching at the dictionary level
     * @param name Name of the precomputed value
     * @param compute The compute function to run if this hasn't been computed yet
     * @returns The precomputed value
     */
    precompute<T>(name: string, compute: (dictionary: DictionaryNamespace) => T): T {
        let v = this.precomputedValues.get(name);
        if (v === undefined) {
            v = compute(this);
            this.precomputedValues.set(name, v);
        }

        return v as T;

    }

    addType(key: string, type: Def.Type) {
        const oldType = this.types.get(key);
        if (oldType) {
            // Check if the type is the same
            try {
                validateEqualTypes(oldType, type);
            } catch (err) {
                throw new Error(
                    `Attempting to override type '${key}' with non equivalent type: ${err}`
                );
            }
        }

        switch (type.kind) {
            case Def.TypeKind.enum:
            case Def.TypeKind.bitmask:
            case Def.TypeKind.array:
            case Def.TypeKind.bytes:
            case Def.TypeKind.object:
                type.name = key;
                break;
        }

        this.types.set(key, type);
    }

    getType(key: string): Def.Type | undefined {
        return this.types.get(key);
    }

    getTypes(): Iterable<[string, Def.Type]> {
        return this.types.entries();
    }

    /**
     * Get command given its opcode
     * @param opcode Opcode of command
     */
    getCommand(opcode: number): Def.Command | undefined;

    /**
     * Get command by its mnemonic
     * @param mnemonic Mnemonic of command to search for
     */
    getCommand(mnemonic: string): Def.Command | undefined;

    getCommand(arg: string | number): Def.Command | undefined {
        if (typeof arg === "string") {
            return this.commands.get(arg);
        } else {
            return this.commands.getK2(arg);
        }
    }

    /**
     * Add command definition to the dictionary
     * @param key Unique key to save command under
     * @param command Command to add
     */
    addCommand(key: string, command: Def.Command) {
        this.commands.set(key, command);
    }

    getCommands(): Iterable<Def.Command> {
        return this.commands.values() ?? [];
    }

    getEvent(id: number): Def.Event | undefined {
        return this.events.getK2(id);
    }

    /**
     * Add event (EVR) definition to the dictionary
     * @param key Unique key to save EVR under
     * @param evr Event definition to add
     */
    addEvent(key: string, evr: Def.Event) {
        this.events.set(key, evr);
    }

    getEvents(): Iterable<Def.Event> {
        return this.events.values();
    }

    getTelemetry(name: string): Def.Telemetry | undefined;
    getTelemetry(id: number): Def.Telemetry | undefined;

    getTelemetry(arg: string | number): Def.Telemetry | undefined {
        if (typeof arg === "string") {
            return this.telemetry.get(arg);
        } else {
            return this.telemetry.getK2(arg);
        }
    }

    /**
     * Add Telemetry (channel) definition to the dictionary
     * @param key Unique key to save EVR under
     * @param telem Telemetry definition to add
     */
    addTelemetry(key: string, telem: Def.Telemetry) {
        this.telemetry.set(key, telem);
    }

    getTelemetries(): Iterable<Def.Telemetry> {
        return this.telemetry?.values() ?? [];
    }

    getParameter(name: string): Def.Parameter | undefined;
    getParameter(id: number): Def.Parameter | undefined;

    getParameter(arg: string | number): Def.Parameter | undefined {
        if (typeof arg === "string") {
            return this.parameters.get(arg);
        } else {
            return this.parameters.getK2(arg);
        }
    }

    getParameters(): Iterable<Def.Parameter> {
        return this.parameters?.values() ?? [];
    }

    /**
     * Add Parameter definition to the dictionary
     * @param key Unique key to save parameter under
     * @param param Parameter definition to add
     */
    addParameter(key: string, param: Def.Parameter) {
        this.parameters.set(key, param);
    }

    resolveReferences() {
        const resolveType = (type: Def.Type) => {
            if (Def.isResolvedReferenceType(type)) {
                return type;
            }

            switch (type.kind) {
                case Def.TypeKind.array:
                    type.type = resolveType(type.type);
                    return type;
                case Def.TypeKind.object:
                    for (const field of type.fields) {
                        field.type = resolveType(field.type);
                    }
                    return type;
                case Def.TypeKind.reference:
                    break;
                default: return type; // already resolved
            }

            // Lookup the reference
            const resolved = this.types.get(type.name);
            if (!resolved) {
                throw new Error(`No type named ${type.name} ${JSON.stringify(type)}`);
            }

            if (type.expectedKind !== undefined && type.expectedKind !== resolved.kind) {
                throw new Error(`Expected ${type.name} to be ${typeKindName(type.expectedKind)} but found ${typeKindName(resolved.kind)}`);
            }

            // Check if the reference needs additional verification
            if (type.verify) {
                try {
                    type.verify(resolved);
                } catch (err) {
                    throw new Error(`Failed to verify ${type.name}: ${err}`);
                }
            }

            switch (resolved.kind) {
                case Def.TypeKind.array:
                    return new Def.ResolvedArrayType(type, resolved);
                case Def.TypeKind.bytes:
                    return new Def.ResolvedBytesType(type, resolved);
                case Def.TypeKind.enum:
                    return new Def.ResolvedEnumType(type, resolved);
                case Def.TypeKind.object:
                    return new Def.ResolvedObjectType(type, resolved);
                case Def.TypeKind.bitmask:
                    return new Def.ResolvedBitmaskType(type, resolved);
                case Def.TypeKind.reference:
                    // Resolve this recursive alias
                    return resolveType(resolved);
                case Def.TypeKind.u8:
                case Def.TypeKind.i8:
                case Def.TypeKind.u16:
                case Def.TypeKind.i16:
                case Def.TypeKind.u32:
                case Def.TypeKind.i32:
                case Def.TypeKind.u64:
                case Def.TypeKind.i64:
                case Def.TypeKind.f32:
                case Def.TypeKind.f64:
                    return new Def.ResolvedNumberAliasType(type, resolved);
                case Def.TypeKind.boolean:
                    return new Def.ResolvedBoolAliasType(type, resolved);
                case Def.TypeKind.string:
                    return new Def.ResolvedStringAliasType(type, resolved);
                case Def.TypeKind.void:
                default:
                    throw new Error(`Invalid underyling type to alias: ${typeKindName(resolved.kind)}`);
            }
        };

        // Resolve all references with recursive types
        const resolved = new Map<string, Def.ComplexType>();
        for (const [name, type] of this.types.entries()) {
            // Resolve inline
            resolved.set(name, resolveType(type) as Def.ComplexType);
        }

        // Resolve all references within dictionary entries
        for (const command of this.commands?.values() ?? []) {
            for (const argument of command.arguments) {
                argument.type = resolveType(argument.type);
            }
        }

        for (const evr of this.events?.values() ?? []) {
            for (const argument of evr.arguments) {
                argument.type = resolveType(argument.type);
            }
        }


        for (const telem of this.telemetry?.values() ?? []) {
            telem.type = resolveType(telem.type);
        }

        for (const param of this.parameters?.values() ?? []) {
            param.type = resolveType(param.type);
        }
    }
}

export class Dictionary {
    name?: string;
    type?: string;
    version?: string;
    metadata: Record<string, string>;

    namespaces: Map<string, DictionaryNamespace>;

    private referencesResolved: boolean;

    constructor(head: Proto.IDictionaryHead, metadata?: Record<string, string>) {
        this.name = head.name ?? undefined;
        this.type = head.type ?? undefined;
        this.version = head.version ?? undefined;
        this.metadata = metadata ?? {};

        this.namespaces = new Map();
        this.referencesResolved = false;
    }

    static fromProto(proto: Proto.IDictionary): Dictionary {
        const out = new Dictionary({ ...proto.head }, proto.metadata ?? undefined);
        for (const [nsName, ns] of Object.entries(proto.content ?? {})) {
            out.namespaces.set(nsName, DictionaryNamespace.fromProto(ns));
        }

        return out.resolveReferences();
    }

    toProto(): Proto.IDictionary {
        const out: Proto.IDictionary = {
            head: {
                type: this.type,
                name: this.name,
                version: this.version,
            },
            content: Object.fromEntries(Array.from(this.namespaces.entries()).map(([key, namespace]) => [
                key,
                namespace.toProto()
            ])),
            metadata: this.metadata,
        };

        return out;
    }

    /**
     * Resolve references to types throughout the dictionary.
     * This should be called after creation or deseralization.
     * This allows cross references to be held across endpoint boundaries.
     * 
     * > Note: This does _NOT_ need to be called manually by your dictionary
     * parser since its called by the host middleware when the dictionary is added or loaded
     */
    resolveReferences(force = false): this {
        if (this.referencesResolved && !force) {
            return this;
        } else {
            this.referencesResolved = true;
        }

        for (const ns of this.namespaces.values()) {
            ns.resolveReferences();
        }

        return this;
    }

    get(namespace: string): DictionaryNamespace {
        const out = this.namespaces.get(namespace);
        if (!out) {
            const newNs = new DictionaryNamespace();
            this.namespaces.set(namespace, newNs);
            return newNs;
        } else {
            return out;
        }
    }

    /**
     * Get the header of the dictionary for initializing the {@link Fsw.dictionary} member
     */
    head(): Proto.IDictionaryHead {
        return {
            type: this.type,
            name: this.name,
            version: this.version,
        };
    }
}
