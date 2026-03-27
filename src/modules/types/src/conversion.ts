import * as Def from './def';
import { DualKeyMap } from './DualKeyMap';
import { hermes as Proto } from './proto';
import { DisplayEvent, Event, EvrSeverity } from './telemetry';
import { TypedArray, Value } from './types';
import Long from 'long';
import { typeKindName, typeName } from './util';

export class ConversionContext {
    constructor(readonly context: readonly string[]) { }

    error(message: string): Error {
        return new Error(`${this.context.join('.')}: ${message}'`);
    }

    value<T, K extends keyof T>(o: T, k: K): Exclude<T[K], undefined | null> {
        const a = o[k];
        if (a === null || a === undefined) {
            throw new Error(`${this.context.join('.')}: missing field '${String(k)}'`);
        }

        return a as Exclude<T[K], undefined | null>;
    }

    with(...fields: string[]): ConversionContext {
        return new ConversionContext([...this.context, ...fields]);
    }
}

function optional<I, O>(v: I | undefined | null, f: (i: I) => O): O | undefined {
    if (v === undefined || v === null || v === "") {
        return;
    }

    return f(v);
}

export function toNumber(n: any | Long | number | undefined) {
    if (typeof n?.toNumber === "function") {
        return n.toNumber() as number;
    } else if (n instanceof Long) {
        return n.toNumber();
    } else if (typeof n === "number") {
        return n;
    } else {
        return 0;
    }
}

export function integerKindFromProto(kind: Proto.IntKind): Def.IntegerTypeKind {
    switch (kind) {
        case Proto.IntKind.INT_U8:
            return Def.TypeKind.u8;
        case Proto.IntKind.INT_I8:
            return Def.TypeKind.i8;
        case Proto.IntKind.INT_U16:
            return Def.TypeKind.u16;
        case Proto.IntKind.INT_I16:
            return Def.TypeKind.i16;
        case Proto.IntKind.INT_U32:
            return Def.TypeKind.u32;
        case Proto.IntKind.INT_I32:
            return Def.TypeKind.i32;
        case Proto.IntKind.INT_U64:
            return Def.TypeKind.u64;
        case Proto.IntKind.INT_I64:
            return Def.TypeKind.u64;
    }
}

export function uintKindFromProto(kind: Proto.UIntKind): Def.UintTypeKind {
    switch (kind) {
        case Proto.UIntKind.UINT_U8:
            return Def.TypeKind.u8;
        case Proto.UIntKind.UINT_U16:
            return Def.TypeKind.u16;
        case Proto.UIntKind.UINT_U32:
            return Def.TypeKind.u32;
        case Proto.UIntKind.UINT_U64:
            return Def.TypeKind.u64;
    }
}

export function numberKindFromProto(kind: Proto.NumberKind): Def.NumberTypeKind {
    switch (kind) {
        case Proto.NumberKind.NUMBER_U8:
            return Def.TypeKind.u8;
        case Proto.NumberKind.NUMBER_I8:
            return Def.TypeKind.i8;
        case Proto.NumberKind.NUMBER_U16:
            return Def.TypeKind.u16;
        case Proto.NumberKind.NUMBER_I16:
            return Def.TypeKind.i16;
        case Proto.NumberKind.NUMBER_U32:
            return Def.TypeKind.u32;
        case Proto.NumberKind.NUMBER_I32:
            return Def.TypeKind.i32;
        case Proto.NumberKind.NUMBER_U64:
            return Def.TypeKind.u64;
        case Proto.NumberKind.NUMBER_I64:
            return Def.TypeKind.i64;
        case Proto.NumberKind.NUMBER_F32:
            return Def.TypeKind.f32;
        case Proto.NumberKind.NUMBER_F64:
            return Def.TypeKind.f64;
    }
}

export function floatKindFromProto(kind: Proto.FloatKind): Def.FloatTypeKind {
    switch (kind) {
        case Proto.FloatKind.F_F32:
            return Def.TypeKind.f32;
        case Proto.FloatKind.F_F64:
            return Def.TypeKind.f64;
    }
}

export function referenceKindFromProto(kind: Proto.ReferenceKind): Def.ReferenceTypeKind {
    switch (kind) {
        case Proto.ReferenceKind.REF_ENUM:
            return Def.TypeKind.enum;
        case Proto.ReferenceKind.REF_BITMASK:
            return Def.TypeKind.bitmask;
        case Proto.ReferenceKind.REF_OBJECT:
            return Def.TypeKind.object;
        case Proto.ReferenceKind.REF_ARRAY:
            return Def.TypeKind.array;
        case Proto.ReferenceKind.REF_BYTES:
            return Def.TypeKind.bytes;
    }
}

export function enumItemFromProto(
    proto: Proto.IEnumItem,
    ctx: ConversionContext
): Def.EnumItem {
    return {
        name: ctx.value(proto, 'name'),
        value: proto.value ?? 0,
        metadata: optional(proto.metadata, JSON.parse)
    };
}

export function typeFromProto(
    proto: Proto.IType,
    ctx: ConversionContext
): Def.Type {
    if (proto.ref) {
        return {
            kind: Def.TypeKind.reference,
            name: ctx.value(proto.ref, 'name'),
            expectedKind: optional(proto.ref.kind, referenceKindFromProto),
            metadata: optional(proto.metadata, JSON.parse)
        };
    } else if (proto.int) {
        let min, max;
        if (typeof proto.int.min === "number" && typeof proto.int.max === "number") {
            if (proto.int.min === 0 && proto.int.max === 0) {
                // This is probably an empty field
            } else {
                min = proto.int.min;
                max = proto.int.max;
            }
        }

        return {
            kind: integerKindFromProto(proto.int.kind ?? Proto.IntKind.INT_U8),
            min, max,
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.float) {
        let min, max;
        if (typeof proto.float.min === "number" && typeof proto.float.max === "number") {
            if (proto.float.min === 0 && proto.float.max === 0) {
                // This is probably an empty field
            } else {
                min = proto.float.min;
                max = proto.float.max;
            }
        }

        return {
            kind: floatKindFromProto(proto.float.kind ?? Proto.FloatKind.F_F32),
            min, max,
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.bool) {
        return {
            kind: Def.TypeKind.boolean,
            encodeType: optional(proto.bool.encodeType, uintKindFromProto),
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.string) {
        return {
            kind: Def.TypeKind.string,
            lengthType: optional(proto.string.lengthType, uintKindFromProto),
            maxLength: proto.string.maxLength ?? undefined,
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.enum) {
        return {
            kind: Def.TypeKind.enum,
            name: ctx.value(proto.enum, 'name'),
            encodeType: optional(proto.enum.encodeType, integerKindFromProto),
            values: new DualKeyMap('value', proto.enum.items?.map((item) => {
                const defItem = enumItemFromProto(item, ctx.with(item.name ?? 'unknown'));
                return [defItem.name, defItem];
            })),
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.bitmask) {
        return {
            kind: Def.TypeKind.bitmask,
            name: ctx.value(proto.bitmask, 'name'),
            encodeType: optional(proto.bitmask.encodeType, integerKindFromProto),
            values: new DualKeyMap('value', proto.bitmask.items?.map((item) => {
                const defItem = enumItemFromProto(item, ctx.with(item.name ?? 'unknown'));
                return [defItem.name, defItem];
            })),
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.object) {
        return {
            kind: Def.TypeKind.object,
            name: proto.object.name ?? undefined,
            fields: proto.object.fields?.map((field) => fieldFromProto(
                field,
                ctx.with(field.name ?? "")
            )) ?? [],
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.array) {
        return {
            kind: Def.TypeKind.array,
            name: proto.array.name ?? undefined,
            type: typeFromProto(ctx.value(proto.array, 'elType'), ctx.with('elType')),
            size: proto.array.dynamic ? [
                proto.array.dynamic.min ?? 0,
                proto.array.dynamic.max ?? 0,
            ] : proto.array.static ?? undefined,
            lengthType: optional(proto.array.lengthType, uintKindFromProto),
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.bytes) {
        return {
            kind: Def.TypeKind.bytes,
            name: proto.bytes.name ?? undefined,
            type: numberKindFromProto(proto.bytes.kind ?? Proto.NumberKind.NUMBER_U8),
            size: proto.bytes.dynamic ? [
                ctx.value(proto.bytes.dynamic, 'min'),
                ctx.value(proto.bytes.dynamic, 'max'),
            ] : proto.bytes.static ?? undefined,
            lengthType: optional(proto.bytes.lengthType, uintKindFromProto),
            metadata: optional(proto.metadata, JSON.parse),
        };
    } else if (proto.void) {
        return {
            kind: Def.TypeKind.void,
            size: proto.void.size ?? 0,
            metadata: optional(proto.metadata, JSON.parse),
        };
    }

    throw ctx.error('invalid proto type');
}

function filled<T>(f: T): f is Exclude<T, undefined | null> {
    return f !== undefined && f !== null;
}

const isBigEndian = ((new Uint32Array((new Uint8Array([1, 2, 3, 4])).buffer))[0] === 0x01020304);

export function valueFromProto(
    proto: Proto.IValue,
    ctx: ConversionContext,
): Value {
    if (filled(proto.a?.value)) {
        return proto.a.value.map((v, i) => valueFromProto(v, ctx.with(`${i}`)));
    } else if (filled(proto.b)) {
        return proto.b;
    } else if (filled(proto.f)) {
        return proto.f;
    } else if (filled(proto.i)) {
        return toNumber(proto.i);
    } else if (filled(proto.o?.o)) {
        return Object.fromEntries(Object.entries(proto.o.o).map(([key, value]) => [
            key,
            valueFromProto(value, ctx)
        ]));
    } else if (filled(proto.r)) {
        const bytes = ctx.value(proto.r, 'value');
        const swapper = Buffer.from(bytes);
        const bigEndian = proto.r.bigEndian ?? false;
        const kind = numberKindFromProto(proto.r.kind ?? Proto.NumberKind.NUMBER_U8);

        if (isBigEndian !== bigEndian) {
            switch (kind) {
                case Def.TypeKind.u8:
                case Def.TypeKind.i8:
                    break;
                case Def.TypeKind.u16:
                case Def.TypeKind.i16:
                    swapper.swap16();
                    break;
                case Def.TypeKind.u32:
                case Def.TypeKind.i32:
                case Def.TypeKind.f32:
                    swapper.swap32();
                    break;
                case Def.TypeKind.u64:
                case Def.TypeKind.i64:
                case Def.TypeKind.f64:
                    swapper.swap64();
                    break;
            }
        }

        switch (kind) {
            case Def.TypeKind.u8:
                return bytes;
            case Def.TypeKind.i8:
                return new Int8Array(bytes);
            case Def.TypeKind.u16:
                return new Uint16Array(bytes);
            case Def.TypeKind.i16:
                return new Int16Array(bytes);
            case Def.TypeKind.u32:
                return new Uint32Array(bytes);
            case Def.TypeKind.i32:
                return new Int32Array(bytes);
            case Def.TypeKind.u64:
                return new BigUint64Array(bytes as any);
            case Def.TypeKind.i64:
                return new BigInt64Array(bytes as any);
            case Def.TypeKind.f32:
                return new Float32Array(bytes);
            case Def.TypeKind.f64:
                return new Float64Array(bytes);
        }
    } else if (filled(proto.s)) {
        return proto.s;
    } else if (filled(proto.u)) {
        return toNumber(proto.u);
    } else if (filled(proto.e?.formatted)) {
        return proto.e!.formatted;
    } else if (filled(proto.e?.raw)) {
        return proto.e!.raw;
    }

    throw ctx.error('invalid value');
}

export function fieldFromProto(
    proto: Proto.IField,
    ctx: ConversionContext
): Def.Field {
    return {
        name: proto.name ?? "",
        type: typeFromProto(ctx.value(proto, 'type'), ctx.with("type")),
        value: proto.value ? valueFromProto(proto.value, ctx.with('value')) : undefined,
        metadata: optional(proto.metadata, JSON.parse)
    };
}

export function commandFromProto(
    proto: Proto.ICommandDef,
    ctx: ConversionContext
): Def.Command {
    return {
        opcode: ctx.value(proto, 'opcode'),
        mnemonic: ctx.value(proto, 'mnemonic'),
        component: proto.component ?? "",
        arguments: proto.arguments?.map((field) => fieldFromProto(
            field,
            ctx.with(field.name ?? "")
        )) ?? [],
        metadata: optional(proto.metadata, JSON.parse),
    } satisfies Def.Command;
}

export function evrSeverityFromProto(proto: Proto.EvrSeverity): EvrSeverity {
    switch (proto) {
        default:
        case Proto.EvrSeverity.EVR_DIAGNOSTIC:
            return EvrSeverity.diagnostic;
        case Proto.EvrSeverity.EVR_ACTIVITY_LOW:
            return EvrSeverity.activityLow;
        case Proto.EvrSeverity.EVR_ACTIVITY_HIGH:
            return EvrSeverity.activityHigh;
        case Proto.EvrSeverity.EVR_WARNING_LOW:
            return EvrSeverity.warningLow;
        case Proto.EvrSeverity.EVR_WARNING_HIGH:
            return EvrSeverity.warningHigh;
        case Proto.EvrSeverity.EVR_COMMAND:
            return EvrSeverity.command;
        case Proto.EvrSeverity.EVR_FATAL:
            return EvrSeverity.fatal;
    }
}

export function formatSpecifierTypeFromProto(proto: Proto.FormatSpecifierType): Def.FormatSpecifierType {
    switch (proto) {
        default:
        case Proto.FormatSpecifierType.FMT_DEFAULT:
            return Def.FormatSpecifierType.Default;
        case Proto.FormatSpecifierType.FMT_CHAR:
            return Def.FormatSpecifierType.Char;
        case Proto.FormatSpecifierType.FMT_DECIMAL:
            return Def.FormatSpecifierType.Decimal;
        case Proto.FormatSpecifierType.FMT_HEX_LOWER:
            return Def.FormatSpecifierType.HexLower;
        case Proto.FormatSpecifierType.FMT_HEX_UPPER:
            return Def.FormatSpecifierType.HexUpper;
        case Proto.FormatSpecifierType.FMT_OCTAL:
            return Def.FormatSpecifierType.Octal;
        case Proto.FormatSpecifierType.FMT_EXP_LOWER:
            return Def.FormatSpecifierType.ExpLower;
        case Proto.FormatSpecifierType.FMT_EXP_UPPER:
            return Def.FormatSpecifierType.ExpUpper;
        case Proto.FormatSpecifierType.FMT_FIXED_LOWER:
            return Def.FormatSpecifierType.FixedLower;
        case Proto.FormatSpecifierType.FMT_FIXED_UPPER:
            return Def.FormatSpecifierType.FixedUpper;
        case Proto.FormatSpecifierType.FMT_GENERAL_LOWER:
            return Def.FormatSpecifierType.GeneralLower;
        case Proto.FormatSpecifierType.FMT_GENERAL_UPPER:
            return Def.FormatSpecifierType.GeneralUpper;
    }
}

export function formatSpecifierFromProto(proto: Proto.IFormatSpecifier): Def.FormatSpecifier {
    return {
        type: formatSpecifierTypeFromProto(proto.type ?? Proto.FormatSpecifierType.FMT_DEFAULT),
        precision: proto.precision ?? undefined,
        argumentIndex: proto.argumentIndex ?? 0,
    };
}

export function formatFragmentFromProto(proto: Proto.IFormatFragment): Def.FormatFragment {
    if (proto.text !== undefined && proto.text !== null) {
        return { type: 'text', text: proto.text };
    } else if (proto.specifier) {
        return { type: 'specifier', specifier: formatSpecifierFromProto(proto.specifier) };
    }
    throw new Error('Invalid format fragment: must have either text or specifier');
}

export function formatStringFromProto(proto: Proto.IFormatString): Def.FormatString {
    return {
        fragments: proto.fragments?.map(formatFragmentFromProto) ?? [],
        original: proto.original ?? '',
    };
}

export function eventFromProto(
    proto: Proto.IEventDef,
    ctx: ConversionContext
): Def.Event {
    return {
        id: proto.id ?? 0,
        formatString: proto.formatString ?? "",
        format: proto.format ? formatStringFromProto(proto.format) : undefined,
        component: proto.component ?? "",
        name: proto.name ?? "",
        severity: evrSeverityFromProto(proto.severity ?? Proto.EvrSeverity.EVR_DIAGNOSTIC),
        arguments: proto.arguments?.map((field) => fieldFromProto(
            field,
            ctx.with(field.name ?? "")
        )) ?? [],
        metadata: optional(proto.metadata, JSON.parse),
    };
}

export function eventRefFromProto(
    proto: Proto.IEventRef,
): Def.EventRef {
    return {
        id: proto.id ?? 0,
        component: proto.component ?? "",
        name: proto.name ?? "",
        severity: evrSeverityFromProto(proto.severity ?? Proto.EvrSeverity.EVR_DIAGNOSTIC),
        arguments: proto.arguments ?? [],
    };
}

export function parameterFromProto(
    proto: Proto.IParameterDef,
    ctx: ConversionContext
): Def.Parameter {
    return {
        id: proto.id ?? 0,
        component: ctx.value(proto, 'component'),
        name: ctx.value(proto, 'name'),
        type: typeFromProto(ctx.value(proto, 'type'), ctx.with("type")),
        metadata: optional(proto.metadata, JSON.parse),
    };
}

export function telemetryFromProto(
    proto: Proto.ITelemetryDef,
    ctx: ConversionContext
) {
    return {
        id: proto.id ?? 0,
        component: ctx.value(proto, 'component'),
        name: ctx.value(proto, 'name'),
        type: typeFromProto(ctx.value(proto, 'type'), ctx.with("type")),
        metadata: optional(proto.metadata, JSON.parse),
    };
}

export function telemetryRefFromProto(
    proto: Proto.ITelemetryRef,
): Def.TelemetryRef {
    return {
        id: proto.id ?? 0,
        component: proto.component ?? "",
        name: proto.name ?? "",
    };
}

export function kindToNumberKind(value: Def.NumberTypeKind): Proto.NumberKind {
    switch (value) {
        case Def.TypeKind.u8:
            return Proto.NumberKind.NUMBER_U8;
        case Def.TypeKind.i8:
            return Proto.NumberKind.NUMBER_I8;
        case Def.TypeKind.u16:
            return Proto.NumberKind.NUMBER_U16;
        case Def.TypeKind.i16:
            return Proto.NumberKind.NUMBER_I16;
        case Def.TypeKind.u32:
            return Proto.NumberKind.NUMBER_U32;
        case Def.TypeKind.i32:
            return Proto.NumberKind.NUMBER_I32;
        case Def.TypeKind.u64:
            return Proto.NumberKind.NUMBER_U64;
        case Def.TypeKind.i64:
            return Proto.NumberKind.NUMBER_I64;
        case Def.TypeKind.f32:
            return Proto.NumberKind.NUMBER_F32;
        case Def.TypeKind.f64:
            return Proto.NumberKind.NUMBER_F64;
    }
}

export function isTypedArray(array: any): array is TypedArray {
    return (
        array instanceof Float32Array ||
        array instanceof Float64Array ||
        array instanceof Uint8Array ||
        array instanceof Uint8ClampedArray ||
        array instanceof Int8Array ||
        array instanceof Uint16Array ||
        array instanceof Int16Array ||
        array instanceof Uint32Array ||
        array instanceof Int32Array ||
        array instanceof BigInt64Array ||
        array instanceof BigUint64Array

    );
}

export function valueToProto(value: Value, type: Def.Type): Proto.IValue {
    switch (typeof value) {
        case 'string':
            switch (type.kind) {
                case Def.TypeKind.string:
                    return { s: value };
                case Def.TypeKind.enum:
                case Def.TypeKind.bitmask:
                    return { e: { raw: type.values.get(value)?.value, formatted: value } };
            }

            throw new Error(`string values must correspond to type string, enum, or bitmask, got: ${typeKindName(type.kind)}`);
        case 'number':
            switch (type.kind) {
                case Def.TypeKind.u8:
                case Def.TypeKind.u16:
                case Def.TypeKind.u32:
                case Def.TypeKind.u64:
                    return { u: value };

                case Def.TypeKind.i8:
                case Def.TypeKind.i16:
                case Def.TypeKind.i32:
                case Def.TypeKind.i64:
                    return { i: value };
                case Def.TypeKind.f32:
                case Def.TypeKind.f64:
                    return { f: value };
                case Def.TypeKind.enum:
                case Def.TypeKind.bitmask:
                    return { e: { raw: value, formatted: type.values.getK2(value)?.name } };
            }

            throw new Error('number values must correspond to type integers, floats enums or bitmask');
        // case 'bigint':
        //     switch (type.kind) {
        //         case Def.TypeKind.u8:
        //         case Def.TypeKind.u16:
        //         case Def.TypeKind.u32:
        //         case Def.TypeKind.u64:
        //             return { u: Long.fromString(value.toString(), true) };
        //         case Def.TypeKind.i8:
        //         case Def.TypeKind.i16:
        //         case Def.TypeKind.i32:
        //         case Def.TypeKind.i64:
        //             return { i: Long.fromString(value.toString(), false) };
        //     }

        //     throw new Error('expected integer type for bigint value');
        case 'boolean':
            if (type.kind !== Def.TypeKind.boolean) {
                throw new Error('expected boolean type');
            }

            return { b: value };
        case 'object':
            switch (type.kind) {
                case Def.TypeKind.array:
                    if (!Array.isArray(value)) {
                        throw new Error('expected array value');
                    }

                    return {
                        a: {
                            value: value.map((item) => valueToProto(item, type.type))
                        }
                    };
                case Def.TypeKind.bytes:
                    if (!isTypedArray(value)) {
                        throw new Error('expected types array for bytes type');
                    }

                    return {
                        r: {
                            kind: kindToNumberKind(type.type),
                            bigEndian: isBigEndian,
                            value: new Uint8Array(value as Uint8Array)
                        }
                    };
                case Def.TypeKind.object:
                    return {
                        o: {
                            o: Object.fromEntries(type.fields.map(v => [
                                v.name,
                                valueToProto((value as any)[v.name] as Value, v.type)
                            ]))
                        }
                    };
            }

            throw new Error(`expected array, bytes, or object for object values: ${typeName(type)} value ${JSON.stringify(value)}`);

        case 'undefined':
        case 'symbol':
        case 'function':
        default:
            throw new Error(`cannot convert value of type ${typeof value} to ${typeName(type)} protobuf value`);
    }
}

export function typeIsReferenceType(type: Def.Type): type is Def.ResolvedReferenceType {
    return (
        type instanceof Def.ResolvedArrayType
        || type instanceof Def.ResolvedBitmaskType
        || type instanceof Def.ResolvedBytesType
        || type instanceof Def.ResolvedEnumType
        || type instanceof Def.ResolvedObjectType
    );
}

export function referenceKindToProto(kind: Def.ReferenceTypeKind): Proto.ReferenceKind {
    switch (kind) {
        case Def.TypeKind.enum:
            return Proto.ReferenceKind.REF_ENUM;
        case Def.TypeKind.bitmask:
            return Proto.ReferenceKind.REF_BITMASK;
        case Def.TypeKind.array:
            return Proto.ReferenceKind.REF_ARRAY;
        case Def.TypeKind.bytes:
            return Proto.ReferenceKind.REF_BYTES;
        case Def.TypeKind.object:
            return Proto.ReferenceKind.REF_OBJECT;
    }
}

function longOrNumberToNumber(n: Long | number): number {
    if (typeof n === "number") {
        return n;
    } else {
        return n.toInt();
    }
}

export function intKindToProto(kind: Def.IntegerTypeKind): Proto.IntKind {
    switch (kind) {
        case Def.TypeKind.u8:
            return Proto.IntKind.INT_U8;
        case Def.TypeKind.i8:
            return Proto.IntKind.INT_I8;
        case Def.TypeKind.u16:
            return Proto.IntKind.INT_U16;
        case Def.TypeKind.i16:
            return Proto.IntKind.INT_I16;
        case Def.TypeKind.u32:
            return Proto.IntKind.INT_U32;
        case Def.TypeKind.i32:
            return Proto.IntKind.INT_I32;
        case Def.TypeKind.u64:
            return Proto.IntKind.INT_U64;
        case Def.TypeKind.i64:
            return Proto.IntKind.INT_I64;
    }
}

export function floatKindToProto(kind: Def.FloatTypeKind): Proto.FloatKind {
    switch (kind) {
        case Def.TypeKind.f32:
            return Proto.FloatKind.F_F32;
        case Def.TypeKind.f64:
            return Proto.FloatKind.F_F64;
    }
}

export function enumItemToProto(item: Def.EnumItem): Proto.IEnumItem {
    return {
        value: item.value,
        name: item.name,
        metadata: JSON.stringify(item.metadata)
    };
}

export function uintKindToProto(kind: Def.UintTypeKind): Proto.UIntKind {
    switch (kind) {
        case Def.TypeKind.u8:
            return Proto.UIntKind.UINT_U8;
        case Def.TypeKind.u16:
            return Proto.UIntKind.UINT_U16;
        case Def.TypeKind.u32:
            return Proto.UIntKind.UINT_U32;
        case Def.TypeKind.u64:
            return Proto.UIntKind.UINT_U64;
    }
}

export function numberKindToProto(kind: Def.NumberTypeKind): Proto.NumberKind {
    switch (kind) {
        case Def.TypeKind.u8:
            return Proto.NumberKind.NUMBER_U8;
        case Def.TypeKind.i8:
            return Proto.NumberKind.NUMBER_I8;
        case Def.TypeKind.u16:
            return Proto.NumberKind.NUMBER_U16;
        case Def.TypeKind.i16:
            return Proto.NumberKind.NUMBER_I16;
        case Def.TypeKind.u32:
            return Proto.NumberKind.NUMBER_U32;
        case Def.TypeKind.i32:
            return Proto.NumberKind.NUMBER_I32;
        case Def.TypeKind.u64:
            return Proto.NumberKind.NUMBER_U64;
        case Def.TypeKind.i64:
            return Proto.NumberKind.NUMBER_I64;
        case Def.TypeKind.f32:
            return Proto.NumberKind.NUMBER_F32;
        case Def.TypeKind.f64:
            return Proto.NumberKind.NUMBER_F64;
    }
}

export function typeToProto(type: Def.Type): Proto.IType {
    if (typeIsReferenceType(type)) {
        return {
            ref: {
                name: type.name,
                kind: optional(type.kind, referenceKindToProto)
            },
            metadata: JSON.stringify(type.ref.metadata)
        };
    }

    switch (type.kind) {
        case Def.TypeKind.u8:
        case Def.TypeKind.i8:
        case Def.TypeKind.u16:
        case Def.TypeKind.i16:
        case Def.TypeKind.u32:
        case Def.TypeKind.i32:
        case Def.TypeKind.u64:
        case Def.TypeKind.i64:
            return {
                int: {
                    kind: intKindToProto(type.kind),
                    min: type.min,
                    max: type.max,
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.f32:
        case Def.TypeKind.f64:
            return {
                float: {
                    kind: floatKindToProto(type.kind),
                    min: optional(type.min, longOrNumberToNumber),
                    max: optional(type.max, longOrNumberToNumber),
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.boolean:
            return {
                bool: {
                    encodeType: optional(type.encodeType, uintKindToProto),
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.string:
            return {
                string: {
                    lengthType: optional(type.lengthType, uintKindToProto),
                    maxLength: type.maxLength,
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.enum:
            return {
                enum: {
                    name: type.name,
                    encodeType: intKindToProto(type.encodeType ?? Def.TypeKind.i32),
                    items: type.values.map(enumItemToProto)
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.bitmask:
            return {
                bitmask: {
                    name: type.name,
                    encodeType: intKindToProto(type.encodeType ?? Def.TypeKind.i32),
                    items: type.values.map(enumItemToProto)
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.array:
            return {
                array: {
                    name: type.name,
                    elType: typeToProto(type.type),
                    ...(typeof type.size === "number" ? {
                        "static": type.size,
                    } : type.size ? {
                        dynamic: {
                            min: type.size[0],
                            max: type.size[1]
                        }
                    } : undefined),
                    lengthType: optional(type.lengthType, uintKindToProto),
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.bytes:
            return {
                bytes: {
                    name: type.name,
                    kind: numberKindToProto(type.type),
                    ...(typeof type.size === "number" ? {
                        "static": type.size,
                    } : type.size ? {
                        dynamic: {
                            min: type.size[0],
                            max: type.size[1]
                        }
                    } : undefined),
                    lengthType: optional(type.lengthType, uintKindToProto),
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.object:
            return {
                object: {
                    name: type.name,
                    fields: type.fields.map(fieldToProto)
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.void:
            return {
                void: {
                    size: type.size
                },
                metadata: JSON.stringify(type.metadata)
            };
        case Def.TypeKind.reference:
            return {
                ref: {
                    name: type.name,
                    kind: optional(type.expectedKind, referenceKindToProto)
                },
                metadata: JSON.stringify(type.metadata)
            };
    }
}

export function fieldToProto(field: Def.Field): Proto.IField {
    return {
        name: field.name,
        type: typeToProto(field.type),
        value: filled(field.value) ? valueToProto(field.value, field.type) : undefined,
        metadata: JSON.stringify(field.metadata)
    };
}

export function commandToProto(cmd: Def.Command): Proto.ICommandDef {
    return {
        opcode: cmd.opcode,
        mnemonic: cmd.mnemonic,
        component: cmd.component,
        arguments: cmd.arguments.map(fieldToProto),
        metadata: JSON.stringify(cmd.metadata)
    };
}

export function evrSeverityToProto(sev: EvrSeverity): Proto.EvrSeverity {
    switch (sev) {
        case EvrSeverity.diagnostic:
            return Proto.EvrSeverity.EVR_DIAGNOSTIC;
        case EvrSeverity.activityLow:
            return Proto.EvrSeverity.EVR_ACTIVITY_LOW;
        case EvrSeverity.activityHigh:
            return Proto.EvrSeverity.EVR_ACTIVITY_HIGH;
        case EvrSeverity.warningLow:
            return Proto.EvrSeverity.EVR_WARNING_LOW;
        case EvrSeverity.warningHigh:
            return Proto.EvrSeverity.EVR_WARNING_HIGH;
        case EvrSeverity.command:
            return Proto.EvrSeverity.EVR_COMMAND;
        case EvrSeverity.fatal:
            return Proto.EvrSeverity.EVR_FATAL;
    }
}

export function formatSpecifierTypeToProto(type: Def.FormatSpecifierType): Proto.FormatSpecifierType {
    switch (type) {
        case Def.FormatSpecifierType.Default:
            return Proto.FormatSpecifierType.FMT_DEFAULT;
        case Def.FormatSpecifierType.Char:
            return Proto.FormatSpecifierType.FMT_CHAR;
        case Def.FormatSpecifierType.Decimal:
            return Proto.FormatSpecifierType.FMT_DECIMAL;
        case Def.FormatSpecifierType.HexLower:
            return Proto.FormatSpecifierType.FMT_HEX_LOWER;
        case Def.FormatSpecifierType.HexUpper:
            return Proto.FormatSpecifierType.FMT_HEX_UPPER;
        case Def.FormatSpecifierType.Octal:
            return Proto.FormatSpecifierType.FMT_OCTAL;
        case Def.FormatSpecifierType.ExpLower:
            return Proto.FormatSpecifierType.FMT_EXP_LOWER;
        case Def.FormatSpecifierType.ExpUpper:
            return Proto.FormatSpecifierType.FMT_EXP_UPPER;
        case Def.FormatSpecifierType.FixedLower:
            return Proto.FormatSpecifierType.FMT_FIXED_LOWER;
        case Def.FormatSpecifierType.FixedUpper:
            return Proto.FormatSpecifierType.FMT_FIXED_UPPER;
        case Def.FormatSpecifierType.GeneralLower:
            return Proto.FormatSpecifierType.FMT_GENERAL_LOWER;
        case Def.FormatSpecifierType.GeneralUpper:
            return Proto.FormatSpecifierType.FMT_GENERAL_UPPER;
    }
}

export function formatSpecifierToProto(spec: Def.FormatSpecifier): Proto.IFormatSpecifier {
    return {
        type: formatSpecifierTypeToProto(spec.type),
        precision: spec.precision,
        argumentIndex: spec.argumentIndex,
    };
}

export function formatFragmentToProto(fragment: Def.FormatFragment): Proto.IFormatFragment {
    if (fragment.type === 'text') {
        return { text: fragment.text };
    } else {
        return { specifier: formatSpecifierToProto(fragment.specifier) };
    }
}

export function formatStringToProto(format: Def.FormatString): Proto.IFormatString {
    return {
        fragments: format.fragments.map(formatFragmentToProto),
        original: format.original,
    };
}

export function eventToProto(evr: Def.Event): Proto.IEventDef {
    return {
        id: evr.id,
        component: evr.component,
        name: evr.name,
        severity: evrSeverityToProto(evr.severity),
        formatString: evr.formatString,
        format: evr.format ? formatStringToProto(evr.format) : undefined,
        arguments: evr.arguments.map(fieldToProto),
        metadata: JSON.stringify(evr.metadata)
    };
}

export function parameterToProto(prm: Def.Parameter): Proto.IParameterDef {
    return {
        id: prm.id,
        component: prm.component,
        name: prm.name,
        type: typeToProto(prm.type),
        metadata: JSON.stringify(prm.metadata)
    };
}

export function telemetryToProto(tlm: Def.Telemetry): Proto.ITelemetryDef {
    return {
        id: tlm.id,
        component: tlm.component,
        name: tlm.name,
        type: typeToProto(tlm.type),
        metadata: JSON.stringify(tlm.metadata)
    };
}

export function eventToDisplayEvent(evr: (Event & { source?: string }) | DisplayEvent): DisplayEvent {
    if ('def' in evr) {
        return {
            time: evr.time,
            sclk: evr.sclk,
            source: evr.source ?? "",
            component: evr.def.component,
            name: evr.def.name,
            severity: evr.def.severity,
            message: evr.message,
        };
    } else {
        return evr;
    }
}

export function fileTransferState(value?: Proto.IFileTransferState) {
    return ({
        downlinkCompleted: value?.downlinkCompleted?.map((ft) => ({
            ...ft,
            size: longOrNumberToNumber(ft.size ?? 0),
        })),
        uplinkCompleted: value?.uplinkCompleted?.map((ft) => ({
            ...ft,
            size: longOrNumberToNumber(ft.size ?? 0),
        })),
        downlinkInProgress: value?.downlinkInProgress?.map((ft) => ({
            ...ft,
            progress: longOrNumberToNumber(ft.progress ?? 0),
            size: longOrNumberToNumber(ft.size ?? 0),
        })),
        uplinkInProgress: value?.uplinkInProgress?.map((ft) => ({
            ...ft,
            progress: longOrNumberToNumber(ft.progress ?? 0),
            size: longOrNumberToNumber(ft.size ?? 0),
        }))
    });
}
