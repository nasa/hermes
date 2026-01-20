// const { jsWithTs: tsjPreset } = require('ts-jest/presets')
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: [
        "/node_modules/",
        "/out/",
    ],
    "coveragePathIgnorePatterns": [
        "/node_modules/",
        "/out/",
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