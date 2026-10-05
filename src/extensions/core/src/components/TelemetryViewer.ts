import * as vscode from 'vscode';
import { tmpdir } from 'tmp';

import { Telemetry, Sourced, TimeFormat } from '@gov.nasa.jpl.hermes/types';
import { Api } from '@gov.nasa.jpl.hermes/api';
import { YamcsParameterValue } from '@gov.nasa.jpl.hermes/rpc';
import { WebViewMessenger, WebViewPanelBase } from '@gov.nasa.jpl.hermes/vscode';

import { FrontendTableMessage, BackendTableMessage, FrontendPlotMessage, BackendPlotMessage, TelemetrySeries, TelemetrySeriesData, TelemetrySeriesDataPoint, TableState } from '../../common/telemetry';
import { cullTelemetrySeriesData } from '../../common/telemetryTimeWindow';
import { DebounceEmitter } from '../utils/DebounceEmitter';
import { YamcsParameterSource } from '../api/Yamcs';
import { leaves, millis, splitName } from './yamcsRows';

const MAX_POINTS_PER_CHANNEL = 10000; // ~10 minutes at 10Hz

// Appends one point to every column array, keeping them in sync, and drops the
// oldest point once the channel holds more than MAX_POINTS_PER_CHANNEL.
function appendPoint(data: TelemetrySeriesData, time: number, sclk: number, valueStr: string, valueNum: number) {
    data.time.push(time);
    data.sclk.push(sclk);
    data.valueStr!.push(valueStr);
    data.valueNum!.push(valueNum);
    if (data.time.length > MAX_POINTS_PER_CHANNEL) {
        data.time.shift();
        data.sclk.shift();
        data.valueStr!.shift();
        data.valueNum!.shift();
    }
}

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

    // F Prime telemetry reaches the table and plot as Telemetry points, each carrying its Hermes
    // dictionary definition. YAMCS values come named by YAMCS instead, so we store them as rows here
    // and only tell the panels which channels changed. The panels then read each channel's newest point.
    private yamcsDebouncer = new DebounceEmitter<string, Set<string>>({
        merge: (keys) => new Set(keys)
    });
    onNewYamcsData = this.yamcsDebouncer.event;

    private telemetrySubscription: vscode.Disposable;
    private yamcsSubscription?: vscode.Disposable;

    constructor(readonly api: Api & Partial<YamcsParameterSource>) {
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
            const time = Date.now();
            const sclk = telem.sclk ?? 0;

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

            appendPoint(data, time, sclk, valueStr, valueNum ?? 0);
            this.telemetryDebouncer.fire(telem);
        });

        // Only YAMCS mode sends parameter values, so in every other mode this subscription stays quiet
        this.yamcsSubscription = this.api.onYamcsParameters?.((instance, values) => this.addYamcs(instance, values));
    }

    /**
     * Store each scalar leaf as its own channel, keyed by qualified name plus
     * member path. Points use the value's acquisition time, when YAMCS received
     * it, as F Prime telemetry uses the time it reached the extension.
     */
    private addYamcs(instance: string, values: YamcsParameterValue[]) {
        const source = `yamcs:${instance}`;
        for (const pv of values) {
            const time = millis(pv.acquisitionTime);
            if (!pv.id?.name || time === undefined) {
                continue;
            }

            // The table has component and name columns. For a YAMCS value, the space system fills
            // component, and each struct member or array element becomes its own row, named like
            // comQueueDepth[1]. Prefixing the key with yamcs:<instance> keeps those rows apart from
            // F Prime channels and from the same parameter in another instance.
            const [component, name] = splitName(pv.id.name);
            for (const leaf of leaves(pv.engValue)) {
                const key = `${source}:${pv.id.name}${leaf.memberPath}`;
                if (!this.series.has(key)) {
                    this.series.set(key, { source, component, name: name + leaf.memberPath });
                }

                let data = this.data.get(key);
                if (!data) {
                    data = { time: [], sclk: [], valueStr: [], valueNum: [] };
                    this.data.set(key, data);
                }

                // YAMCS re-sends each parameter's last value when a subscription opens, for example after
                // switching modes and back. That copy keeps its acquisition time, so we skip a value equal
                // to our newest point. We also skip anything older, which would put the plot out of time order.
                const newestTime = data.time[data.time.length - 1];
                const newestValue = data.valueStr![data.valueStr!.length - 1];
                if (data.time.length > 0 && (time < newestTime || (time === newestTime && leaf.valueStr === newestValue))) {
                    continue;
                }
                // YAMCS values have no SCLK
                appendPoint(data, time, NaN, leaf.valueStr, leaf.valueNum);
                this.yamcsDebouncer.fire(key);
            }
        }
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
        this.yamcsSubscription?.dispose();
        this.yamcsDebouncer.dispose();
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
                    messenger.postMessage({
                        type: "latest",
                        channels: this.latest(this.db.series.keys())
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

        // YAMCS rows have no Telemetry points to append, so we send the newest point of each channel
        // that changed, and the table merges those rows in
        const yamcsDisp = this.db.onNewYamcsData((keys) => {
            messenger.postMessage({
                type: 'update',
                channels: this.latest(keys)
            });
        });

        webviewView.onDidDispose(() => {
            messenger.dispose();
            disp.dispose();
            yamcsDisp.dispose();
        });
    }

    // The newest point of each channel in keys, as the table shows it. The table asks for every
    // channel when it opens, and YAMCS updates ask for just the channels that changed.
    private latest(keys: Iterable<string>): Record<string, TelemetrySeries & TelemetrySeriesDataPoint> {
        const channels: Record<string, TelemetrySeries & TelemetrySeriesDataPoint> = {};
        for (const key of keys) {
            const series = this.db.series.get(key);
            const data = this.db.data.get(key);
            if (!series || !data || data.time.length < 1) {
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
        return channels;
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

                case 'timeWindow':
                    // Update time window and resend full data
                    this.timeWindow = msg.timeWindow;
                    this.sendFullData(messenger);
                    break;
                case 'snapshot': {
                    const uri = vscode.Uri.joinPath(
                        vscode.workspace.workspaceFolders?.[0].uri ?? vscode.Uri.file(tmpdir),
                        "telemetry-plot-" + (new Date()).toISOString() + ".png"
                    );

                    vscode.workspace.fs.writeFile(
                        uri,
                        Buffer.from(msg.pngData, "base64")
                    ).then(() => {
                        vscode.window.showInformationMessage("Captured telemetry plot screenshot", "Open").then((v) => {
                            if (v === "Open") {
                                vscode.commands.executeCommand("vscode.open", uri);
                            }
                        });
                    });
                }
            }
        }, webviewView.webview);

        // Listen for table state changes and resend full data
        const tableStateDisp = this.db.onTableStateChanged(() => {
            this.sendFullData(messenger);
        });

        // Forward batched updates to frontend (only for selected channels)
        const appendLatest = (keys: Iterable<string>) => {
            const selectedChannels = new Set(this.db.tableState.channels);
            if (selectedChannels.size === 0) {
                return; // No channels selected, don't send anything
            }

            // Filter telemetry to only selected channels
            const filteredData: Record<string, TelemetrySeriesData> = {};

            for (const key of keys) {
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
        };

        // Both kinds of update append each changed channel's newest point. F Prime updates carry
        // Telemetry points, so we turn them into channel keys first. YAMCS updates already carry keys.
        const telemetryDisp = this.db.onNewTelemetryData((points) => {
            appendLatest(points.map((telem) => `${telem.source}.${telem.def.component}.${telem.def.name}`));
        });
        const yamcsDisp = this.db.onNewYamcsData(appendLatest);

        webviewView.onDidDispose(() => {
            messenger.dispose();
            tableStateDisp.dispose();
            telemetryDisp.dispose();
            yamcsDisp.dispose();
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

            fullInfo[channelKey] = series;
            fullData[channelKey] = cutoffTime > 0
                ? cullTelemetrySeriesData(data, cutoffTime)
                : data;
        }

        messenger.postMessage({
            type: 'full',
            data: fullData,
            info: fullInfo,
        });
    }
}
