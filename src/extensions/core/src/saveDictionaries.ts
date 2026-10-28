import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';
import { parseArgs } from 'util';

import * as Rpc from '@gov.nasa.jpl.hermes/rpc';
import { Proto } from '@gov.nasa.jpl.hermes/types';

import { yamcsDictionary } from './api/yamcsCommands';

// yarn save-dictionaries runs this. We save each running instance's dictionary the way YAMCS mode does, so Open
// Dictionary can load it into Offline mode without connecting.
async function main() {
    const { values } = parseArgs({
        options: {
            address: { type: 'string', default: 'localhost:8091' },
            out: { type: 'string', default: '.' },
        },
    });
    const client = new Rpc.YamcsClient(values.address);
    try {
        await client.waitForReady(5000).catch((err) => {
            throw new Error(`Could not connect to YAMCS at ${values.address}: ${err}`, { cause: err });
        });
        await mkdir(values.out, { recursive: true });
        for (const instance of await client.listInstances()) {
            if (instance.state === 'RUNNING') {
                const dict = yamcsDictionary(instance.name!, await client.listCommands(instance.name!));
                const file = path.join(values.out, `${encodeURIComponent(dict.id!)}.dictionary.pb`);
                await writeFile(file, Proto.Dictionary.encode(dict).finish());
                console.log(`Saved ${file}`);
            }
        }
    } finally {
        client.close();
    }
}

main().catch((err) => {
    console.error(`${err}`);
    process.exitCode = 1;
});
