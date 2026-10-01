// Launches a test copy of VS Code with the Hermes extension under development and runs suite/index.js in it.
// Expects a YAMCS server with this plugin, and `node build build` done.
const path = require('path');

const hermesDir = process.env.HERMES_DIR || path.resolve(__dirname, '..', '..');
const { runTests } = require(path.join(hermesDir, 'node_modules', '@vscode', 'test-electron'));

async function main() {
    const e2e = __dirname;
    await runTests({
        version: '1.138.0',
        cachePath: process.env.VSCODE_TEST_CACHE || path.join(e2e, '.vscode-test'),
        extensionDevelopmentPath: path.join(hermesDir, 'src', 'extensions', 'core'),
        extensionTestsPath: path.join(e2e, 'suite', 'index.js'),
        launchArgs: [
            '--disable-extensions',
            '--user-data-dir', path.join(e2e, 'user-data'),
            '--extensions-dir', path.join(e2e, 'extensions'),
            '--new-window',
        ],
        extensionTestsEnv: {
            E2E_RESULT_FILE: path.join(e2e, 'result.json'),
            YAMCS_GRPC_ADDRESS: process.env.YAMCS_GRPC_ADDRESS || 'localhost:8091',
            YAMCS_INSTANCE: process.env.YAMCS_INSTANCE || 'fprime-project',
        },
    });
}

main().then(() => console.log('e2e passed, see e2e/result.json'), (err) => {
    console.error('e2e failed:', err);
    process.exit(1);
});
