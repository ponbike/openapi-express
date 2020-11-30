import express from 'express'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import expressPino from 'express-pino-logger'
import stackdriver from './pino-logger-stackdriver.js'
import { ApiRoutes } from '@hckrnews/openapi-routes'
import { OpenAPIBackend } from 'openapi-backend'
import { makeExpressCallback } from '@hckrnews/express-callback'

const logger = stackdriver()

/**
 * Build the Open API Express server.
 *
 * @param {string} name
 * @param {string} version
 * @param {array} apis
 * @param {array} poweredBy
 *
 * @return {object}
 */
export default function buildOpenapiExpress ({ name, version, apis, poweredBy = 'Pon.Bike' }) {
  const app = express()

  app.set('name', name)
  app.use(cors())
  app.use(compression())
  app.use(helmet())
  app.use(express.json())
  app.use((request, response, next) => {
    response.setHeader('X-Powered-By', poweredBy)
    response.setHeader('X-Version', version)
    next()
  })
  app.use(expressPino({ logger }))
  app.set('logger', logger)

  apis.forEach((api) => {
    app.use('/' + api.version, makeApi(api))
  })

  return app
}

/**
 * Connect the openapi spec to the controllers.
 *
 * @param {object} specification
 * @param {object} controllers
 * @param {string} secret
 *
 * @return {object}
 */
const makeApi = ({ specification, controllers, secret }) => {
  const router = express.Router()
  router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specification))
  router.get('/api-docs', (request, response) =>
    response.json(specification)
  )

  router.use((request, response) =>
    ApiRoutes.create({
      specification: specification,
      secret,
      Backend: OpenAPIBackend,
      logger,
      controllers,
      callback: makeExpressCallback,
      root: '/'
    }).handleRequest(
      request,
      request,
      response
    )
  )

  return router
}
