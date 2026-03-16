import * as vscode from 'vscode';

import { Telemetry, Sourced, TimeFormat } from '@gov.nasa.jpl.hermes/types';
import { Api } from '@gov.nasa.jpl.hermes/api';
import { WebViewMessenger, WebViewPanelBase } from '@gov.nasa.jpl.hermes/vscode';

import { FrontendTableMessage, BackendTableMessage, FrontendPlotMessage, BackendPlotMessage, TelemetrySeries, TelemetrySeriesData, TableState } from '../../common/telemetry';
import { DebounceEmitter } from '../utils/DebounceEmitter';

const MAX_POINTS_PER_CHANNEL = 10000; // ~10 minutes at 10Hz

export class TelemetryDatabase implements vscode.Disposable {
    /// Time-series metadata for each channel
    readonly series: Map<string, TelemetrySeries>;

    // Time-series data for each channel (column-wise storage)
    readonly data: Map<string, TelemetrySeriesData>;

    // Table state (selected channels for plotting)
    private _tableState: TableState = {
        timeFormat: TimeFormat.SCLK,
        channels: []
    };

    private tableStateEmitter = new vscode.EventEmitter<TableState>();
    onTableStateChanged = this.tableStateEmitter.event;

    private telemetryDebouncer = new DebounceEmitter<Sourced<Telemetry>>({
        merge: (tlms) => tlms
    });
    onNewTelemetryData = this.telemetryDebouncer.event;

    private telemetrySubscription: vscode.Disposable;

    constructor(readonly api: Api) {
        this.series = new Map();
        this.data = new Map();

        this.telemetrySubscription = this.api.onTelemetry((telem) => {
            const key = this.getChannelKey(telem);

            // Initialize series metadata if needed
            if (!this.series.has(key)) {
                const component = telem.def.component ?? '';
                const name = telem.def.name ?? '';
                this.series.set(key, {
                    source: telem.source,
                    component,
                    name
                });
            }

            // Initialize column arrays if needed
            if (!this.data.has(key)) {
                this.data.set(key, {
                    time: [],
                    sclk: [],
                    valueStr: [],
                    valueNum: []
                });
            }

            const data = this.data.get(key)!;
            const time = telem.time ?? Date.now();
            const sclk = telem.time ?? 0;

            // Precompute all values for this data point to keep columns in sync
            const value = telem.value;
            let valueStr: string = '';
            let valueNum: number | undefined = undefined;

            if (value !== null && value !== undefined) {
                switch (typeof value) {
                    case 'string':
                        valueStr = value;
                        break;
                    case 'number':
                        valueStr = value.toFixed(3);
                        valueNum = value;
                        break;
                    case 'bigint':
                        valueNum = Number(value);
                        valueStr = String(valueNum);
                        break;
                    case 'boolean':
                        valueStr = value.toString();
                        break;
                    default:
                        valueStr = JSON.stringify(value);
                        break;
                }
            }

            // Append to all column arrays to keep them in sync
            data.time.push(time);
            data.sclk.push(sclk);
            data.valueStr!.push(valueStr);
            data.valueNum!.push(valueNum ?? 0);

            // Keep only last N points (ring buffer) - shift from all arrays
            if (data.time.length > MAX_POINTS_PER_CHANNEL) {
                data.time.shift();
                data.sclk.shift();
                data.valueStr!.shift();
                data.valueNum!.shift();
            }

            this.telemetryDebouncer.fire(telem);
        });
    }

    private getChannelKey(telem: Sourced<Telemetry>): string {
        return `${telem.source}.${telem.def.component}.${telem.def.name}`;
    }

    clear() {
        this.data.clear();
        this.series.clear();
    }

    get(channelKey: string): TelemetrySeriesData | undefined {
        return this.data.get(channelKey);
    }

    get tableState(): TableState {
        return this._tableState;
    }

    set tableState(state: TableState) {
        this._tableState = state;
        this.tableStateEmitter.fire(state);
    }

    dispose() {
        this.telemetrySubscription.dispose();
        this.telemetryDebouncer.dispose();
        this.tableStateEmitter.dispose();
    }
}

export class TelemetryTablePanel extends WebViewPanelBase implements vscode.WebviewViewProvider {
    constructor(readonly db: TelemetryDatabase, extensionPath: string) {
        super(extensionPath, 'hermes.telemetryTable');

        // Subscribe to telemetry stream
        this.subscriptions.push(
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions: {
                    // Clear context for memory and CPU usage
                    retainContextWhenHidden: false
                }
            }),
        );
    }

    async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
        await this.resolveWebview(
            webviewView.webview,
            'telemetry-table'
        );

        const messenger = new WebViewMessenger<FrontendTableMessage, BackendTableMessage>((msg) => {
            switch (msg.type) {
                case 'refresh': {
                    // Get all the latest values from all the channels
                    const channels: Record<string, any> = {};
                    for (const [key, series] of this.db.series.entries()) {
                        const data = this.db.data.get(key)!;
                        if (data.time.length < 1) {
                            continue;
                        }

                        const lastIdx = data.time.length - 1;
                        const valueNum = data.valueNum?.[lastIdx];
                        const isNumerical = valueNum !== undefined && !isNaN(valueNum);

                        channels[key] = {
                            ...series,
                            time: data.time[lastIdx],
                            sclk: data.sclk[lastIdx],
                            valueStr: data.valueStr?.[lastIdx],
                            valueNum,
                            isNumerical
                        };
                    }

                    messenger.postMessage({
                        type: "latest",
                        channels
                    });

                    break;
                }

                case 'clear':
                    // Clear all telemetry data
                    this.db.clear();
                    break;

                case 'tableState':
                    // Update table state in database (will notify plot panel)
                    this.db.tableState = msg.state;
                    break;
            }
        }, webviewView.webview);

        // Forward batched updates to frontend
        const disp = this.db.onNewTelemetryData((points) => {
            messenger.postMessage({
                type: 'append',
                points
            });
        });

        webviewView.onDidDispose(() => {
            messenger.dispose();
            disp.dispose();
        });
    }
}


export class TelemetryPlotPanel extends WebViewPanelBase implements vscode.WebviewViewProvider {
    private timeWindow: number = Infinity; // Default to all data

    constructor(readonly db: TelemetryDatabase, extensionPath: string) {
        super(extensionPath, 'hermes.telemetryPlot');

        // Subscribe to telemetry stream
        this.subscriptions.push(
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions: {
                    retainContextWhenHidden: false
                }
            }),

        );
    }

    async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
        await this.resolveWebview(
            webviewView.webview,
            'telemetry-plot'
        );

        const messenger = new WebViewMessenger<FrontendPlotMessage, BackendPlotMessage>((msg) => {
            switch (msg.type) {
                case 'refresh':
                    // Send full data for all selected channels
                    this.sendFullData(messenger);
                    break;

                case 'clear':
                    // Clear all telemetry data
                    this.db.clear();
                    break;

                case 'timeWindow':
                    // Update time window and resend full data
                    this.timeWindow = msg.timeWindow;
                    this.sendFullData(messenger);
                    break;
            }
        }, webviewView.webview);

        // Listen for table state changes and resend full data
        const tableStateDisp = this.db.onTableStateChanged(() => {
            this.sendFullData(messenger);
        });

        // Forward batched updates to frontend (only for selected channels)
        const telemetryDisp = this.db.onNewTelemetryData((points) => {
            const selectedChannels = new Set(this.db.tableState.channels);
            if (selectedChannels.size === 0) {
                return; // No channels selected, don't send anything
            }

            // Filter telemetry to only selected channels
            const filteredData: Record<string, TelemetrySeriesData> = {};

            for (const telem of points) {
                const key = `${telem.source}.${telem.def.component}.${telem.def.name}`;
                if (!selectedChannels.has(key)) {
                    continue; // Skip unselected channels
                }

                const data = this.db.get(key);
                if (!data || data.time.length === 0) {
                    continue;
                }

                // Get only the latest point
                const lastIdx = data.time.length - 1;
                filteredData[key] = {
                    time: [data.time[lastIdx]],
                    sclk: [data.sclk[lastIdx]],
                    valueStr: data.valueStr ? [data.valueStr[lastIdx]] : undefined,
                    valueNum: data.valueNum ? [data.valueNum[lastIdx]] : undefined
                };
            }

            if (Object.keys(filteredData).length > 0) {
                messenger.postMessage({
                    type: 'append',
                    data: filteredData
                });
            }
        });

        webviewView.onDidDispose(() => {
            messenger.dispose();
            tableStateDisp.dispose();
            telemetryDisp.dispose();
        });
    }

    private sendFullData(messenger: WebViewMessenger<FrontendPlotMessage, BackendPlotMessage>) {
        const selectedChannels = new Set(this.db.tableState.channels);
        if (selectedChannels.size === 0) {
            // No channels selected, send empty data
            messenger.postMessage({
                type: 'full',
                info: {},
                data: {}
            });
            return;
        }

        const fullInfo: Record<string, TelemetrySeries> = {};
        const fullData: Record<string, TelemetrySeriesData> = {};
        const cutoffTime = this.timeWindow === Infinity ? 0 : Date.now() - this.timeWindow;

        for (const channelKey of selectedChannels) {
            const series = this.db.series.get(channelKey);
            const data = this.db.get(channelKey);

            if (!series || !data || data.time.length === 0) {
                continue;
            }

            // Find the first index within the time window
            let startIdx = 0;
            if (cutoffTime > 0) {
                for (let i = 0; i < data.time.length; i++) {
                    if (data.time[i] >= cutoffTime) {
                        startIdx = i;
                        break;
                    }
                }
            }

            // Slice the arrays from startIdx to end
            fullInfo[channelKey] = series;
            fullData[channelKey] = {
                time: data.time.slice(startIdx),
                sclk: data.sclk.slice(startIdx),
                valueStr: data.valueStr?.slice(startIdx),
                valueNum: data.valueNum?.slice(startIdx)
            };
        }

        messenger.postMessage({
            type: 'full',
            data: fullData,
            info: fullInfo,
        });
    }
}
