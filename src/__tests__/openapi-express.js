import buildOpenapiExpress from '../openapi-express.js'

describe('OpenAPI Express build test', () => {
  it('It should generate the api and contain the name', async () => {
    const api = buildOpenapiExpress({ name: 'test', version: 'v1', apis: [] })
    expect(api.get('name')).toBe('test')
  })
})
