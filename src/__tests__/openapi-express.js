/* eslint no-underscore-dangle: ["error", { "allow": ["_router"] }] */
import { expect, describe, it } from '@jest/globals'
import { buildOpenapiExpress } from '../openapi-express.js'

describe('OpenAPI Express build test', () => {
  it('It should generate the api and contain the name', async () => {
    const api = buildOpenapiExpress({ name: 'test', version: 'v1', apis: [] })
    expect(api.get('name')).toBe('test')
  })

  it('It should throw an error if the static folder isnt a valid value', async () => {
    expect(() => {
      buildOpenapiExpress({ name: 'test', version: 'v1', apis: [], staticFolder: 42 })
    }).toThrowError('invalid api details, field ?staticFolder should be a string')
  })

  it('It should throw an error if the name isnt a valid string', () => {
    expect(() => {
      buildOpenapiExpress({ name: 42, version: 'v1', apis: [], staticFolder: 'public' })
    }).toThrowError('invalid api details, field name should be a string')
  })

  it('It should add additional routes', async () => {
    const api = buildOpenapiExpress({ name: 'test', version: 'v1', apis: [], routes: [{ route: '/test', handler: () => { } }] })
    expect(api.get('name')).toBe('test')
    const route = api._router.stack.find(layer => layer.name === 'handler')
    expect(route?.name).toBe('handler')
  })
})
