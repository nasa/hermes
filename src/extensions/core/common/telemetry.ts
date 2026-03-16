import { Sourced, Telemetry, TimeFormat } from "@gov.nasa.jpl.hermes/types";

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

export interface TelemetrySeriesDataPoint {
    time: number;
    sclk: number;
    valueStr?: string;
    valueNum?: number;
    isNumerical?: boolean;
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

export interface TableState {
    timeFormat: TimeFormat;
    channels: string[];
}

export type BackendTableMessage = (
    | { type: "latest", channels: Record<string, TelemetrySeries & TelemetrySeriesDataPoint> }
    | { type: "append", points: Sourced<Telemetry>[] }
);

export type FrontendTableMessage = (
    | { type: "refresh" }
    | { type: "clear" }
    | { type: "tableState", state: TableState, }
);

export type BackendPlotMessage = (
    | {
        type: "full",
        info: Record<string, TelemetrySeries>,
        data: Record<string, TelemetrySeriesData>
    }
    | { type: "append", data: Record<string, TelemetrySeriesData> }
)

export type FrontendPlotMessage = (
    | { type: "snapshot", pngData: string }
    | { type: "refresh" }
    | { type: "timeWindow", timeWindow: number }
)
