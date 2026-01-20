import { Command } from '@commander-js/extra-typings';
import fs from 'fs';

import * as Hermes from '@gov.nasa.jpl.hermes/types';
import { parseFprimeJsonDictionary } from '../extensions/fprime/src/dictionaryJson';

export async function main(argv?: readonly string[]): Promise<number> {

    const program = new Command();
    program
        .name('fprime-dictionary')
        .description(`Load an FPrime (XML) dictionary

$ fprime-json-dictionary dict.json > out.pb
`);

    program
        .arguments('<dictionary>')
        .action(async (dictionary) => {
            const dict = parseFprimeJsonDictionary(fs.readFileSync(dictionary, 'utf-8'));

            await new Promise<void>((resolve, reject) => {
                process.stdout.write(
                    Hermes.Proto.Dictionary.encode(dict.toProto()).finish(),
                    (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    }
                );
            });
        });

    await program.parseAsync(argv);
    return 0;
}

main();