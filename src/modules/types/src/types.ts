import Long from "long";

export type TypedArray =
    | Int8Array
    | Uint8Array
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | BigUint64Array
    | BigInt64Array;

export type PrimitiveValue = string | Long | number | boolean;
export type ObjectValue = Record<string, any>;
export type ArrayValue = Value[];
export type Value = ObjectValue | PrimitiveValue | ArrayValue | TypedArray;
