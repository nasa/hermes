import { Type, TypeKind } from "./def";
import { DualKeyMap } from "./DualKeyMap";

export function typeKindName(kind?: TypeKind): string {
    switch (kind) {
        case TypeKind.u8:
            return "U8";
        case TypeKind.i8:
            return "I8";
        case TypeKind.u16:
            return "U16";
        case TypeKind.i16:
            return "I16";
        case TypeKind.u32:
            return "U32";
        case TypeKind.i32:
            return "I32";
        case TypeKind.u64:
            return "U64";
        case TypeKind.i64:
            return "I64";
        case TypeKind.f32:
            return "F32";
        case TypeKind.f64:
            return "F64";
        case TypeKind.boolean:
            return "bool";
        case TypeKind.string:
            return 'str';
        case TypeKind.array:
            return 'array';
        case TypeKind.bytes:
            return 'bytes';
        case TypeKind.enum:
            return 'enum';
        case TypeKind.object:
            return 'object';
        case TypeKind.bitmask:
            return 'bitmask';
        case TypeKind.reference:
            return `ref`;
        case TypeKind.void:
            return 'void';
        default:
            return "(none)";
    }
}

export function typeName(type: Type): string {
    switch (type.kind) {
        case TypeKind.u8:
            return "U8";
        case TypeKind.i8:
            return "I8";
        case TypeKind.u16:
            return "U16";
        case TypeKind.i16:
            return "I16";
        case TypeKind.u32:
            return "U32";
        case TypeKind.i32:
            return "I32";
        case TypeKind.u64:
            return "U64";
        case TypeKind.i64:
            return "I64";
        case TypeKind.f32:
            return "F32";
        case TypeKind.f64:
            return "F64";
        case TypeKind.boolean:
            return "bool";
        case TypeKind.string:
            if (type.maxLength) {
                return `str(${type.maxLength})`;
            } else {
                return 'str';
            }

        case TypeKind.array:
            return `${typeName(type.type)}[${type.size ?? ''}]`;
        case TypeKind.enum:
        case TypeKind.object:
        case TypeKind.bitmask:
        case TypeKind.bytes:
            return type.name ?? typeKindName(type.kind);
        case TypeKind.reference:
            return `ref(${type.name})`;
        case TypeKind.void:
            return `void(${type.size})`;
        default:
            return `unknown ${JSON.stringify(type)}`;
    }
}

export function escapeString(msg: string): string {
    msg = msg.replace(/\n/g, "\\n").replace(/\r/g, "\\r");
    const split = msg.split("");
    for (const match of msg.matchAll(/[^\x20-\x7E]/g)) {
        split[match.index] = `\\u${match[0].charCodeAt(0).toString(16).padStart(4, "0")}`;
    }
    return split.join("");
}

function compareValues<T>(a: DualKeyMap<T, any>, b: DualKeyMap<T, any>, cmp: (a1: T, b1: T) => boolean) {
    if (a.entries().length !== b.entries().length) {
        throw new Error(`Different number of entries: ${a.entries().length} != ${b.entries().length}`);
    }

    for (const [key, value] of a.entries()) {
        const bItem = b.get(key);
        if (!bItem) {
            return false;
        }

        if (!cmp(value, bItem)) {
            throw new Error(`Value with key ${key}: ${JSON.stringify(value)} != ${JSON.stringify(bItem)}`);
        }
    }

    return;
}

export function validateEqualTypes(a: Type, b: Type) {
    if (a.kind !== b.kind) {
        throw new Error(`${typeKindName(a.kind)} != ${typeKindName(b.kind)}`);
    }

    switch (a.kind) {
        case TypeKind.reference:
            if (b.kind === TypeKind.reference && a.name !== b.name) {
                throw new Error(`Not a reference to the same type ${a.name} != ${b.name}`);
            }

            return;
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
        case TypeKind.boolean:
            return;
        case TypeKind.string:
            if (b.kind !== TypeKind.string) {
                return;
            }

            if (a.lengthType !== b.lengthType) {
                throw new Error(`Different length types ${typeKindName(a.lengthType)} != ${typeKindName(b.lengthType)}`);
            }

            if (a.maxLength !== b.maxLength) {
                throw new Error(`Different max lengths ${a.maxLength} != ${b.maxLength}`);
            }

            return;
        case TypeKind.enum:
            if (b.kind !== TypeKind.enum) {
                return;
            }

            compareValues(a.values, b.values, (a1, b1) => {
                return a1.name === b1.name && a1.value === b1.value;
            });

            return;
        case TypeKind.bitmask:
            if (b.kind !== TypeKind.bitmask) {
                return false;
            }

            compareValues(a.values, b.values, (a1, b1) => {
                return a1.name === b1.name && a1.value === b1.value;
            });

            return;
        case TypeKind.array: {
            if (b.kind !== TypeKind.array) {
                return false;
            }

            try {
                validateEqualTypes(a.type, b.type);
            } catch (err) {
                throw new Error(`Element types are not the same: ${err}`);
            }

            const sizeStrA = JSON.stringify(a.size);
            const sizeStrB = JSON.stringify(b.size);
            if (sizeStrA !== sizeStrB) {
                throw new Error(`Sizes are not equal: ${sizeStrA} != ${sizeStrB}`);
            }

            if (a.lengthType !== b.lengthType) {
                throw new Error(`Length types are not equal: ${typeKindName(a.lengthType)} != ${b.lengthType}`);
            }

            return;
        }
        case TypeKind.object:
            if (b.kind !== TypeKind.object) {
                return false;
            }

            if (a.fields.length !== b.fields.length) {
                throw new Error(`Mismatched number of fields: ${a.fields.length} != ${b.fields.length}`);
            }

            for (let i = 0; i < a.fields.length; i++) {
                const fieldA = a.fields[i];
                const fieldB = b.fields[i];

                if (fieldA.name !== fieldB.name) {
                    throw new Error(`Field at index ${i} have different names: ${fieldA.name} != ${fieldB.name}`);
                }

                try {
                    validateEqualTypes(fieldA.type, fieldB.type);
                } catch (err) {
                    throw new Error(`Field '${fieldA.name}' type mismatch: ${err}`);
                }
            }
            return;
        case TypeKind.bytes: {
            if (b.kind !== TypeKind.bytes) {
                return false;
            }

            if (a.lengthType !== b.lengthType) {
                throw new Error(`Length types are not equal: ${typeKindName(a.lengthType)} != ${b.lengthType}`);
            }

            const sizeStrA = JSON.stringify(a.size);
            const sizeStrB = JSON.stringify(b.size);
            if (sizeStrA !== sizeStrB) {
                throw new Error(`Sizes are not equal: ${sizeStrA} != ${sizeStrB}`);
            }

            if (a.lengthType !== b.lengthType) {
                throw new Error(`Length types are not equal: ${typeKindName(a.lengthType)} != ${b.lengthType}`);
            }

            if (a.type !== b.type) {
                throw new Error(`Bytes types are not the same: ${typeKindName(a.type)} != ${b.type}`);
            }
        }
            return;
        case TypeKind.void:
            return;
    }
}
