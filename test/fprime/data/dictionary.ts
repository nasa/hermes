import * as HermesFprime from '@gov.nasa.jpl.hermes/fprime';
import { readFileSync } from 'fs';

const dictionary = HermesFprime.parseFprimeDictionary(
    readFileSync('./test/fprime/data/dictionary.xml', 'ascii')
).resolveReferences();
export default dictionary;
