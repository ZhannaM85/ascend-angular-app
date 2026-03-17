const { createCjsPreset } = require('jest-preset-angular/presets');

module.exports = {
    ...createCjsPreset(),
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts']
};

