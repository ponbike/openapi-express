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
const defaultLoggerOptions = {
  level: process.env.LOGLEVEL || process.env.LOG_LEVEL || 'info'
}
const logger = stackdriver(defaultLoggerOptions)
const apiValidator = new Validator(apiSchema)

/**
 * @typedef {import('./api-schema.js').Api} ApiType
 */

/**
 * Build the Open API Express server.
 *
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.version
 * @param {ApiType[]} data.apis
 * @param {string} data.poweredBy
 * @param {string} data.staticFolder
 * @param {string} data.limit
 * @param {object} data.loggerOptions
 * @param {string} data.origin
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
  loggerOptions = defaultLoggerOptions,
  origin = '*'
}) => {
  if (!apiValidator.validate({ name, version, apis, poweredBy, staticFolder })) {
    throw new Error(`invalid api details, field ${apiValidator.errors[0][0]} should be a ${apiValidator.errors[0][1]}`)
  }

  const app = express()
  const apiLogger = stackdriver(loggerOptions)

  const corsOptions = {
    origin
  }
  app.set('name', name)
  app.set('version', version)
  app.use(cors(corsOptions))
  app.use(compression())
  app.use(helmet(getOriginResourcePolicy(origin)))
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
 * Get the origin resource policy
 *
 * @param {string} origin
 *
 * @return {{ crossOriginResourcePolicy: { policy: string } }}
 */
const getOriginResourcePolicy = (origin) => ({
  crossOriginResourcePolicy: {
    policy: origin === '*' ? 'cross-origin' : 'same-origin'
  }
})

/**
 * Connect the openapi spec to the controllers.
 *
 * @param {ApiType} api
 * @param {P.Logger} apiLogger
 *
 * @return {object}
 */
const makeApi = (api, apiLogger) => {
  const {
    specification,
    controllers,
    secret,
    requestValidation,
    responseValidation
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
  stackdriver,
  apiValidator,
  apiSchema,
  getOriginResourcePolicy
}
