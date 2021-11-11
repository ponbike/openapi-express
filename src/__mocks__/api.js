import openAPISpecification from '../__fixtures__/api-doc.json'
import controllers from './controller.js'
import { buildOpenapiExpress, API } from '../openapi-express.js'

const api = buildOpenapiExpress({
  name: 'test',
  version: '1.2.3',
  apis: [
    API.create({
      version: 'v1',
      specification: openAPISpecification,
      controllers,
      secret: 'secret'
    })
  ],
  staticFolder: 'src/__fixtures__',
  limit: '1mb'
})

export default api
