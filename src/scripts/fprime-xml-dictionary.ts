import { Command } from '@commander-js/extra-typings';
import fs from 'fs';

import * as Hermes from '@gov.nasa.jpl.hermes/types';
import { parseFprimeXmlDictionary } from '../extensions/fprime/src/dictionaryXml';

export async function main(argv?: readonly string[]): Promise<number> {

    const program = new Command();
    program
        .name('fprime-dictionary')
        .description(`Load an FPrime dictionary

$ fprime-xml-dictionary dict.xml --name CadreBaseStation --version 5.0.3
`);

    program
        .arguments('<dictionary>')
        .option('-n, --set-name <name>', 'Name entry to use')
        .option('--set-version <version>', 'Dictionary version to use')
        .action(async (dictionary, args) => {
            let dictNs: Hermes.DictionaryNamespace;
            let topology: string | undefined;

            try {
                [dictNs, topology] = parseFprimeXmlDictionary(fs.readFileSync(dictionary, 'utf-8'));
            } catch (e) {
                console.error(e);
                return;
            }

            const dict = new Hermes.Dictionary({
                type: "fprime",
                name: args.setName ?? topology,
                version: args.setVersion,
            });

            dict.namespaces.set("", dictNs);

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