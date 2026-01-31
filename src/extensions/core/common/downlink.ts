import { Proto } from '@gov.nasa.jpl.hermes/types';

export type Backend = {
    inProgress: Proto.IFileTransfer[],
    finished: Proto.IFileDownlink[],
};

export type Frontend = (
    { type: "refresh" }
    | { type: "open", path: string }
);
