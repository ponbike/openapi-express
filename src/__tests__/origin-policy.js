import { expect, describe, it } from '@jest/globals'
import { getOriginResourcePolicy } from '../openapi-express.js'

describe('Get origin policy test', () => {
  it('It should return cross-origin if the value is *', async () => {
    const result = getOriginResourcePolicy('*')
    expect(result).toEqual({
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
  })

  it('It should return same-origin if the value isnt *', async () => {
    const result = getOriginResourcePolicy('https://localhost')
    expect(result).toEqual({
      crossOriginResourcePolicy: {
        policy: 'same-origin'
      }
    })
  })
})
