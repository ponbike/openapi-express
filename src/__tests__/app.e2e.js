import supertest from 'supertest'
import app from '../__mocks__/api.js'

process.env.SECRET = 'secret'
const request = supertest(app)

describe('Test the server', () => {
  it('It should return status 200 for the status page (/v1/status)', async (done) => {
    const response = await request.get('/v1/status')

    expect(response.status).toBe(200)
    expect(response.body.message).toEqual('ok')
    done()
  })

  it('It should return status 200 for the get test page (/v1/get-test/?)', async (done) => {
    const response = await request.get('/v1/get-test/42')
      .set('x-api-key', process.env.SECRET)

    expect(response.status).toBe(200)
    expect(response.body.message).toEqual('ok')
    expect(response.body.content.length).toEqual(2048)
    done()
  })

  it('It should return status 404 for a unknown page (/v1/xyz)', async (done) => {
    const response = await request.get('/v1/xyz')

    expect(response.status).toBe(404)
    expect(response.body.message).toEqual('Not found.')
    done()
  })

  it('It should return status 404 for a unknown page (/xyz)', async (done) => {
    const response = await request.get('/xyz')

    expect(response.status).toBe(404)
    expect(response.body.message).toEqual('Not found.')
    done()
  })

  it('It should return status 200 for the specification (/v1/api-docs)', async (done) => {
    const response = await request.get('/v1/api-docs')

    expect(response.status).toBe(200)
    done()
  })

  it('It should return status 200 for the static json file (/api-doc.json)', async (done) => {
    const response = await request.get('/api-doc.json')

    expect(response.status).toBe(200)
    done()
  })
})
