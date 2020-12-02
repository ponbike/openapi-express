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
import { Validator } from '@hckrnews/validator'
import API from './entities/api.js'
import apiSchema from './api-schema.js'

const logger = stackdriver()
const apiValidator = new Validator(apiSchema)

/**
 * Build the Open API Express server.
 *
 * @param {string} name
 * @param {string} version
 * @param {array} apis
 * @param {array} poweredBy
 * @param {string} staticFolder
 *
 * @return {object}
 */
const buildOpenapiExpress = ({ name, version, apis, poweredBy = 'Pon.Bike', staticFolder = null }) => {
  if (!apiValidator.validate({ name, version, apis, poweredBy, staticFolder })) {
    throw new Error('invalid api details, field ' + apiValidator.errors[0][0] + ' should be a ' + apiValidator.errors[0][1])
  }
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

  if (staticFolder) {
    app.use(express.static(staticFolder))
  }

  app.use(function (request, response, next) {
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
 *
 * @return {object}
 */
const makeApi = (api) => {
  const { specification, controllers, secret } = API.create(api)
  const router = express.Router()
  router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specification))
  router.get('/api-docs', (request, response) =>
    response.json(specification)
  )

  router.use((request, response) =>
    ApiRoutes.create({
      specification,
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

export default buildOpenapiExpress
export {
  buildOpenapiExpress,
  makeApi,
  API
}
