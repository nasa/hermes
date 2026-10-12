import { expect, test } from '@jest/globals';

import { Def } from '@gov.nasa.jpl.hermes/types';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseFprimeXmlDictionary } from '../src/dictionary/xml';
import { parseFprimeJsonDictionary } from '../src/dictionary/json';

test('Parse Dictionary', () => {
    const [dict, topology] = parseFprimeXmlDictionary(
        readFileSync(join(__dirname, 'data', 'dictionary.xml'), 'ascii')
    );

    expect(topology).toEqual("SystemReference");

    expect(dict.getTelemetry('systemResources.CPU_00')?.type.kind).toBe(Def.TypeKind.f32);
    expect(dict.getTelemetry('imu.accelerometer')?.type.kind).toBe(Def.TypeKind.array);

    const customType = dict.getType('Svc::ActiveLogger_FilterSeverity') as Def.EnumType;
    expect(customType?.kind).toBe(Def.TypeKind.enum);

    expect(customType?.values.get("WARNING_HI")).toBeTruthy();
    expect(customType?.values.get("ACTIVITY_LO")).toBeTruthy();
    expect(customType?.values.get("WARNING_HI")?.value).toBe(0);
    expect(customType?.values.get("ACTIVITY_LO")?.value).toBe(4);
});

function stringCmdDictionary(typeDefinitions: unknown[]): string {
    return JSON.stringify({
        metadata: {},
        typeDefinitions,
        commands: [{
            name: "Ref.cmdDisp.CMD_NO_OP_STRING",
            commandKind: "async",
            opcode: 1,
            formalParams: [{
                name: "arg1",
                type: { name: "string", kind: "string", size: 40 },
                ref: false,
            }],
        }],
    });
}

function stringArgLengthType(raw: string) {
    const dict = parseFprimeJsonDictionary(raw);
    const arg = dict.get("").getCommand("Ref.cmdDisp.CMD_NO_OP_STRING")?.arguments[0];
    return (arg?.type as Def.StringType).lengthType;
}

test('String length prefix defaults to U16 without FwSizeStoreType', () => {
    expect(stringArgLengthType(stringCmdDictionary([]))).toBe(Def.TypeKind.u16);
});

test('String length prefix follows FwSizeStoreType', () => {
    expect(stringArgLengthType(stringCmdDictionary([{
        kind: "alias",
        qualifiedName: "FwSizeStoreType",
        type: { name: "FwSizeType", kind: "qualifiedIdentifier" },
        underlyingType: { name: "U64", kind: "integer", size: 64, signed: false },
    }]))).toBe(Def.TypeKind.u64);
});
