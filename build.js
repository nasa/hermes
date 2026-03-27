#!/usr/bin/env node

const path = require('path');
const fs = require('fs/promises');
const esbuild = require("esbuild");
const { sassPlugin } = require('esbuild-sass-plugin');
const cssModulesPlugin = require('esbuild-css-modules-plugin');;
const { style } = require("@hyrious/esbuild-plugin-style");

if (process.argv.length < 3) {
    throw new Error("Expecting an argument");
}

const buildTarget = process.argv[2];

/**
 * @type {import('esbuild').Plugin}
 */
const esbuildProblemMatcherPlugin = {
    name: 'esbuild-problem-matcher',
    setup(build) {
        build.onStart(() => {
            if (buildTarget === 'watch') {
                console.log('[watch] build started %s', build.initialOptions.outfile);
            }
        });

        build.onEnd(result => {
            if (result.errors.length) {
                result.errors.forEach(error =>
                    console.error(
                        `> ${error.location.file}:${error.location.line}:${error.location.column}: error: ${error.text}`
                    )
                );
            } else {
                if (buildTarget === 'watch') {
                    console.log('[watch] build finished %s', build.initialOptions.outfile);
                }
            }
        });
    }
};

function executePermissionsPlugins(copyToOut) {
    return {
        name: 'chmod +x',
        setup(build) {
            build.onEnd(async () => {
                await fs.chmod(build.initialOptions.outfile, 0o775);

                if (copyToOut) {
                    await fs.mkdir('out', { recursive: true });
                    console.log(`[bin] cp ${build.initialOptions.outfile} out/${path.basename(build.initialOptions.outfile)}`);
                    await fs.copyFile(build.initialOptions.outfile, path.join('out', path.basename(build.initialOptions.outfile)));
                }
            });

        },
    }
}

function commonOptions() {
    /**
     * @type {esbuild.BuildOptions}
     */
    const options = {
        bundle: true,
        logLevel: 'info',
        plugins: [esbuildProblemMatcherPlugin]
    };

    if (buildTarget === 'watch') {
        return {
            ...options,
            minify: false,
            sourcemap: "inline",
        };
    } else {
        return {
            ...options,
            minify: true
        };
    }
}

function nodeBaseOptions() {
    /**
     * @type {esbuild.BuildOptions}
     */
    return {
        ...commonOptions(),
        platform: 'node',
        target: "es2022",
        format: 'cjs',
        loader: {
            '.xml': 'text',
            '.proto': 'text',
            '.rsf': 'json'
        }
    };
}

function extensionOptions() {
    return {
        ...nodeBaseOptions(),
        external: ['vscode']
    }
}

function browserOptions() {
    return {
        ...commonOptions(),
        platform: 'browser',
        format: 'esm',
        loader: {
            '.png': 'dataurl',
            '.fbx': 'dataurl',
            '.ttf': 'file',
            '.woff': 'file',
            '.svg': 'file',
            '.jpg': 'file',
            '.css': 'local-css'
        },
        plugins: [
            sassPlugin(),
            cssModulesPlugin(),
            esbuildProblemMatcherPlugin
        ],
        external: [
            'url',
            'crypto',
            'stream',
            'os',
            'http',
            'https',
            'zlib',
            'net',
            'tls',
            'fs',
            'assert',
            'util',
            'child_process'
        ],
        alias: {
            'path': './src/fallback/path',
        }
    };
}

function cliOptions(copyToOut) {
    const options = {
        ...nodeBaseOptions(),
        plugins: [esbuildProblemMatcherPlugin, executePermissionsPlugins(copyToOut)],
        banner: {
            js: '#!/usr/bin/env node'
        },
    };

    if (buildTarget === 'watch') {
        // Enable debugging flags
        return { ...options, sourcemap: "linked" };
    } else {
        return options;
    }
}

function extension() {
    /**
     * @type {esbuild.BuildOptions}
     */
    return {
        'extension': {
            ...extensionOptions(),
            outfile: 'out/extension.js',
            entryPoints: ['src/extension.ts']
        }
    };
}


const builds = {
    'src/internal': {
        'leap-seconds': { ...cliOptions(), outfile: 'out/leap-seconds', entryPoints: ['leap-seconds.ts'] },
    },

    'src/scripts': {
        'tcp-relay': { ...cliOptions(true), outfile: 'out/tcp-relay', entryPoints: ['tcp-relay.ts'] },
        'fprime-xml-dictionary': { ...cliOptions(true), outfile: 'out/fprime-xml-dictionary', entryPoints: ['fprime-xml-dictionary.ts'] },
        'fprime-json-dictionary': { ...cliOptions(true), outfile: 'out/fprime-json-dictionary', entryPoints: ['fprime-json-dictionary.ts'] },
        'dictionary-to-protocol': { ...cliOptions(true), outfile: 'out/dictionary-to-protocol', entryPoints: ['dictionary-to-protocol.ts'] },
    },

    'src/extensions/core': {
        'evrs': {
            ...browserOptions(),
            plugins: [
                sassPlugin(),
                cssModulesPlugin(),
                esbuildProblemMatcherPlugin,
                {
                    name: "VSCode Codicons",
                    setup(build) {
                        build.onStart(async () => {
                            // Grab the codicon.css build
                            const codiconsDist = path.dirname(require.resolve('@vscode/codicons/dist/codicon.css'));
                            const outPath = path.join(__dirname, path.dirname(build.initialOptions.outfile));

                            await fs.mkdir(outPath, { recursive: true });
                            await fs.copyFile(path.join(codiconsDist, "codicon.css"), path.join(outPath, 'codicon.css'));
                            await fs.copyFile(path.join(codiconsDist, "codicon.ttf"), path.join(outPath, 'codicon.ttf'));
                        });
                    },
                }
            ],
            outfile: 'out/evrs.js',
            entryPoints: ['app/evrs/index.tsx']
        },

        'telemetry-table': {
            ...browserOptions(),
            outfile: 'out/telemetry-table.js',
            entryPoints: ['app/telemetry/table.tsx']
        },

        'telemetry-plot': {
            ...browserOptions(),
            outfile: 'out/telemetry-plot.js',
            entryPoints: ['app/telemetry/plot.tsx']
        },

        'connections': {
            ...browserOptions(),
            outfile: 'out/connections.js',
            entryPoints: ['app/connections/index.tsx']
        },

        'evr-renderer': {
            ...browserOptions(), plugins: [
                style(),
                esbuildProblemMatcherPlugin
            ], outfile: 'out/evr-renderer.js', entryPoints: ['renderer/index.tsx']
        },

        ...extension()
    },

    'src/extensions/fprime': extension(),
    'src/extensions/yamcs': extension(),
};

class Waiter {
    constructor() { this.promises = []; this.waitLoop(); }
    wait() {
        return new Promise((resolve) => {
            this.promises.push(resolve);
        });
    }
    waitLoop() { this.timeout = setTimeout(() => this.waitLoop(), 100 * 1000); }
    quit() { this.promises.map(v => v()); this.promises = []; clearTimeout(this.timeout); }
}

const waiter = new Waiter();

process.on("SIGINT", () => waiter.quit());
process.on("SIGTERM", () => waiter.quit());

async function main() {
    // Remap the target relative paths to workspace relative paths
    for (const [basePath, targets] of Object.entries(builds)) {
        for (const [name, target] of Object.entries(targets)) {
            target.entryPoints = [...target.entryPoints];
            for (let i = 0; i < target.entryPoints.length; i++) {
                target.entryPoints[i] = path.join(basePath, target.entryPoints[i]);
            }

            target.define = {
                ...target.define,
                HERMES_BUILD_DEBUG: `${!target.minify}`
            };
            target.outfile = path.join(basePath, target.outfile);
        }
    }

    if (buildTarget === 'watch') {
        for (const [_, targets] of Object.entries(builds)) {
            for (const [_, target] of Object.entries(targets)) {
                (await esbuild.context(target)).watch();
            }
        }

        await waiter.wait();
    } else if (buildTarget === 'build') {
        const building = [];
        for (const [_, targets] of Object.entries(builds)) {
            for (const [_, target] of Object.entries(targets)) {
                building.push(esbuild.build(target));
            }
        }

        await Promise.all(building).catch(() => process.exit(1));
    } else {
        const building = [];
        for (const [_, target] of Object.entries(builds[buildTarget])) {
            building.push(esbuild.build(target));
        }

        await Promise.all(building).catch(() => process.exit(1));
    }
}

let returnCode = 0;
main()
    .catch((err) => {
        console.error(err);
        returnCode = 1;
    })
    .finally(() => {
        waiter.quit();
        process.exit(returnCode);
    });
