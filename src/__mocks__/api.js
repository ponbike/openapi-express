import openAPISpecification from '../__fixtures__/api-doc.json'
import controllers from './controller.js'
import buildOpenapiExpress from '../openapi-express.js'

let app
try {
  app = buildOpenapiExpress({
    name: 'test',
    version: '1.2.3',
    apis: [
      {
        version: 'v1',
        specification: openAPISpecification,
        controllers,
        secret: 'secret'
      }
    ]
  })
} catch (error) {
  console.error(error.message)
}

export default app
