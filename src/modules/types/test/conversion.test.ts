import { describe, expect, test } from '@jest/globals';

import { ConversionContext, valueFromProto } from '../src/conversion';
import { hermes as Proto } from '../src/proto';

type NumericValue = number | bigint;
type TypedArrayConstructor =
    | typeof Uint8Array
    | typeof Int8Array
    | typeof Uint16Array
    | typeof Int16Array
    | typeof Uint32Array
    | typeof Int32Array
    | typeof BigUint64Array
    | typeof BigInt64Array
    | typeof Float32Array
    | typeof Float64Array;

interface RawNumberCase {
    name: string;
    kind: Proto.NumberKind;
    arrayType: TypedArrayConstructor;
    byteWidth: number;
    values: readonly NumericValue[];
    write: (
        view: DataView,
        offset: number,
        value: NumericValue,
        littleEndian: boolean,
    ) => void;
}

const rawNumberCases: readonly RawNumberCase[] = [
    {
        name: 'U8',
        kind: Proto.NumberKind.NUMBER_U8,
        arrayType: Uint8Array,
        byteWidth: Uint8Array.BYTES_PER_ELEMENT,
        values: [0, 0x7f, 0xff],
        write: (view, offset, value) => view.setUint8(offset, Number(value)),
    },
    {
        name: 'I8',
        kind: Proto.NumberKind.NUMBER_I8,
        arrayType: Int8Array,
        byteWidth: Int8Array.BYTES_PER_ELEMENT,
        values: [-0x80, -1, 0x7f],
        write: (view, offset, value) => view.setInt8(offset, Number(value)),
    },
    {
        name: 'U16',
        kind: Proto.NumberKind.NUMBER_U16,
        arrayType: Uint16Array,
        byteWidth: Uint16Array.BYTES_PER_ELEMENT,
        values: [0x1234, 0xabcd],
        write: (view, offset, value, littleEndian) =>
            view.setUint16(offset, Number(value), littleEndian),
    },
    {
        name: 'I16',
        kind: Proto.NumberKind.NUMBER_I16,
        arrayType: Int16Array,
        byteWidth: Int16Array.BYTES_PER_ELEMENT,
        values: [-0x1234, 0x1234],
        write: (view, offset, value, littleEndian) =>
            view.setInt16(offset, Number(value), littleEndian),
    },
    {
        name: 'U32',
        kind: Proto.NumberKind.NUMBER_U32,
        arrayType: Uint32Array,
        byteWidth: Uint32Array.BYTES_PER_ELEMENT,
        values: [0x12345678, 0xabcdef01],
        write: (view, offset, value, littleEndian) =>
            view.setUint32(offset, Number(value), littleEndian),
    },
    {
        name: 'I32',
        kind: Proto.NumberKind.NUMBER_I32,
        arrayType: Int32Array,
        byteWidth: Int32Array.BYTES_PER_ELEMENT,
        values: [-0x1234567, 0x1234567],
        write: (view, offset, value, littleEndian) =>
            view.setInt32(offset, Number(value), littleEndian),
    },
    {
        name: 'U64',
        kind: Proto.NumberKind.NUMBER_U64,
        arrayType: BigUint64Array,
        byteWidth: BigUint64Array.BYTES_PER_ELEMENT,
        values: [0x0123456789abcdefn, 0xfedcba9876543210n],
        write: (view, offset, value, littleEndian) =>
            view.setBigUint64(offset, BigInt(value), littleEndian),
    },
    {
        name: 'I64',
        kind: Proto.NumberKind.NUMBER_I64,
        arrayType: BigInt64Array,
        byteWidth: BigInt64Array.BYTES_PER_ELEMENT,
        values: [-0x0123456789abcdefn, 0x0123456789abcdefn],
        write: (view, offset, value, littleEndian) =>
            view.setBigInt64(offset, BigInt(value), littleEndian),
    },
    {
        name: 'F32',
        kind: Proto.NumberKind.NUMBER_F32,
        arrayType: Float32Array,
        byteWidth: Float32Array.BYTES_PER_ELEMENT,
        values: [1.5, -2.25],
        write: (view, offset, value, littleEndian) =>
            view.setFloat32(offset, Number(value), littleEndian),
    },
    {
        name: 'F64',
        kind: Proto.NumberKind.NUMBER_F64,
        arrayType: Float64Array,
        byteWidth: Float64Array.BYTES_PER_ELEMENT,
        values: [Math.PI, -1234.5],
        write: (view, offset, value, littleEndian) =>
            view.setFloat64(offset, Number(value), littleEndian),
    },
];

function encodeValues(testCase: RawNumberCase, bigEndian: boolean): Uint8Array {
    const buffer = new ArrayBuffer(testCase.byteWidth * testCase.values.length);
    const view = new DataView(buffer);

    testCase.values.forEach((value, index) => {
        testCase.write(view, index * testCase.byteWidth, value, !bigEndian);
    });

    return new Uint8Array(buffer);
}

function decodeRaw(raw: Proto.IBytesValue) {
    return valueFromProto({ r: raw }, new ConversionContext(['value']));
}

const byteOrders: [name: string, bigEndian: boolean][] = [
    ['little-endian', false],
    ['big-endian', true],
];

describe.each(byteOrders)('%s packed numeric values', (_byteOrder, bigEndian) => {
    test.each(rawNumberCases)('decodes $name values', (testCase) => {
        const decoded = decodeRaw({
            kind: testCase.kind,
            bigEndian,
            value: encodeValues(testCase, bigEndian),
        });

        expect(decoded).toBeInstanceOf(testCase.arrayType);
        expect(Array.from(decoded as ArrayLike<NumericValue>)).toEqual(testCase.values);
    });
});

test('defaults a missing kind to U8', () => {
    const decoded = decodeRaw({ value: Uint8Array.from([0, 0x7f, 0xff]) });

    expect(decoded).toBeInstanceOf(Uint8Array);
    expect(Array.from(decoded as Uint8Array)).toEqual([0, 0x7f, 0xff]);
});

test('defaults a missing byte order to little-endian', () => {
    const testCase = rawNumberCases.find(({ kind }) =>
        kind === Proto.NumberKind.NUMBER_U16
    )!;
    const decoded = decodeRaw({
        kind: testCase.kind,
        value: encodeValues(testCase, false),
    });

    expect(decoded).toBeInstanceOf(Uint16Array);
    expect(Array.from(decoded as Uint16Array)).toEqual(testCase.values);
});

test('decodes bytes from a view with a misaligned offset', () => {
    const testCase = rawNumberCases.find(({ kind }) =>
        kind === Proto.NumberKind.NUMBER_U32
    )!;
    const encoded = encodeValues(testCase, false);
    const backing = new Uint8Array(encoded.byteLength + 1);
    backing.set(encoded, 1);
    const bytes = backing.subarray(1);

    expect(bytes.byteOffset % Uint32Array.BYTES_PER_ELEMENT).not.toBe(0);

    const decoded = decodeRaw({
        kind: testCase.kind,
        value: bytes,
    });

    expect(decoded).toBeInstanceOf(Uint32Array);
    expect(Array.from(decoded as Uint32Array)).toEqual(testCase.values);
});

test('does not mutate incoming bytes while normalizing byte order', () => {
    const nativeBigEndian = new Uint8Array(new Uint16Array([0x0102]).buffer)[0] === 0x01;
    const testCase = rawNumberCases.find(({ kind }) =>
        kind === Proto.NumberKind.NUMBER_U16
    )!;
    const bytes = encodeValues(testCase, !nativeBigEndian);
    const originalBytes = Uint8Array.from(bytes);

    const decoded = decodeRaw({
        kind: testCase.kind,
        bigEndian: !nativeBigEndian,
        value: bytes,
    });

    expect(Array.from(decoded as Uint16Array)).toEqual(testCase.values);
    expect(bytes).toEqual(originalBytes);
});

test('rejects a byte count that is not a multiple of the numeric type width', () => {
    expect(() => decodeRaw({
        kind: Proto.NumberKind.NUMBER_U16,
        value: Uint8Array.from([0x12]),
    })).toThrow(RangeError);
});

test('rejects a raw value with missing bytes', () => {
    expect(() => decodeRaw({
        kind: Proto.NumberKind.NUMBER_U16,
    })).toThrow("value: missing field 'value'");
});

test('rejects an unknown numeric kind', () => {
    expect(() => decodeRaw({
        kind: 999 as Proto.NumberKind,
        value: Uint8Array.from([0]),
    })).toThrow('value: invalid value');
});
