import { expect, test } from '@jest/globals';

import { Dictionary } from '../src/dictionary';

test('keeps commands without opcodes, found by name', () => {
    const dict = new Dictionary({ name: 'test', type: 'yamcs' });
    const ns = dict.get('');
    ns.addCommand('/Sim/PING', { mnemonic: 'PING', component: '/Sim', arguments: [] });
    ns.addCommand('/Sim/RESET', { mnemonic: 'RESET', component: '/Sim', arguments: [] });
    ns.addCommand('Sim.NO_OP', { opcode: 0x10, mnemonic: 'NO_OP', component: 'Sim', arguments: [] });

    const loaded = Dictionary.fromProto(dict.toProto()).get('');
    expect(loaded.getCommand('/Sim/RESET')?.opcode).toBeUndefined();
    expect(loaded.getCommand('/Sim/PING')?.mnemonic).toBe('PING');
    expect(loaded.getCommand(0x10)?.mnemonic).toBe('NO_OP');
});
