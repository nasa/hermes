// const { jsWithTs: tsjPreset } = require('ts-jest/presets')
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testPathIgnorePatterns: [
        "/node_modules/",
        "/out/",
        "/grafana-datasource-plugin/",
    ],
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "/out/",
        "/grafana-datasource-plugin/",
        "<rootDir>/fallback/*",
    ],
    transform: {
        "^.+\\.xml$": "jest-text-transformer"
    },
    moduleNameMapper: {
        "^vscode$": "<rootDir>/src/fallback/vscode",
    },
    detectOpenHandles: true,
    // detectLeaks: true,
    logHeapUsage: true
};