import { expect, test } from '@jest/globals';
import Long from 'long';

import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';
import type { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { Def, Dictionary, DualKeyMap } from '@gov.nasa.jpl.hermes/types';
import type * as vscode from 'vscode';

import { fprimeDictionary, YamcsRunner } from '../src/yamcs';

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

// An event from F Prime's command dispatcher, as fprime-yamcs posts it to YAMCS
function dispatcherEvent(name: string, opcode: number): YamcsEvent {
    return {
        type: `CdhCore.cmdDisp.${name}`,
        message: `[${name}] Opcode 0x${opcode.toString(16)}`,
        extra: { Opcode: `${opcode}` },
    };
}

// Fakes of YAMCS mode's API and connection. The flight software answers each command with the events
// reply returns for its opcode. Like YAMCS mode, the API sends the archived events when the runner
// subscribes. reconnect reports the connection gone and back, as VscodeApi does, then sends them again.
function yamcs(reply: (opcode: number) => YamcsEvent[], archived: YamcsEvent[] = []) {
    let eventsArrived!: (instance: string, events: YamcsEvent[]) => void;
    let fswChanged!: (fsws: Hermes.Fsw[]) => void;
    const fire = (events: YamcsEvent[]) => eventsArrived('fprime-project', events);
    const sent: CommandValue[] = [];
    const api = {
        onYamcsEvents: (handler: typeof eventsArrived) => {
            eventsArrived = handler;
            setTimeout(() => fire(archived), 0);
            return { dispose: () => { } };
        },
        onFswChange: (listener: typeof fswChanged) => {
            fswChanged = listener;
            return { dispose: () => { } };
        },
    } as unknown as Hermes.Api;
    const fsw: Hermes.Fsw = {
        id: 'yamcs:fprime-project', type: 'yamcs', profileId: '',
        command: async (value) => {
            sent.push(value);
            const events = reply(value.def.opcode!);
            setTimeout(() => fire(events), 10);
            return true;
        },
    };
    const reconnect = () => {
        fswChanged([]);
        fswChanged([fsw]);
        fire(archived);
    };
    return { api, fsw, sent, reconnect };
}

const token = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => { } }) } as unknown as vscode.CancellationToken;
const fprimeCommand = (name: string) => Dictionary.fromProto(fprimeDictionary(yamcsDictionary())!).get('').getCommand(name)!;
const removeFile = fprimeCommand('FileHandling.fileManager.RemoveFile');
const cell = (...commands: CommandValue[]): Hermes.CommandSequence => ({ language: 'fprime', commands });
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

test('waits out each command\'s time tag, ignoring other commands\' events and archived ones', async () => {
    const opcode = removeFile.opcode!;
    const sentAt: number[] = [];
    // F Prime reports each command dispatched before it completes, and another command's error can arrive in between
    const { api, fsw, sent } = yamcs((op) => {
        sentAt.push(Date.now());
        return [dispatcherEvent('OpCodeDispatched', op), dispatcherEvent('OpCodeError', op + 1), dispatcherEvent('OpCodeCompleted', op)];
    }, [dispatcherEvent('OpCodeError', opcode)]);
    const runner = new YamcsRunner(api);
    // We let the archived events arrive first, as they do right after YAMCS mode connects
    await tick();
    const ok = await runner.run(fsw, cell(
        { def: removeFile, args: ['/tmp/a', true] },
        { def: removeFile, args: ['/tmp/b', false], metadata: { relativeTimeDelayMs: '200' } },
    ), token);

    expect(ok).toBe(true);
    // The second command's time tag holds it back 200 ms after the first one completes
    expect(sentAt[1] - sentAt[0]).toBeGreaterThanOrEqual(200);
    expect(sent.map((c) => c.args)).toEqual([['/tmp/a', 'True'], ['/tmp/b', 'False']]);
});

test('takes a completion that arrives before YAMCS mode says it sent the command', async () => {
    // YAMCS mode's fsw.command resolves only once YAMCS's history shows the command sent, and the flight
    // software can answer first
    const { api, fsw } = yamcs((op) => [dispatcherEvent('OpCodeCompleted', op)]);
    const send = fsw.command!;
    fsw.command = async (value, token) => {
        await send(value, token);
        await new Promise((resolve) => setTimeout(resolve, 50));
        return true;
    };
    expect(await new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).toBe(true);
});

test('sends booleans as labels, including inside structs and arrays', async () => {
    const { api, fsw, sent } = yamcs((op) => [dispatcherEvent('OpCodeCompleted', op)]);
    await new YamcsRunner(api).run(fsw, cell({ def: fprimeCommand('Demo.switches.SET'), args: [{ on: true, flags: [false, true] }] }), token);
    expect(sent[0].args).toEqual([{ on: 'True', flags: ['False', 'True'] }]);
});

test('sends 64-bit integers unchanged', async () => {
    const { api, fsw, sent } = yamcs((op) => [dispatcherEvent('OpCodeCompleted', op)]);
    const end = Long.MAX_UNSIGNED_VALUE;
    const generateDp = fprimeCommand('FileHandling.fileManager.GenerateDp');
    await new YamcsRunner(api).run(fsw, cell({ def: generateDp, args: [end] }), token);
    expect(sent[0].args[0]).toBe(end);
});

test.each(['OpCodeError', 'InvalidCommand'])('fails at the first command the flight software rejects with %s', async (name) => {
    const { api, fsw, sent } = yamcs((op) => [dispatcherEvent(name, op)]);
    await expect(new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }, { def: removeFile, args: ['/tmp/b', true] }), token))
        .rejects.toThrow(`FileHandling.fileManager.RemoveFile failed: [${name}] Opcode 0x1800001`);
    expect(sent).toHaveLength(1);
});

test('stops waiting when Hermes drops YAMCS mode\'s connection, rather than taking an archived event', async () => {
    // The flight software never answers, and the archive holds an earlier completion
    const { api, fsw, reconnect } = yamcs(() => [], [dispatcherEvent('OpCodeCompleted', removeFile.opcode!)]);
    const runner = new YamcsRunner(api);
    await tick();
    const run = runner.run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token);
    // We let the command go out and start waiting for its completion before Hermes reconnects
    await tick();
    reconnect();
    await expect(run).rejects.toThrow('Hermes lost YAMCS mode\'s connection before FileHandling.fileManager.RemoveFile completed');
});

test('stops waiting when the cell is cancelled', async () => {
    // The flight software never answers
    const { api, fsw } = yamcs(() => []);
    let cancel = () => { };
    const cancellable = {
        isCancellationRequested: false,
        onCancellationRequested: (listener: () => void) => {
            cancel = listener;
            return { dispose: () => { } };
        },
    } as unknown as vscode.CancellationToken;
    const run = new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), cancellable);
    await tick();
    cancel();
    await expect(run).rejects.toThrow('Cancelled');
});

test('leaves the next command its event after YAMCS refuses one', async () => {
    const { api, fsw } = yamcs((op) => [dispatcherEvent('OpCodeCompleted', op)]);
    const runner = new YamcsRunner(api);
    const send = fsw.command!;
    fsw.command = async () => { throw new Error('YAMCS refused it'); };
    await expect(runner.run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).rejects.toThrow('YAMCS refused it');

    fsw.command = send;
    expect(await runner.run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).toBe(true);
});
