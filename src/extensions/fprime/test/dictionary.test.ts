import { expect, test } from '@jest/globals';

import { Def } from '@gov.nasa.jpl.hermes/types';
import { readFileSync } from 'fs';
import { parseFprimeXmlDictionary } from '../src/dictionaryXml';

test('Parse Dictionary', () => {
    const [dict, topology] = parseFprimeXmlDictionary(
        readFileSync('./test/fprime/data/dictionary.xml', 'ascii')
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
