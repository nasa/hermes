import { expect, test } from '@jest/globals';

import { Def, Dictionary, DualKeyMap } from '@gov.nasa.jpl.hermes/types';

import { fprimeDictionary } from '../src/yamcs';

// fprime-yamcs's bool enumeration, which it also uses for bools inside structs and arrays
const bool: Def.EnumType = {
    kind: Def.TypeKind.enum,
    name: 'bool',
    values: new DualKeyMap('value', [['False', { name: 'False', value: 0 }], ['True', { name: 'True', value: 255 }]]),
};

// A command from the YAMCS simulator, which has no OpCode assignment
const switchVoltageOn: Def.Command = {
    mnemonic: 'SWITCH_VOLTAGE_ON',
    component: '/YSS/SIMULATOR',
    arguments: [],
    metadata: { qualifiedName: '/YSS/SIMULATOR/SWITCH_VOLTAGE_ON', assignments: {} },
};

// A dictionary as YAMCS mode builds it from an fprime-yamcs instance, plus a simulator command without an OpCode
function yamcsDictionary() {
    const dict = new Dictionary({ name: 'fprime-project', type: 'yamcs' });
    dict.get('').addCommand('/BigData_YamcsDeployment/FileHandling/fileManager/RemoveFile', {
        mnemonic: 'RemoveFile',
        component: '/BigData_YamcsDeployment/FileHandling/fileManager',
        arguments: [{ name: 'fileName', type: { kind: Def.TypeKind.string } }, { name: 'ignoreErrors', type: bool }],
        metadata: {
            qualifiedName: '/BigData_YamcsDeployment/FileHandling/fileManager/RemoveFile',
            assignments: { OpCode: '25165825' },
        },
    });
    // We list only the GenerateDp argument a test sends, a 64-bit integer
    dict.get('').addCommand('/BigData_YamcsDeployment/FileHandling/fileManager/GenerateDp', {
        mnemonic: 'GenerateDp',
        component: '/BigData_YamcsDeployment/FileHandling/fileManager',
        arguments: [{ name: 'endOffset', type: { kind: Def.TypeKind.u64 } }],
        metadata: { qualifiedName: '/BigData_YamcsDeployment/FileHandling/fileManager/GenerateDp', assignments: { OpCode: '83894281' } },
    });
    // BigData has no bool inside a struct or array, so this command is made up
    dict.get('').addCommand('/BigData_YamcsDeployment/Demo/switches/SET', {
        mnemonic: 'SET',
        component: '/BigData_YamcsDeployment/Demo/switches',
        arguments: [{
            name: 'state',
            type: {
                kind: Def.TypeKind.object,
                name: 'SwitchState',
                fields: [{ name: 'on', type: bool }, { name: 'flags', type: { kind: Def.TypeKind.array, type: bool, size: 2 } }],
            },
        }],
        metadata: { qualifiedName: '/BigData_YamcsDeployment/Demo/switches/SET', assignments: { OpCode: '25165826' } },
    });
    dict.get('').addCommand('/YSS/SIMULATOR/SWITCH_VOLTAGE_ON', switchVoltageOn);
    return { ...dict.toProto(), id: 'yamcs:fprime-project' };
}

test('names YAMCS commands the F Prime way, with their opcodes and booleans', () => {
    const proto = fprimeDictionary(yamcsDictionary())!;
    expect(proto.id).toBe('yamcs:fprime-project:fprime');
    expect(proto.head).toMatchObject({ name: 'fprime-project (F Prime)', type: 'fprime' });

    const dict = Dictionary.fromProto(proto).get('');
    expect([...dict.getCommands()].map((c) => c.mnemonic)).toEqual(['RemoveFile', 'GenerateDp', 'SET']);
    const def = dict.getCommand('FileHandling.fileManager.RemoveFile');
    expect(def).toMatchObject({
        component: 'FileHandling.fileManager',
        mnemonic: 'RemoveFile',
        opcode: 25165825,
        metadata: { qualifiedName: '/BigData_YamcsDeployment/FileHandling/fileManager/RemoveFile' },
    });
    expect(def?.arguments.map((a) => a.type.kind)).toEqual([Def.TypeKind.string, Def.TypeKind.boolean]);

    const state = dict.getCommand('Demo.switches.SET')?.arguments[0].type as Def.ObjectType;
    expect(state.fields[0].type.kind).toBe(Def.TypeKind.boolean);
    expect((state.fields[1].type as Def.ArrayType).type.kind).toBe(Def.TypeKind.boolean);
});

test('builds no F Prime dictionary from an instance without opcodes', () => {
    const dict = new Dictionary({ name: 'simulator', type: 'yamcs' });
    dict.get('').addCommand('/YSS/SIMULATOR/SWITCH_VOLTAGE_ON', switchVoltageOn);
    expect(fprimeDictionary({ ...dict.toProto(), id: 'yamcs:simulator' })).toBeUndefined();
});
