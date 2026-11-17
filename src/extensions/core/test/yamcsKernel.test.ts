import { describe, expect, test } from '@jest/globals';

import { stripComment } from '../src/kernels/yamcs';

describe('stripComment', () => {
    test('cuts a trailing comment and keeps a # inside a string', () => {
        expect(stripComment('/Ref_Ref/CdhCore/cmdDisp/CMD_NO_OP_STRING "item #4" # waits 5 s')).toBe(
            '/Ref_Ref/CdhCore/cmdDisp/CMD_NO_OP_STRING "item #4" ',
        );
    });

    test('empties a whole-line comment', () => {
        expect(stripComment('   # heater on').trim()).toBe('');
    });
});
