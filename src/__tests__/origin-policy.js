import { expect, describe, it } from '@jest/globals'
import { getOriginPolicy } from '../openapi-express.js'

describe('Get origin policy test', () => {
  it('It should return cross-origin if the value is *', async () => {
    const result = getOriginPolicy('*')
    expect(result).toEqual({
      crossOriginResourcePolicy: {
        policy: 'cross-origin'
      }
    })
  })

  it('It should return same-origin if the value isnt *', async () => {
    const result = getOriginPolicy('https://localhost')
    expect(result).toEqual({
      crossOriginResourcePolicy: {
        policy: 'same-origin'
      }
    })
  })
})
