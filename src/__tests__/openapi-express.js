import buildOpenapiExpress from '../openapi-express.js'

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
})
