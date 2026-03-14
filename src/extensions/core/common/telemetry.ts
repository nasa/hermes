import { Sourced, Telemetry } from "@gov.nasa.jpl.hermes/types";

export interface TelemetrySeries {
    /**
     * FSW source ID
     */
    source: string;

    /**
     * Component or module
     */
    component: string;

    /**
     * Channel name (scoped by component)
     */
    name: string;
}

export interface TelemetrySeriesData {
    /**
     * Time in UTC milliseconds
     */
    time: number[];

    /**
     * Raw on-board sclk
     */
    sclk: number[];

    /**
     * String representation for display in table or state chart
     */
    valueStr?: string[];

    /**
     * Numerical representation for display in plot
     */
    valueNum?: number[];
}

export interface TelemetryHistory {
    channelKey: string;
    times: number[];
    values: number[];
}

export type BackendMessage = (
    | { type: "append", points: Sourced<Telemetry>[]; }
    | { type: "history", channelKey: string, data: TelemetrySeriesData }
);

export type FrontendMessage = (
    | { type: "refresh" }
    | { type: "clear" }
    | { type: "requestHistory", channelKey: string, timeWindow: number }
);
