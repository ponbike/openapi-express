module.exports = {
  moduleFileExtensions: ['js', 'cjs', 'mjs', 'jsx', 'json'],

  transform: {
    '^.+\\.js?$': 'babel-jest',
    '^.+\\.mjs?$': 'babel-jest'
  },

  transformIgnorePatterns: ['node_modules/(?!(@hckrnews|@ponbike)/)'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },

  testMatch: ['**/__tests__/*.js'],

  testURL: 'http://localhost/',

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js', 'src/**/*.cjs', 'src/**/*.mjs'],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 100,
      lines: 95,
      statements: 95
    }
  },
  reporters: [
    'default',
    [ 'jest-junit', {
      outputDirectory: 'test-reports',
      outputName: 'jest-junit.xml',
    } ]
  ],

  testResultsProcessor: 'jest-sonar-reporter'
}
