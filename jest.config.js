/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 30000,
  bail: 1,
  forceExit: true,
  clearMocks: true,
   globalTeardown: '<rootDir>/tests/teardown.js',
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
};