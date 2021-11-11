import express from 'express'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import expressPino from 'express-pino-logger'
import { logger as stackdriver } from '@ponbike/logger-stackdriver'
import { ApiRoutes } from '@ponbike/openapi-routes'
import { OpenAPIBackend } from 'openapi-backend'
import { makeExpressCallback } from '@hckrnews/express-callback'
import { Validator } from '@hckrnews/validator'
import dotenv from 'dotenv'
import API from './entities/api.js'
import apiSchema from './api-schema.js'

dotenv.config()
const logger = stackdriver()
const apiValidator = new Validator(apiSchema)

/**
 * Build the Open API Express server.
 *
 * @param {string} name
 * @param {string} version
 * @param {array} apis
 * @param {string} poweredBy
 * @param {string} staticFolder
 * @param {string} limit
 * @param {object} loggerOptions
 *
 * @return {object}
 */
const buildOpenapiExpress = ({
  name,
  version,
  apis,
  poweredBy = 'Pon.Bike',
  staticFolder = null,
  limit = '100mb',
  loggerOptions = {}
}) => {
  if (!apiValidator.validate({ name, version, apis, poweredBy, staticFolder })) {
    throw new Error(`invalid api details, field ${apiValidator.errors[0][0]} should be a ${apiValidator.errors[0][1]}`)
  }

  const app = express()
  const apiLogger = stackdriver(loggerOptions)

  app.set('name', name)
  app.set('version', version)
  app.use(cors())
  app.use(compression())
  app.use(helmet())
  app.use(express.json({ limit }))
  app.use((request, response, next) => {
    response.setHeader('X-Powered-By', poweredBy)
    response.setHeader('X-Version', version)
    next()
  })
  app.use(expressPino({ logger: apiLogger }))
  app.set('logger', apiLogger)

  apis.forEach((api) => {
    const apiRoutes = makeApi(api, apiLogger)
    app.use(`/${api.version}`, apiRoutes)
  })

  if (staticFolder) {
    app.use(express.static(staticFolder))
  }

  app.use((request, response, next) => {
    response.status(404).send({
      status: 404,
      timestamp: new Date(),
      message: 'Not found.'
    })
  })

  return app
}

/**
 * Connect the openapi spec to the controllers.
 *
 * @param {object} api
 * @param {P.Logger} apiLogger
 *
 * @return {object}
 */
const makeApi = (api, apiLogger) => {
  const {
    specification,
    controllers,
    secret,
    requestValidation = false,
    responseValidation = false
  } = API.create(api)
  const router = express.Router()
  router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specification))
  router.get('/api-docs', (request, response) => response.json(specification))

  const { api: apiRoutes } = ApiRoutes.create({
    specification,
    secret,
    Backend: OpenAPIBackend,
    logger: apiLogger,
    controllers,
    callback: makeExpressCallback,
    root: '/',
    responseValidation,
    requestValidation
  })

  router.use((request, response) => apiRoutes.handleRequest(
    request,
    request,
    response
  ))

  return router
}

export default buildOpenapiExpress
export {
  buildOpenapiExpress,
  makeApi,
  API,
  logger,
  apiValidator,
  apiSchema
}
