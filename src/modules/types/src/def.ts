import { CompletionItemKind } from 'vscode';
import { Diagnostic } from '@gov.nasa.jpl.hermes/sequence';

import { EvrSeverity } from './telemetry';
import { DualKeyMap } from './DualKeyMap';
import { Value } from './types';
import Long from 'long';

/**
 * Use of metadata is optional for clients and this can even be filtered out during serialization
 * Clients (LSPs/annotations/linters) should be robust to partials of this interface.
 * 
 * When expanding this interface, keep in mind that none of these fields are **required**
 * by any of the readers of this type. You need to make sure when using any item from here that
 * you can handle a field being undefined.
 */
export interface Metadata {
    /**
     * Comment/description
     */
    description: string;

    /**
     * Other metadata entries
     */
    [other: string]: any;
}

/**
 * Item is the base interface of all information in the dictionary
 */
interface Item<T extends object = {}> {
    /**
     * Additional metadata that surrounding this item
     */
    metadata?: Partial<Metadata & T>;
}


/**
 * Supported type kinds
 */
export enum TypeKind {
    reference,      // reference to another type to be resolved later
    u8,
    i8,
    u16,
    i16,
    u32,
    i32,
    u64,
    i64,
    f32,
    f64,
    boolean,
    string,
    enum,           // strings in JS/TS/Python, encoded as i32 (or chosen type)
    bitmask,        // strings in JS/TS/Python, encoded as i32 (or chosen type)
    array,          // homogenous array of static or variable length
    bytes,          // Similar to arrays but they store the raw bytes values of number arrays
    object,         // key:value pairs
    void,           // Spaces in struct of arbitrary size
}

export type BuiltinTypeKind = (
    TypeKind.i8
    | TypeKind.u8
    | TypeKind.i16
    | TypeKind.u16
    | TypeKind.i32
    | TypeKind.u32
    | TypeKind.i64
    | TypeKind.u64
    | TypeKind.f32
    | TypeKind.f64
    | TypeKind.boolean
    | TypeKind.string
    | TypeKind.void
);

/**
 * Type kinds that can be externally referenced
 */
export type ReferenceTypeKind = (
    | TypeKind.enum
    | TypeKind.bitmask
    | TypeKind.object
    | TypeKind.array
    | TypeKind.bytes
);

export type NumberTypeKind = (
    TypeKind.i8
    | TypeKind.u8
    | TypeKind.i16
    | TypeKind.u16
    | TypeKind.i32
    | TypeKind.u32
    | TypeKind.i64
    | TypeKind.u64
    | TypeKind.f32
    | TypeKind.f64
);

/**
 * Integer types
 */
export type IntegerTypeKind = (
    TypeKind.i8
    | TypeKind.u8
    | TypeKind.i16
    | TypeKind.u16
    | TypeKind.i32
    | TypeKind.u32
    | TypeKind.i64
    | TypeKind.u64
);

export type FloatTypeKind = (
    | TypeKind.f32
    | TypeKind.f64
);

/**
 * Serialization type for lengths (unsigned integers)
 */
export type UintTypeKind = (
    TypeKind.u8
    | TypeKind.u16
    | TypeKind.u32
    | TypeKind.u64
);

export interface BooleanType extends Item {
    kind: TypeKind.boolean;

    /**
     * Default {@link TypeKind.u8}
     */
    encodeType?: UintTypeKind;
}

export interface NumberType extends Item {
    kind: NumberTypeKind;

    /**
     * Lower-bound on valid values
     */
    min?: Long | number;

    /**
     * Upper-bound on valid values
     */
    max?: Long | number;
}

export interface StringType extends Item {
    kind: TypeKind.string;

    /**
     * Type to serialize length of string with.
     * 
     * When encoding strings, they will be prefixed by their
     * length using this type. If the length does not fit within
     * this type's representable size, it will throw an error.
     */
    lengthType?: UintTypeKind;

    /**
     * Optional check for maximum length
     */
    maxLength?: number;
}

export interface ReferenceType extends Item {
    kind: TypeKind.reference;

    /**
     * If the reference has some knowledge of what type to expect to
     * resolve to, input it here
     */
    expectedKind?: ReferenceTypeKind;

    /**
     * Name of the references type
     */
    name: string;

    /**
     * This is run on the resolved type in addition to checking
     * the type against the {@link expectedKind}. It should throw
     * a relevant error if the resolved type is not what the original
     * reference expected.
     * @param resolved The concrete resolved type
     * @returns Void (or throws error)
     */
    verify?: (resolved: Type) => void
}

export interface VoidType extends Item {
    kind: TypeKind.void;
    size: number;
}

/**
 * Either `number` for static array, or a 2-tuple for
 * a range of sizes (or undefined for unbounded).
 * 
 * Static arrays do not prefix their encodings with sizes
 * since encoders and decoders both agree on their length
 * ahead of time.
 * 
 * Dynamically sized arrays will prefix their size with
 */
type ArraySize = (
    number | [min: number, max: number]
)

export interface ArrayType extends Item {
    kind: TypeKind.array;

    /**
     * Name of the array if this is a typedef instead of
     * an inline array.
     */
    name?: string;

    /**
     * Element type
     */
    type: Type;

    size?: ArraySize;

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     * 
     * Default: {@link TypeKind.u32}
     */
    lengthType?: UintTypeKind;
}

export interface BytesType extends Item {
    kind: TypeKind.bytes;

    /**
     * Name of the array if this is a typedef instead of
     * an inline array.
     */
    name?: string;

    /**
     * Element type
     */
    type: NumberTypeKind;

    size?: ArraySize;

    /**
     * Serialization type to use for dynamic array's prefixed length.
     * > Ignored on statically sized arrays.
     * 
     * Default: {@link TypeKind.u32}
     */
    lengthType?: UintTypeKind;
}

export interface ValueChoice {
    /**
     * The label of this completion item.
     *
     * By default this is also the text that is inserted when this completion is selected.
     */
    label: string;

    /**
     * An optional string which is rendered less prominently directly after {@link ValueChoice.label label},
     * without any spacing. Should be used for function signatures or type annotations.
     */
    detail?: string;

    /**
     * An optional string which is rendered less prominently after {@link ValueChoice.detail}. Should be used
     * for fully qualified names or file path.
     */
    description?: string;

    /**
     * A string or snippet that should be inserted in a document when selecting
     * this completion. When `falsy` the {@link ValueChoice.label label}
     * is used.
     */
    insertText?: string;

    /**
     * The kind of this completion item. Based on the kind
     * an icon is chosen by the editor.
     */
    kind?: CompletionItemKind;
}

export interface Field extends Item<{
    /**
     * Allow only a subset of values for this field/argument
     */
    choices: ValueChoice[];

    /**
     * SI unit to format with
     * TODO(tumbar) Look into Grafana's unit system
     */
    units: string;

    /**
     * Default value to help prompt to the user
     */
    default: string;

    /**
     * If this type is used for commands in a sequence, this indicates whether or not
     * we can omit the lengthPrefix in the tag list format.
     * 
     * This should be true if it is the last argument in the command.
     */
    omitLengthPrefix: boolean;
}> {
    name: string;
    type: Type;

    /**
     * The constant value to assume for this value
     * If this is provided, it will be used as the value to encode
     * with when serializing. The actual object will not need to provide
     * this field.
     */
    value?: Value;
}

export interface ObjectType extends Item {
    kind: TypeKind.object;

    /**
     * Name of the object/struct
     */
    name?: string;

    /**
     * Fields/members inside object. Ordered in order of serialization.
     */
    fields: Field[];
}

export interface EnumItem extends Item {
    value: number;
    name: string;
}

export interface EnumType extends Item<{
    /**
     * Header to include to get access to this enum
     */
    includeFile: string;
}> {
    kind: TypeKind.enum;

    /**
     * Name of the enum
     */
    name: string;

    /**
     * Type to serialize enum with.
     * Use this on a per-enum basis. By default it will be I32. If this is
     * specified in the reference type it will override this.
     * 
     * You can also override this behavior programmatically by overriding
     * `Serializable.writeEnum`.
     */
    encodeType?: IntegerTypeKind;

    /**
     * Members of the enum and their mapping to its
     * numeric value.
     */
    values: DualKeyMap<EnumItem, 'value'>;
}

export interface BitmaskType extends Item {
    kind: TypeKind.bitmask;

    /**
     * Name of the enum
     */
    name: string;

    /**
     * Type to serialize enum with.
     * Use this on a per-enum basis. By default it will be I32. If this is
     * specified in the reference type it will override this.
     * 
     * You can also override this behavior programatically by overriding
     * `Serializable.writeEnum`.
     */
    encodeType?: IntegerTypeKind;

    /**
     * Members of the bitmask and their mapping to its
     * numeric value.
     */
    values: DualKeyMap<EnumItem, 'value'>;
}

interface ResolvedReferenceTypeBase {
    ref: ReferenceType;
}

export function isResolvedReferenceType(ty: Type): boolean {
    return Boolean((ty as unknown as ResolvedReferenceTypeBase).ref);
}

export class ResolvedNumberAliasType implements ResolvedReferenceTypeBase, NumberType {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: NumberType
    ) {
    }

    get kind(): NumberTypeKind {
        return this.resolved.kind;
    }

    get min(): number | Long | undefined {
        return this.resolved.min;
    }

    get max(): number | Long | undefined {
        return this.resolved.max;
    }

    get metadata(): Partial<Metadata> | undefined {
        return this.resolved.metadata;
    }
}

export class ResolvedStringAliasType implements ResolvedReferenceTypeBase, StringType {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: StringType
    ) {
    }

    get kind(): TypeKind.string {
        return TypeKind.string;
    }

    get lengthType(): UintTypeKind | undefined {
        return this.resolved.lengthType;
    }

    get maxLength(): number | undefined {
        return this.resolved.maxLength;
    }

    get metadata(): Partial<Metadata> | undefined {
        return this.resolved.metadata;
    }
}

export class ResolvedBoolAliasType implements ResolvedReferenceTypeBase, BooleanType {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: BooleanType
    ) {
    }

    get kind(): TypeKind.boolean {
        return TypeKind.boolean;
    }

    get encodeType(): UintTypeKind | undefined {
        return this.resolved.encodeType;
    }

    get metadata(): Partial<Metadata> | undefined {
        return this.resolved.metadata;
    }
}

export class ResolvedObjectType implements ObjectType, ResolvedReferenceTypeBase {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: ObjectType
    ) {
    }

    get name(): string {
        return this.resolved?.name ?? this.ref.name;
    }

    get kind(): TypeKind.object {
        return this.resolved.kind;
    }

    get fields(): Field[] {
        return this.resolved.fields;
    }

    toJSON() {
        return this.ref;
    }
}

export class ResolvedArrayType implements ArrayType, ResolvedReferenceTypeBase {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: ArrayType
    ) {
    }

    get name(): string {
        return this.resolved?.name ?? this.ref.name;
    }

    get kind(): TypeKind.array {
        return this.resolved.kind;
    }

    get type(): Type {
        return this.resolved.type;
    }

    get size(): ArraySize | undefined {
        return this.resolved.size;
    }

    get lengthType(): UintTypeKind | undefined {
        return this.resolved.lengthType;
    }

    toJSON() {
        return this.ref;
    }
}

export class ResolvedBytesType implements BytesType, ResolvedReferenceTypeBase {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: BytesType
    ) {
    }

    get name(): string {
        return this.resolved?.name ?? this.ref.name;
    }

    get kind(): TypeKind.bytes {
        return this.resolved.kind;
    }

    get type(): NumberTypeKind {
        return this.resolved.type;
    }

    get size(): ArraySize | undefined {
        return this.resolved.size;
    }

    get lengthType(): UintTypeKind | undefined {
        return this.resolved.lengthType;
    }

    toJSON() {
        return this.ref;
    }
}

export class ResolvedEnumType implements EnumType, ResolvedReferenceTypeBase {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: EnumType
    ) {
    }

    get name(): string {
        return this.resolved?.name ?? this.ref.name;
    }

    get kind(): TypeKind.enum {
        return TypeKind.enum;
    }

    get values(): DualKeyMap<EnumItem, 'value'> {
        return this.resolved.values;
    }

    get encodeType(): IntegerTypeKind | undefined {
        return this.resolved.encodeType;
    }

    toJSON() {
        return this.ref;
    }
}

export class ResolvedBitmaskType implements BitmaskType, ResolvedReferenceTypeBase {
    constructor(
        readonly ref: ReferenceType,
        readonly resolved: BitmaskType
    ) {
    }

    get name(): string {
        return this.resolved?.name ?? this.ref.name;
    }

    get kind(): TypeKind.bitmask {
        return TypeKind.bitmask;
    }

    get values(): DualKeyMap<EnumItem, 'value'> {
        return this.resolved.values;
    }

    get encodeType(): IntegerTypeKind | undefined {
        return this.resolved.encodeType;
    }

    toJSON() {
        return this.ref;
    }
}

export type ResolvedReferenceType = (
    | ResolvedObjectType
    | ResolvedArrayType
    | ResolvedEnumType
    | ResolvedBitmaskType
    | ResolvedBytesType
)

export type Type = (
    | BooleanType
    | NumberType
    | StringType
    | ReferenceType
    | ObjectType
    | EnumType
    | BitmaskType
    | ArrayType
    | BytesType
    | VoidType
);

/**
 * Runtime types are programatically created to attach custom
 * value parsers for types at runtime.
 */
export type RuntimeType = Type & {
    /**
     * Override default parsing behavior of the field token
     * @param text token to parse into a value given this type definition
     */
    parse?(text: string): Value;

    /**
     * Add additional document (or override for this type)
     * @param value in command the argument
     */
    documentation?(value: string | undefined): string[];

    /**
     * Override the validation on this type. This allows custom messages/diagnostics
     * to be attached to tokens with this type such as warnings, info, etc.
     * @param value token value that should be validated
     * @returns A diagnostic message if there is any or null for valid
     */
    validate?(value: string): Diagnostic | null;
}

export type PrimtiveType = (
    | BooleanType
    | NumberType
    | StringType
    | EnumType
    | BitmaskType
);

export type ComplexType = (
    ObjectType
    | EnumType
    | BitmaskType
    | ArrayType
    | BytesType
);

export interface Parameter extends Field {
    id: number;

    /**
     * Component or module that owns this parameter
     */
    component: string;
}

export interface Command extends Item<{
    /**
     * FSW or Systems Engineer author.
     * Point of contact for this command.
     */
    author: string;

    /**
     * Relevant FSW source file to look for implementation of command
     */
    file: string;

    /**
     * There was some error with selecting this command
     */
    error: string;
}> {
    opcode: number;

    /**
     * Mnemonic command used to identify this command.
     * FSW may or may not include the module name in the mnemonic and its
     * up to the language parsing software to identify the proper command from mnemonic information.
     * 
     * This may have varying meaning across missions
     */
    mnemonic: string;

    /**
     * Parent component or module owning this command
     */
    component: string;

    /**
     * Command arguments
     */
    arguments: Field[];
}

/**
 * Format specifier type for FPrime format strings
 */
export enum FormatSpecifierType {
    Default = 0,        // {} -> %v
    Char = 1,           // {c} -> %c
    Decimal = 2,        // {d} -> %d
    HexLower = 3,       // {x} -> %x
    HexUpper = 4,       // {X} -> %X
    Octal = 5,          // {o} -> %o
    ExpLower = 6,       // {e} -> %e
    ExpUpper = 7,       // {E} -> %E
    FixedLower = 8,     // {f} -> %f
    FixedUpper = 9,     // {F} -> %F
    GeneralLower = 10,  // {g} -> %g
    GeneralUpper = 11,  // {G} -> %G
}

/**
 * Format specifier with metadata
 */
export interface FormatSpecifier {
    /** Type of format specifier */
    type: FormatSpecifierType;

    /** Optional precision (digits after decimal point) */
    precision?: number;

    /** Index into the arguments array (0-based) */
    argumentIndex: number;
}

/**
 * Fragment of a format string - either text or a format specifier
 */
export type FormatFragment =
    | { type: 'text'; text: string }
    | { type: 'specifier'; specifier: FormatSpecifier };

/**
 * Structured representation of an FPrime format string
 */
export interface FormatString {
    /** Ordered list of text and format specifier fragments */
    fragments: FormatFragment[];

    /** Original format string (for debugging and backward compatibility) */
    original: string;
}

export interface Event extends Item {
    id: number;

    /**
     * printf format string that will be formatted via sprintf
     */
    formatString: string;

    /**
     * Structured representation of the format string with parsed fragments
     * (new format, preferred over formatString)
     */
    format?: FormatString;

    /**
     * Component or module
     */
    component: string;

    /**
     * Name of the EVR.
     * Scoped by its component
     */
    name: string;

    /**
     * Log severity usually stored in the FSW event dictionary
     * For the most part this information is not held in the
     * EVR packet since its redundant for ground software.
     */
    severity: EvrSeverity;

    /**
     * Arguments used inside the format string
     */
    arguments: Field[];
}

export interface EventRef extends Item {
    id: number;

    /**
     * Component or module
     */
    component: string;

    /**
     * Name of the EVR.
     * Scoped by its component
     */
    name: string;

    /**
     * Log severity usually stored in the FSW event dictionary
     * For the most part this information is not held in the
     * EVR packet since its redundant for ground software.
     */
    severity: EvrSeverity;

    /**
     * Arguments names used inside the format string
     */
    arguments: string[];
}

export interface Telemetry extends Item<{
    /**
     * Measurement to use instead of `${component}.${name}`
     */
    measurement: string;

    /**
     * InfluxDB tags to attach to telemetry channel
     */
    tags: Record<string, string>;

    /**
     * Name of the value field to use instead of `value`
     */
    baseFieldName: string;

    /**
     * Mapping to rename field name when encoding to DB row
     */
    renameFields: Record<string, string>
}> {
    /**
     * Raw ID used for identifying incoming serialized telemetry
     */
    id?: number;

    /**
     * Telemetry name
     */
    name: string;

    /**
     * Component or module that owns this telemetry
     */
    component: string;

    /**
     * Serialization type
     */
    type: Type;
}

export interface TelemetryRef extends Item {
    /**
     * Raw ID used for identifying incoming serialized telemetry
     */
    id?: number;

    /**
     * Telemetry name
     */
    name: string;

    /**
     * Component or module that owns this telemetry
     */
    component: string;
}

export function isNumberTypeKind(kind: TypeKind): kind is NumberTypeKind {
    switch (kind) {
        case TypeKind.u8:
        case TypeKind.i8:
        case TypeKind.u16:
        case TypeKind.i16:
        case TypeKind.u32:
        case TypeKind.i32:
        case TypeKind.u64:
        case TypeKind.i64:
        case TypeKind.f32:
        case TypeKind.f64:
            return true;
        default:
            return false;
    }
}

export function isNumberType(type: Type): type is NumberType {
    return isNumberTypeKind(type.kind);
}
