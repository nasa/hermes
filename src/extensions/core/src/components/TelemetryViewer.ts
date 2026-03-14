import * as vscode from 'vscode';

import { Telemetry, Sourced } from '@gov.nasa.jpl.hermes/types';
import { Api } from '@gov.nasa.jpl.hermes/api';
import { WebViewMessenger, WebViewPanelBase } from '@gov.nasa.jpl.hermes/vscode';

import { FrontendMessage, BackendMessage, TelemetrySeries, TelemetrySeriesData } from '../../common/telemetry';
import { DebounceEmitter } from '../utils/DebounceEmitter';

const MAX_POINTS_PER_CHANNEL = 10000; // ~10 minutes at 10Hz
const CHANNEL_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

export class TelemetryDatabase implements vscode.Disposable {
    /// Time-series metadata for each channel
    private telemetrySeries: Map<string, TelemetrySeries>;

    // Time-series data for each channel (column-wise storage)
    private telemetryData: Map<string, TelemetrySeriesData>;

    private telemetryDebouncer = new DebounceEmitter<Sourced<Telemetry>>({
        merge: (tlms) => tlms
    });
    onNewTelemetryData = this.telemetryDebouncer.event;

    // Timer to purge old channels
    private purgeTimer: ReturnType<typeof setInterval>;
    private telemetrySubscription: vscode.Disposable;
    constructor(readonly api: Api) {
        this.telemetrySeries = new Map();
        this.telemetryData = new Map();

        // Start periodic cleanup of stale channels
        this.purgeTimer = setInterval(() => this.purgeStaleChannels(), 60000);

        this.telemetrySubscription = this.api.onTelemetry((telem) => {
            const key = this.getChannelKey(telem);

            // Initialize series metadata if needed
            if (!this.telemetrySeries.has(key)) {
                const component = telem.def.component ?? '';
                const name = telem.def.name ?? '';
                this.telemetrySeries.set(key, {
                    source: telem.source,
                    component,
                    name
                });
            }

            // Initialize column arrays if needed
            if (!this.telemetryData.has(key)) {
                this.telemetryData.set(key, {
                    time: [],
                    sclk: [],
                    valueStr: [],
                    valueNum: []
                });
            }

            const data = this.telemetryData.get(key)!;
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

    private purgeStaleChannels(): void {
        const now = Date.now();
        const staleKeys: string[] = [];

        for (const [key, data] of this.telemetryData.entries()) {
            // Check if the last time entry is too old
            if (data.time.length > 0) {
                const lastTime = data.time[data.time.length - 1];
                if (now - lastTime > CHANNEL_TIMEOUT_MS) {
                    staleKeys.push(key);
                }
            }
        }

        for (const key of staleKeys) {
            this.telemetryData.delete(key);
            this.telemetrySeries.delete(key);
        }
    }

    clear() {
        this.telemetryData.clear();
        this.telemetrySeries.clear();
    }

    get(channelKey: string): TelemetrySeriesData | undefined {
        return this.telemetryData.get(channelKey);
    }

    dispose() {
        clearInterval(this.purgeTimer);
        this.telemetrySubscription.dispose();
        this.telemetryDebouncer.dispose();
    }
}

export class TelemetryTablePanel extends WebViewPanelBase implements vscode.WebviewViewProvider {
    constructor(readonly db: TelemetryDatabase, extensionPath: string) {
        super(extensionPath, 'hermes.telemetryTable');

        // Subscribe to telemetry stream
        this.subscriptions.push(
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions: {
                    // Keep context when hidden for performance
                    retainContextWhenHidden: true
                }
            }),

        );
    }

    async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
        await this.resolveWebview(
            webviewView.webview,
            'telemetry-table'
        );

        const messenger = new WebViewMessenger<FrontendMessage, BackendMessage>((msg) => {
            switch (msg.type) {
                case 'refresh':
                    // Send all current channel data (we can't easily send "latest values" with column-wise storage)
                    // The frontend will need to extract the latest values from the arrays
                    // For now, send empty update to trigger frontend refresh
                    break;

                case 'clear':
                    // Clear all telemetry data
                    this.db.clear();
                    break;

                case 'requestHistory': {
                    // Send historical data for a specific channel
                    const data = this.db.get(msg.channelKey);
                    if (data) {
                        // Filter to requested time window
                        const cutoffTime = Date.now() - msg.timeWindow;

                        // Find the first index within the time window
                        let startIdx = 0;
                        for (let i = 0; i < data.time.length; i++) {
                            if (data.time[i] >= cutoffTime) {
                                startIdx = i;
                                break;
                            }
                        }

                        // Slice the arrays from startIdx to end
                        messenger.postMessage({
                            type: 'history',
                            channelKey: msg.channelKey,
                            data: {
                                time: data.time.slice(startIdx),
                                sclk: data.sclk.slice(startIdx),
                                valueStr: data.valueStr?.slice(startIdx),
                                valueNum: data.valueNum?.slice(startIdx)
                            }
                        });
                    }
                    break;
                }
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
    constructor(readonly db: TelemetryDatabase, extensionPath: string) {
        super(extensionPath, 'hermes.telemetryPlot');

        // Subscribe to telemetry stream
        this.subscriptions.push(
            vscode.window.registerWebviewViewProvider(this.viewName, this, {
                webviewOptions: {
                    // Keep context when hidden for performance
                    retainContextWhenHidden: true
                }
            }),

        );
    }

    async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
        await this.resolveWebview(
            webviewView.webview,
            'telemetry-plot'
        );

        const messenger = new WebViewMessenger<FrontendMessage, BackendMessage>((msg) => {
            switch (msg.type) {
                case 'refresh':
                    // Send all current channel data (we can't easily send "latest values" with column-wise storage)
                    // The frontend will need to extract the latest values from the arrays
                    // For now, send empty update to trigger frontend refresh
                    break;

                case 'clear':
                    // Clear all telemetry data
                    this.db.clear();
                    break;

                case 'requestHistory': {
                    // Send historical data for a specific channel
                    const data = this.db.get(msg.channelKey);
                    if (data) {
                        // Filter to requested time window
                        const cutoffTime = Date.now() - msg.timeWindow;

                        // Find the first index within the time window
                        let startIdx = 0;
                        for (let i = 0; i < data.time.length; i++) {
                            if (data.time[i] >= cutoffTime) {
                                startIdx = i;
                                break;
                            }
                        }

                        // Slice the arrays from startIdx to end
                        messenger.postMessage({
                            type: 'history',
                            channelKey: msg.channelKey,
                            data: {
                                time: data.time.slice(startIdx),
                                sclk: data.sclk.slice(startIdx),
                                valueStr: data.valueStr?.slice(startIdx),
                                valueNum: data.valueNum?.slice(startIdx)
                            }
                        });
                    }
                    break;
                }
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
