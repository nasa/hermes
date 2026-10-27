import { afterEach, expect, jest, test } from '@jest/globals';
import Long from 'long';

import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { Def, Dictionary, DualKeyMap, Proto } from '@gov.nasa.jpl.hermes/types';
import type * as vscode from 'vscode';

import { fprimeDictionary, runOnYamcs, updateFprimeDictionaries } from '../src/yamcs';

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
    dict.get('').addCommand('/BigData_YamcsDeployment/FileHandling/fileManager/GenerateDp', {
        mnemonic: 'GenerateDp',
        component: '/BigData_YamcsDeployment/FileHandling/fileManager',
        arguments: [{ name: 'endOffset', type: { kind: Def.TypeKind.u64 } }],
        metadata: { qualifiedName: '/BigData_YamcsDeployment/FileHandling/fileManager/GenerateDp', assignments: { OpCode: '83894281' } },
    });
    // BigData has no command with a bool inside a struct or array, so we made this one up
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

// A dictionary as YAMCS mode builds it from the YAMCS simulator, which has no opcodes
function simulatorDictionary() {
    const dict = new Dictionary({ name: 'simulator', type: 'yamcs' });
    dict.get('').addCommand('/YSS/SIMULATOR/SWITCH_VOLTAGE_ON', switchVoltageOn);
    return { ...dict.toProto(), id: 'yamcs:simulator' };
}

test('builds no F Prime dictionary from an instance without opcodes', () => {
    expect(fprimeDictionary(simulatorDictionary())).toBeUndefined();
});

test('adds an F Prime dictionary for each YAMCS dictionary with opcodes that has none yet, and removes one whose YAMCS dictionary is gone', async () => {
    const stored: Record<string, Proto.IDictionary> = { 'yamcs:fprime-project': yamcsDictionary(), 'yamcs:simulator': simulatorDictionary() };
    const added: Proto.IDictionary[] = [];
    const removed: string[] = [];
    const api: Partial<Hermes.Api> = {
        allDictionaries: async () => ({
            'yamcs:fprime-project': { type: 'yamcs' },
            'yamcs:simulator': { type: 'yamcs' },
            // This one already has its F Prime dictionary, so getDictionary is never asked for it
            'yamcs:other': { type: 'yamcs' },
            'yamcs:other:fprime': { type: 'fprime' },
            // This one's YAMCS dictionary is gone
            'yamcs:deleted:fprime': { type: 'fprime' },
        }),
        getDictionary: async (id) => stored[id],
        addDictionary: async (dict) => { added.push(dict); return dict.id!; },
        removeDictionary: async (id) => { removed.push(id); },
    };
    await updateFprimeDictionaries(api as Hermes.Api);
    expect(added.map((dict) => dict.id)).toEqual(['yamcs:fprime-project:fprime']);
    expect(removed).toEqual(['yamcs:deleted:fprime']);
});

// A fake of YAMCS mode's connection, which records each command it sends. It refuses a command whose first
// argument is refused.
function yamcs(refused?: string) {
    const sent: CommandValue[] = [];
    const fsw: Hermes.Fsw = {
        id: 'yamcs:fprime-project', type: 'yamcs',
        command: async (value) => {
            if (refused !== undefined && value.args[0] === refused) {
                throw new Error(`YAMCS refused ${refused}`);
            }
            sent.push(value);
            return true;
        },
    };
    return { fsw, sent };
}

// A token nothing cancels
const token: vscode.CancellationToken = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => { } }) };

const fprimeCommand = (name: string) => Dictionary.fromProto(fprimeDictionary(yamcsDictionary())!).get('').getCommand(name)!;
const removeFile = fprimeCommand('FileHandling.fileManager.RemoveFile');
const cell = (...commands: CommandValue[]): Hermes.CommandSequence => ({ language: 'fprime', commands });

afterEach(() => {
    jest.useRealTimers();
});

test('sends a command only after its time tag has passed', async () => {
    jest.useFakeTimers();
    const { fsw, sent } = yamcs();
    const tagged = { def: removeFile, args: ['/tmp/a', true], metadata: { relativeTimeDelayMs: '200' } };
    const run = runOnYamcs(fsw, cell(tagged), token);
    await jest.advanceTimersByTimeAsync(199);
    expect(sent).toHaveLength(0);
    await jest.advanceTimersByTimeAsync(1);
    expect(await run).toBe(true);
    expect(sent).toHaveLength(1);
});

test('stops waiting out a time tag when the cell is stopped', async () => {
    jest.useFakeTimers();
    const { fsw, sent } = yamcs();
    // VS Code calls the listeners of a cell's token when the user stops the cell
    const listeners: ((e: unknown) => unknown)[] = [];
    const stoppable: vscode.CancellationToken = {
        isCancellationRequested: false,
        onCancellationRequested: (listener) => {
            listeners.push(listener);
            return { dispose: () => { } };
        },
    };
    const tagged = { def: removeFile, args: ['/tmp/a', true], metadata: { relativeTimeDelayMs: '200' } };
    const run = runOnYamcs(fsw, cell(tagged), stoppable);
    listeners.forEach((listener) => listener(undefined));
    await expect(run).rejects.toThrow('Cancelled');
    expect(sent).toHaveLength(0);
});

test('tells the cell how long a time tag makes it wait, and tells it nothing for a command without a time tag', async () => {
    jest.useFakeTimers();
    const { fsw } = yamcs();
    const onWait = jest.fn();
    const untagged = { def: removeFile, args: ['/tmp/a', true] };
    const run = runOnYamcs(fsw, cell(untagged, { ...untagged, metadata: { relativeTimeDelayMs: '200' } }), token, undefined, onWait);
    await jest.advanceTimersByTimeAsync(199);
    // The wait is not over yet, and the cell has already been told how long it is
    expect(onWait.mock.calls).toEqual([[200]]);
    await jest.advanceTimersByTimeAsync(1);
    await run;
});

test('sends commands in order, and none after one that YAMCS refuses', async () => {
    const { fsw, sent } = yamcs('/tmp/c');
    const remove = (fileName: string): CommandValue => ({ def: removeFile, args: [fileName, true] });
    const run = runOnYamcs(fsw, cell(remove('/tmp/a'), remove('/tmp/b'), remove('/tmp/c'), remove('/tmp/d')), token);
    await expect(run).rejects.toThrow('YAMCS refused /tmp/c');
    expect(sent.map((command) => command.args[0])).toEqual(['/tmp/a', '/tmp/b']);
});

test('sends booleans as labels, including inside structs and arrays', async () => {
    const { fsw, sent } = yamcs();
    await runOnYamcs(fsw, cell({ def: fprimeCommand('Demo.switches.SET'), args: [{ on: true, flags: [false, true] }] }), token);
    expect(sent.map((command) => command.args)).toEqual([[{ on: 'True', flags: ['False', 'True'] }]]);
});

test('sends 64-bit integers unchanged', async () => {
    const { fsw, sent } = yamcs();
    const end = Long.MAX_UNSIGNED_VALUE;
    const generateDp = fprimeCommand('FileHandling.fileManager.GenerateDp');
    await runOnYamcs(fsw, cell({ def: generateDp, args: [end] }), token);
    // toStrictEqual also compares classes, so a Long rebuilt as a plain object would fail
    expect(sent.map((command) => command.args)).toStrictEqual([[end]]);
});
