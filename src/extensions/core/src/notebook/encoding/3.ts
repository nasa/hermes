import { CellNotebookHeader } from "./common";

export enum TagType {
    VERSION = 'version',
    CELL = 'cell',
    CELL_END = 'cellEnd',
    OUTPUT_START = 'outputStart',
    OUTPUT_ITEM = 'outputItem',
    OUTPUT_ITEM_END = 'outputItemEnd',
    OUTPUT_END = 'outputEnd'
}

export enum ParsingMode {
    CELL,
    OUTPUT
}

interface TagBase<T extends TagType, V> {
    type: T;
    value: V;
}

export type Tag = (
    TagBase<TagType.VERSION, number>
    | TagBase<TagType.CELL, CellNotebookHeader>
    | TagBase<TagType.CELL_END, null>
    | TagBase<TagType.OUTPUT_START, { [key: string]: any } | null>
    | TagBase<TagType.OUTPUT_ITEM, { mime: string }>
    | TagBase<TagType.OUTPUT_ITEM_END, null>
    | TagBase<TagType.OUTPUT_END, null>
);
