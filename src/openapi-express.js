import express from 'express'
import swaggerUi from 'swagger-ui-express'
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import makeLogger from '@ponbike/logger'
import { ApiRoutes } from '@ponbike/openapi-routes'
import { OpenAPIBackend } from 'openapi-backend'
import { makeExpressCallback } from '@hckrnews/express-callback'
import { Validator } from '@hckrnews/validator'
import dotenv from 'dotenv'
import { ServerError } from '@hckrnews/error'
import API from './entities/api.js'
import apiSchema from './api-schema.js'

dotenv.config()
// @todo: no env vars?
const defaultLoggerOptions = {
  level: process.env.LOGLEVEL || process.env.LOG_LEVEL || 'info',
  loggers: [
    {
      type: 'console'
    }
  ]
}
const logger = makeLogger(defaultLoggerOptions)
const apiValidator = new Validator(apiSchema)

/**
 * @typedef {import('./api-schema.js').Api} ApiType
 */

/**
 * @callback handleRouteCallback
 * @param request
 * @param response
 * @param next
 */

/**
 * The route object additional routes that can be added outside the spec
 * @typedef {Object} Route
 * @property {string} route the endpoint to add
 * @property {handleRouteCallback} handler the handler function
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
 * @param {Route[]} data.routes
 * @param {string} data.limit
 * @param {object} data.loggerOptions
 * @param {string} data.origin
 * @param {class} data.errorLogger
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
  origin = '*',
  routes = [],
  errorLogger = null
}) => {
  if (!apiValidator.validate({ name, version, apis, poweredBy, staticFolder })) {
    throw new ServerError({
      message: `invalid api details, field ${apiValidator.errors[0][0]} should be a ${apiValidator.errors[0][1]}`,
      value: apiValidator.errors
    })
  }

  const app = express()
  const apiLogger = makeLogger(loggerOptions)

  const corsOptions = {
    origin
  }
  app.set('name', name)
  app.set('version', version)
  app.use(cors(corsOptions))
  app.use(compression())
  app.use(helmet(getOriginResourcePolicy(origin)))
  app.use(express.json({ limit }))
  app.use((_request, response, next) => {
    response.setHeader('X-Powered-By', poweredBy)
    response.setHeader('X-Version', version)
    next()
  })
  app.set('logger', apiLogger)

  apis.forEach((api) => {
    const apiRoutes = makeApi(api, apiLogger, errorLogger)
    app.use(`/${api.version}`, apiRoutes)
  })

  routes.forEach(({ route, handler }) => {
    app.use(route, handler)
  })

  if (staticFolder) {
    app.use(express.static(staticFolder))
  }

  app.use((_request, response, _next) => {
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
 * @param {class} errorLogger
 *
 * @return {object}
 */
const makeApi = (api, apiLogger, errorLogger) => {
  const {
    specification,
    controllers,
    secret,
    requestValidation,
    responseValidation
  } = API.create(api)
  const router = express.Router()
  router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specification))
  router.get('/api-docs', (_request, response) => response.json(specification))

  const { api: apiRoutes } = ApiRoutes.create({
    specification,
    secret,
    Backend: OpenAPIBackend,
    logger: apiLogger,
    errorLogger,
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
  apiSchema,
  getOriginResourcePolicy
}
