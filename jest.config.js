/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    verbose: true,
    preset: 'ts-jest',
    testEnvironment: "<rootDir>/jsdom-extended.js",
    // Next Line(s) is important! https://github.com/mswjs/msw/issues/1786#issuecomment-1782559851
    testEnvironmentOptions: {
        customExportConditions: [''],
    },
}
