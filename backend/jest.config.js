const path = require('path')

module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: [ path.join(__dirname, 'src/__tests__/jest.setup.js')],
  setupFiles: ["jest-date-mock"],
  globalSetup: './src/__tests__/setup.ts',
  globalTeardown: './src/__tests__/teardown.ts'

}

