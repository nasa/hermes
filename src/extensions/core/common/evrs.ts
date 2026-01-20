import { DisplayEvent } from "@gov.nasa.jpl.hermes/types/src";

export type BackendMessage = (
    | { type: "update", events: DisplayEvent[]; }
    | { type: "append", events: DisplayEvent | DisplayEvent[]; }
);

export type FrontendMessage = (
    | { type: "refresh" }
    | { type: "clear" }
);
