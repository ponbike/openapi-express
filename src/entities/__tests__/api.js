import { expect, describe, it } from '@jest/globals'
import API from '../api.js'

const TestCases = [
  {
    description: 'It should throw an error if the version isnt valid',
    config: { version: null, specification: null, controllers: null, secret: null },
    expectedError: 'Invalid OpenAPI version'
  },
  {
    description: 'It should throw an error if the version isnt given',
    config: {},
    expectedError: 'Invalid OpenAPI version'
  },
  {
    description: 'It should throw an error if the specification isnt valid',
    config: { version: 'v1', specification: null, controllers: null, secret: null },
    expectedError: 'Invalid OpenAPI specification'
  },
  {
    description: 'It should throw an error if the specification isnt given',
    config: { version: 'v1' },
    expectedError: 'Invalid OpenAPI specification'
  },
  {
    description: 'It should throw an error if the controllers isnt valid',
    config: { version: 'v1', specification: {}, controllers: null, secret: null },
    expectedError: 'Invalid OpenAPI controllers'
  },
  {
    description: 'It should throw an error if the controllers isnt given',
    config: { version: 'v1', specification: {} },
    expectedError: 'Invalid OpenAPI controllers'
  },
  {
    description: 'It should throw an error if the secret isnt valid',
    config: { version: 'v1', specification: {}, controllers: {}, secret: 42 },
    expectedError: 'Invalid OpenAPI secret'
  },
  {
    description: 'It should throw an error if the requestValidation isnt valid',
    config: { version: 'v1', specification: {}, controllers: {}, requestValidation: 42 },
    expectedError: 'Invalid request validation'
  },
  {
    description: 'It should throw an error if the responseValidation isnt valid',
    config: { version: 'v1', specification: {}, controllers: {}, responseValidation: 42 },
    expectedError: 'Invalid response validation'
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
