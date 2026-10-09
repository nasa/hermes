import { afterEach, expect, jest, test } from '@jest/globals';
import Long from 'long';

import type * as Hermes from '@gov.nasa.jpl.hermes/api';
import type { YamcsEvent } from '@gov.nasa.jpl.hermes/rpc';
import type { CommandValue } from '@gov.nasa.jpl.hermes/sequence';
import { Def, Dictionary, DualKeyMap } from '@gov.nasa.jpl.hermes/types';
import type * as vscode from 'vscode';

import { fprimeDictionary, type YamcsEventSource, YamcsRunner } from '../src/yamcs';

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

// Fakes of YAMCS mode's API and of its connection to an fprime-yamcs instance
function yamcs({ reply = (op) => [dispatcherEvent('OpCodeCompleted', op)], replyDuringSend = false, archived = [], refuse = 0 }: {
    reply?: (opcode: number) => YamcsEvent[]; replyDuringSend?: boolean; archived?: YamcsEvent[]; refuse?: number;
} = {}) {
    // The event handlers and connection listeners that the runner has subscribed
    const eventHandlers: ((instance: string, events: YamcsEvent[]) => void)[] = [];
    const connectionListeners: ((fsws: Hermes.Fsw[]) => void)[] = [];
    const raise = (events: YamcsEvent[]) => eventHandlers.forEach((handler) => handler('fprime-project', events));
    const api: Partial<Hermes.Api> & YamcsEventSource = {
        onYamcsEvents: (handler) => {
            eventHandlers.push(handler);
            return { dispose: () => { } };
        },
        onFswChange: (listener) => {
            connectionListeners.push(listener);
            return { dispose: () => { } };
        },
    };

    // The commands the runner sent
    const sent: CommandValue[] = [];
    const fsw: Hermes.Fsw = {
        id: 'yamcs:fprime-project', type: 'yamcs', profileId: '',
        command: async (value) => {
            sent.push(value);
            // The refuse option is the number of commands that YAMCS refuses before it accepts one
            if (sent.length <= refuse) {
                throw new Error('YAMCS refused it');
            }
            // The flight software's events normally arrive after fsw.command has returned
            const events = reply(value.def.opcode!);
            if (replyDuringSend) {
                raise(events);
            } else {
                setTimeout(() => raise(events), 0);
            }
            return true;
        },
    };

    // Hermes drops YAMCS mode's connection and connects again, and YAMCS mode then sends the archived events
    const reconnect = () => {
        connectionListeners.forEach((listener) => listener([]));
        connectionListeners.forEach((listener) => listener([fsw]));
        raise(archived);
    };
    return { api: api as Hermes.Api, fsw, sent, reconnect };
}

// A token nothing cancels
const token: vscode.CancellationToken = { isCancellationRequested: false, onCancellationRequested: () => ({ dispose: () => { } }) };

// Stands in for vscode.CancellationTokenSource, which Jest's vscode stub doesn't have
function cancellationSource() {
    const listeners: (() => void)[] = [];
    const token: vscode.CancellationToken = {
        isCancellationRequested: false,
        onCancellationRequested: (listener) => {
            listeners.push(() => listener(undefined));
            return { dispose: () => { } };
        },
    };
    const cancel = () => {
        token.isCancellationRequested = true;
        listeners.forEach((listener) => listener());
    };
    return { token, cancel };
}

// Waits up to a second for something the runner does on a later turn of the event loop
async function until(condition: () => boolean) {
    const deadline = Date.now() + 1000;
    while (!condition()) {
        if (Date.now() > deadline) {
            throw new Error('The runner never did what the test was waiting for');
        }
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
}

const fprimeCommand = (name: string) => Dictionary.fromProto(fprimeDictionary(yamcsDictionary())!).get('').getCommand(name)!;
const removeFile = fprimeCommand('FileHandling.fileManager.RemoveFile');
const cell = (...commands: CommandValue[]): Hermes.CommandSequence => ({ language: 'fprime', commands });

afterEach(() => {
    jest.useRealTimers();
});

test('sends a command only after its time tag has passed', async () => {
    jest.useFakeTimers();
    // A reply on a timer would wait for the fake clock too, so the flight software replies during the send
    const { api, fsw, sent } = yamcs({ replyDuringSend: true });
    const tagged = { def: removeFile, args: ['/tmp/a', true], metadata: { relativeTimeDelayMs: '200' } };
    const run = new YamcsRunner(api).run(fsw, cell(tagged), token);
    await jest.advanceTimersByTimeAsync(199);
    expect(sent).toHaveLength(0);
    await jest.advanceTimersByTimeAsync(1);
    expect(await run).toBe(true);
    expect(sent).toHaveLength(1);
});

test('completes a command on its own completion event, not on its dispatch event or another command\'s error', async () => {
    const { api, fsw } = yamcs({
        reply: (op) => [dispatcherEvent('OpCodeDispatched', op), dispatcherEvent('OpCodeError', op + 1), dispatcherEvent('OpCodeCompleted', op)],
    });
    expect(await new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).toBe(true);
});

test('accepts a completion event that arrives before fsw.command returns', async () => {
    const { api, fsw } = yamcs({ replyDuringSend: true });
    expect(await new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).toBe(true);
});

test('sends booleans as labels, including inside structs and arrays', async () => {
    const { api, fsw, sent } = yamcs();
    await new YamcsRunner(api).run(fsw, cell({ def: fprimeCommand('Demo.switches.SET'), args: [{ on: true, flags: [false, true] }] }), token);
    expect(sent.map((command) => command.args)).toEqual([[{ on: 'True', flags: ['False', 'True'] }]]);
});

test('sends 64-bit integers unchanged', async () => {
    const { api, fsw, sent } = yamcs();
    const end = Long.MAX_UNSIGNED_VALUE;
    const generateDp = fprimeCommand('FileHandling.fileManager.GenerateDp');
    await new YamcsRunner(api).run(fsw, cell({ def: generateDp, args: [end] }), token);
    // toStrictEqual also compares classes, so a Long rebuilt as a plain object would fail
    expect(sent.map((command) => command.args)).toStrictEqual([[end]]);
});

test.each(['OpCodeError', 'InvalidCommand'])('fails at the first command the flight software rejects with %s', async (name) => {
    const { api, fsw, sent } = yamcs({ reply: (op) => [dispatcherEvent(name, op)] });
    await expect(new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }, { def: removeFile, args: ['/tmp/b', true] }), token))
        .rejects.toThrow(`FileHandling.fileManager.RemoveFile failed: [${name}] Opcode 0x1800001`);
    expect(sent).toHaveLength(1);
});

test('fails a waiting command when YAMCS mode reconnects, and doesn\'t complete it on an archived event', async () => {
    // The flight software never answers, and the archive holds an old completion event with the command's opcode
    const { api, fsw, sent, reconnect } = yamcs({ reply: () => [], archived: [dispatcherEvent('OpCodeCompleted', removeFile.opcode!)] });
    const run = new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token);
    await until(() => sent.length === 1);
    reconnect();
    await expect(run).rejects.toThrow('Hermes lost YAMCS mode\'s connection before FileHandling.fileManager.RemoveFile completed');
});

test('a cell stopped while a command waits for its completion event says YAMCS already sent the command', async () => {
    // The flight software never answers
    const { api, fsw, sent } = yamcs({ reply: () => [] });
    const source = cancellationSource();
    const run = new YamcsRunner(api).run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), source.token);
    await until(() => sent.length === 1);
    source.cancel();
    await expect(run).rejects.toThrow('Cancelled before FileHandling.fileManager.RemoveFile completed. YAMCS already sent it.');
});

test('after YAMCS refuses a command, the next command with the same opcode still gets its completion event', async () => {
    const { api, fsw } = yamcs({ refuse: 1 });
    const runner = new YamcsRunner(api);
    // The runner had started waiting for the first command's completion event. It has to drop that wait,
    // or the leftover wait would receive the second command's event.
    await expect(runner.run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).rejects.toThrow('YAMCS refused it');
    expect(await runner.run(fsw, cell({ def: removeFile, args: ['/tmp/a', true] }), token)).toBe(true);
});
