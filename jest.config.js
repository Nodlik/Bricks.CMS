module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    automock: false,
    setupFiles: ['./test/setupJest.ts'],
    moduleNameMapper: {
        '^@server(.*)$': '<rootDir>/apps/server/src$1',
    },
};
