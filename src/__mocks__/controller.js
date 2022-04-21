import { ServerError } from '@hckrnews/error'

const generateContent = (size) => Array(size).fill().map(_ => String.fromCharCode(33 + Math.random() * (127 - 33))).join('')

export default ({
  getStatus: async () => ({
    statusCode: 200,
    body: {
      status: true,
      version: '1.2.3',
      timestamp: new Date(),
      message: 'ok'
    }
  }),
  getTest: async () => ({
    statusCode: 200,
    body: {
      status: true,
      version: '1.2.4',
      timestamp: new Date(),
      message: 'ok',
      content: generateContent(2048)
    }
  }),
  postTest: async () => ({
    statusCode: 200,
    body: {
      status: true,
      version: '1.2.5',
      timestamp: new Date(),
      message: 'ok'
    }
  }),
  postTest2: async () => ({
    statusCode: 200,
    body: {
      status: true,
      version: '1.2.6',
      timestamp: new Date(),
      message: 'ok'
    }
  }),
  notFound: async () => ({
    statusCode: 404,
    body: {
      status: 404,
      timestamp: new Date(),
      message: 'Not found.'
    }
  }),
  getException: async () => {
    throw new ServerError({
      message: 'Test exception 9',
      value: {
        field: 'test',
        type: 'string',
        invalidData: 47,
        data: {
          test: 47
        }
      }
    })
  }
})
