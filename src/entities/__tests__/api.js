import API from '../api.js'

const TestCases = [
  {
    description: 'It should throw an error if the version isnt valid',
    config: { version: null, specification: null, controllers: null, secret: null },
    expectedError: 'Invalid OpenAPI version'
  },
  {
    description: 'It should throw an error if the version isnt valid',
    config: { version: 'v1', specification: null, controllers: null, secret: null },
    expectedError: 'Invalid OpenAPI specification'
  },
  {
    description: 'It should throw an error if the version isnt valid',
    config: { version: 'v1', specification: {}, controllers: null, secret: null },
    expectedError: 'Invalid OpenAPI controllers'
  },
  {
    description: 'It should throw an error if the version isnt valid',
    config: { version: 'v1', specification: {}, controllers: {}, secret: 42 },
    expectedError: 'Invalid OpenAPI secret'
  }
]

describe.each(TestCases)(
  'API entity',
  ({ description, config, expectedError }) => {
    it(description, async () => {
      expect(() => {
        API.create(config)
      }).toThrow(new Error(expectedError))
    })
  }
)
