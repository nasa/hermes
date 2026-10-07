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

        // YAMCS mode runs fine without dictionaries, but like Offline mode it loads any saved in workspace
        // storage, so features such as picking the dictionary a file is written against keep working. The
        // extension starts in Offline mode, so we save a throwaway dictionary there, check that YAMCS mode
        // lists it, and remove it.
        await waitFor('Offline backend', () => core.api.currentApi, 5000);
        const dictionaryId = await core.api.addDictionary({ head: { name: 'e2e', version: '1', type: 'e2e' } });

        // The table's messenger is a local in resolveWebviewView, so we wrap the panel's private latest(), which builds
        // the rows for its 'latest' and 'update' messages. Only 'update' passes it a Set, so we keep those rows
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
        step(`backend set to ${core.api.currentProvider.type}, status bar "${core.api.secondaryItem.text}" (${core.api.secondaryItem.tooltip})`);
        result.dictionaryLoaded = dictionaryId in await core.api.allDictionaries();
        await core.api.removeDictionary(dictionaryId);
        if (!result.dictionaryLoaded) {
            throw new Error('the workspace dictionary did not load in YAMCS mode');
        }

        const versionKey = await waitFor('FrameworkVersion', () => key('/version/FrameworkVersion'), 5000);
        const cpuKey = await waitFor('CPU', () => key('/systemResources/CPU'), 10000);
        await waitFor('3 CPU points', () => db.get(cpuKey).time.length >= 3, 15000);
        result.rows = [versionKey, cpuKey].map(latest);
        step('YAMCS rows in the telemetry database');

        await vscode.commands.executeCommand('hermes.telemetryTable.focus');
        await waitFor('a table update', () => updates.length > 0, 10000);
        result.tableUpdateSample = Object.values(updates[updates.length - 1])[0];
        step('table panel sent update rows');

        // Switching to Offline mode should close the YAMCS backend's parameter subscription, so no CPU points arrive,
        // and switching back should open a new one
        await vscode.commands.executeCommand('hermes.host.set', 'offline');
        const offlinePoints = db.get(cpuKey).time.length;
        await sleep(3000);
        result.cpuPointsWhileOffline = db.get(cpuKey).time.length - offlinePoints;
        await vscode.commands.executeCommand('hermes.host.set', 'yamcs', state);
        // The first point back can be the cached value YAMCS sends when we subscribe, so wait for a live one too
        await waitFor('CPU points after switching back', () => db.get(cpuKey).time.length >= offlinePoints + 2, 10000);
        result.cpuPointsAfterSwitchingBack = db.get(cpuKey).time.length - offlinePoints;
        // FrameworkVersion is only sent at boot, so the database should drop the copy YAMCS resends when we resubscribe
        result.frameworkVersionPoints = db.get(versionKey).time.length;
        if (result.cpuPointsWhileOffline !== 0 || result.frameworkVersionPoints !== 1) {
            throw new Error('unexpected points while offline or after switching back');
        }
        step('offline and back');

        // E2E_HOLD_MS keeps the window open that many milliseconds, to look at the table
        const hold = Number(process.env.E2E_HOLD_MS || 0);
        if (hold > 0) {
            await vscode.commands.executeCommand('hermes.telemetryTable.focus');
            step(`holding ${hold} ms`);
            await sleep(hold);
        }

        // Connecting only lists the instance's parameters and never uses the processor. So with an unknown processor
        // we connect fine and the subscription fails, which should put the status bar in its error state
        await vscode.commands.executeCommand('hermes.host.set', 'yamcs', { ...state, processor: 'no-such-processor' });
        await waitFor('error status', () => core.api.primaryItem.backgroundColor?.id === 'statusBarItem.errorBackground', 10000);
        result.errorStatus = { text: core.api.secondaryItem.text, tooltip: core.api.secondaryItem.tooltip };
        step('subscription error shown');
        step('done');
    } catch (err) {
        result.error = String(err && err.stack || err);
        fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
        throw err;
    }
};
