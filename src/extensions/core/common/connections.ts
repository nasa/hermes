import type { Proto } from '@gov.nasa.jpl.hermes/types';

export interface State {
    dictionaryLoading?: boolean;
    writeDisabled?: boolean;

    dictionaryProviders?: { key: string, title: string }[];

    dictionaries?: Record<string, Proto.IDictionaryHead>;
}

export type Backend = State;

export type Frontend = (
    { type: "refresh" }
    | { type: "dictionaryOpen", provider: string }
    | { type: "dictionaryRename", id: string, name: string }
    | { type: "dictionaryDelete", id: string }
);
