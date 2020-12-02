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
      version: '1.2.3',
      timestamp: new Date(),
      message: 'ok'
    }
  }),
  postTest: async () => ({
    statusCode: 200,
    body: {
      status: true,
      version: '1.2.3',
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
  })
})
