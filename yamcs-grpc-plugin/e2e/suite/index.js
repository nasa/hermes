// Runs inside a real VS Code extension host with the Hermes extension under development.
const vscode = require('vscode');
const fs = require('fs');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitFor(what, get, timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    for (; ;) {
        const value = get();
        if (value) {
            return value;
        }
        if (Date.now() > deadline) {
            throw new Error(`timed out waiting for ${what}`);
        }
        await sleep(100);
    }
}

exports.run = async function () {
    const resultFile = process.env.E2E_RESULT_FILE;
    const result = { steps: [] };
    const step = (s) => { result.steps.push(s); fs.writeFileSync(resultFile, JSON.stringify(result, null, 2)); };
    const state = {
        address: process.env.YAMCS_GRPC_ADDRESS,
        instance: process.env.YAMCS_INSTANCE,
        processor: 'realtime',
    };

    try {
        const core = await vscode.extensions.getExtension('jet-propulsion-laboratory.hermes').activate();
        // The database behind the telemetry table and plot
        const db = core.telemetryDb;
        const key = (suffix) => [...db.data.keys()].find((k) => k.endsWith(suffix));
        const latest = (k) => {
            const data = db.get(k);
            const i = data.time.length - 1;
            return { key: k, valueStr: data.valueStr[i], valueNum: data.valueNum[i], time: new Date(data.time[i]).toISOString(), points: data.time.length };
        };
        step('extension activated');

        // Count the rows the table panel formats for its 'update' messages
        const updates = [];
        const table = core.telemetryTablePanel;
        const tableLatest = table.latest.bind(table);
        table.latest = (keys) => {
            const rows = tableLatest(keys);
            if (keys instanceof Set && Object.keys(rows).length > 0) {
                updates.push(rows);
            }
            return rows;
        };

        await vscode.commands.executeCommand('hermes.host.set', 'yamcs', state);
        const subscribed = Date.now();
        step(`backend set to ${core.api.currentProvider.type}, status bar "${core.api.secondaryItem.text}" (${core.api.secondaryItem.tooltip})`);

        const versionKey = await waitFor('FrameworkVersion', () => key('/version/FrameworkVersion'), 5000);
        result.frameworkVersionAfterMs = Date.now() - subscribed;
        const cpuKey = await waitFor('CPU', () => key('/systemResources/CPU'), 10000);
        await waitFor('3 CPU points', () => db.get(cpuKey).time.length >= 3, 15000);
        const apidKey = await waitFor('APID', () => key('/CCSDS_Packet_ID.APID'), 10000);
        const depthKey = await waitFor('comQueueDepth[1]', () => key('/comQueue/comQueueDepth[1]'), 10000);
        const flagsKey = await waitFor('GroupFlags', () => key('/CCSDS_Packet_Sequence.GroupFlags'), 10000);
        result.channels = db.series.size;
        result.rows = [versionKey, cpuKey, apidKey, depthKey, flagsKey].map(latest);
        step('YAMCS rows in the telemetry database');

        await vscode.commands.executeCommand('hermes.telemetryTable.focus');
        await waitFor('a table update', () => updates.length > 0, 10000);
        await sleep(2000);
        result.tableUpdates = updates.length;
        result.tableUpdateSample = updates[updates.length - 1][apidKey] ?? Object.values(updates[updates.length - 1])[0];
        step('table panel sent update rows');

        // Switching away detaches the subscription and switching back reattaches it
        await vscode.commands.executeCommand('hermes.host.set', 'offline', true);
        const offlinePoints = db.get(cpuKey).time.length;
        await sleep(3000);
        result.cpuPointsWhileOffline = db.get(cpuKey).time.length - offlinePoints;
        await vscode.commands.executeCommand('hermes.host.set', 'yamcs', state);
        await waitFor('CPU points after switching back', () => db.get(cpuKey).time.length >= offlinePoints + 2, 10000);
        result.cpuPointsAfterSwitchingBack = db.get(cpuKey).time.length - offlinePoints;
        result.frameworkVersionPoints = db.get(versionKey).time.length;
        step('offline and back');

        const hold = Number(process.env.E2E_HOLD_MS || 0);
        if (hold > 0) {
            await vscode.commands.executeCommand('hermes.telemetryTable.focus');
            step(`holding ${hold} ms`);
            await sleep(hold);
        }

        // A subscription YAMCS rejects after connecting puts the status bar in its error state
        await vscode.commands.executeCommand('hermes.host.set', 'yamcs', { ...state, processor: 'no-such-processor' });
        await waitFor('error status', () => core.api.primaryItem.backgroundColor?.id === 'statusBarItem.errorBackground', 10000);
        result.errorStatus = { text: core.api.secondaryItem.text, tooltip: core.api.secondaryItem.tooltip };
        step('subscription error shown');

        if (result.cpuPointsWhileOffline !== 0 || result.frameworkVersionPoints !== 1) {
            throw new Error('unexpected points while offline or after switching back');
        }
        step('done');
    } catch (err) {
        result.error = String(err && err.stack || err);
        fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
        throw err;
    }
};
