module.exports = {
    moduleFileExtensions: ["ts"],
    preset: 'ts-jest',
    setupFiles: ['dotenv/config'],
    testEnvironment: 'node',
    testMatch: [
        "**/*.spec.ts",
        "**/*.test.ts",
    ],
}
