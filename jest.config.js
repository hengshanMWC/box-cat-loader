module.exports = {
  coverageDirectory: "coverage",
  testEnvironment: "node",
  roots: [
    "<rootDir>/test/run"
  ],
  testRegex: 'test/run/(.+)\\.test\\.js$',
  moduleFileExtensions: ['js'],
}