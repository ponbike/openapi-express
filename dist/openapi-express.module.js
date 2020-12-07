import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import expressPino from 'express-pino-logger';
import pino from 'pino';
import { ApiRoutes } from '@hckrnews/openapi-routes';
import { OpenAPIBackend } from 'openapi-backend';
import { makeExpressCallback } from '@hckrnews/express-callback';
import { Validator } from '@hckrnews/validator';

/*
    Pino Stackdriver logger

    The Pino Logger, but with a format that stackdriver understands

    This will be a package, source code:
    https://bitbucket.org/ponbikedmp/node-logger-stackdriver/src/main/
 */
const PINO_DEFAULT_LEVEL = 'info';
const PinoLevelToSeverity = {
  trace: 'DEBUG',
  debug: 'DEBUG',
  info: 'INFO',
  warn: 'WARNING',
  error: 'ERROR',
  fatal: 'CRITICAL'
};
const defaultPinoConf = {
  messageKey: 'message',
  formatters: {
    level(label, number) {
      return {
        severity: PinoLevelToSeverity[label] || PinoLevelToSeverity[PINO_DEFAULT_LEVEL],
        level: number
      };
    },

    log(message) {
      return {
        message
      };
    }

  }
};
/**
 * Returns a new Pino Logger instance with stackdriver ready logs!
 *
 * @param {object} options
 * @returns {P.Logger} a new Pino logger instance with stackdriver ready logs
 */

var stackdriver = (options => pino({ ...options,
  ...defaultPinoConf
}));

class API {
  constructor() {
    this.version = 'v1';
    this.specification = {};
    this.controllers = {};
    this.secret = null;
  }
  /**
   * Set the version
   *
   * @param {string} version
   */


  setVersion(version) {
    if (!version || version.constructor !== String) {
      throw new Error('Invalid OpenAPI version');
    }

    this.version = version;
  }
  /**
   * Set the specification
   *
   * @param {object} specification
   */


  setSpecifivation(specification) {
    if (!specification || specification.constructor !== Object) {
      throw new Error('Invalid OpenAPI specification');
    }

    this.specification = specification;
  }
  /**
   * Set the controllers
   *
   * @param {object} controllers
   */


  setControllers(controllers) {
    if (!controllers || controllers.constructor !== Object) {
      throw new Error('Invalid OpenAPI controllers');
    }

    this.controllers = controllers;
  }
  /**
   * Set the secret
   *
   * @param {string} scret
   */


  setSecret(secret) {
    if (secret && secret.constructor !== String) {
      throw new Error('Invalid OpenAPI secret');
    }

    this.secret = secret;
  }
  /**
   * Create an API entity
   *
   * @param {string} version
   * @param {object} specification
   * @param {object} controllers
   * @param {string} secret
   *
   * @return {object}
   */


  static create({
    version,
    specification,
    controllers,
    secret
  }) {
    const api = new API();
    api.setVersion(version);
    api.setSpecifivation(specification);
    api.setControllers(controllers);
    api.setSecret(secret);
    return api;
  }

}

var apiSchema = {
  name: 'string',
  version: 'string',
  apis: {
    version: 'string',
    specification: 'object',
    controllers: 'object',
    '?secret': 'string'
  },
  '?poweredBy': 'string',
  '?staticFolder': 'string'
};

const logger = stackdriver();
const apiValidator = new Validator(apiSchema);
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

const buildOpenapiExpress = ({
  name,
  version,
  apis,
  poweredBy = 'Pon.Bike',
  staticFolder = null
}) => {
  if (!apiValidator.validate({
    name,
    version,
    apis,
    poweredBy,
    staticFolder
  })) {
    throw new Error('invalid api details, field ' + apiValidator.errors[0][0] + ' should be a ' + apiValidator.errors[0][1]);
  }

  const app = express();
  app.set('name', name);
  app.use(cors());
  app.use(compression());
  app.use(helmet());
  app.use(express.json());
  app.use((request, response, next) => {
    response.setHeader('X-Powered-By', poweredBy);
    response.setHeader('X-Version', version);
    next();
  });
  app.use(expressPino({
    logger
  }));
  app.set('logger', logger);
  apis.forEach(api => {
    const apiRoutes = makeApi(api);
    app.use('/' + api.version, apiRoutes);
  });

  if (staticFolder) {
    app.use(express.static(staticFolder));
  }

  app.use(function (request, response, next) {
    response.status(404).send({
      status: 404,
      timestamp: new Date(),
      message: 'Not found.'
    });
  });
  return app;
};
/**
 * Connect the openapi spec to the controllers.
 *
 * @param {object} api
 *
 * @return {object}
 */


const makeApi = api => {
  const {
    specification,
    controllers,
    secret
  } = API.create(api);
  const router = express.Router();
  router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specification));
  router.get('/api-docs', (request, response) => response.json(specification));
  const apiRoutes = ApiRoutes.create({
    specification,
    secret,
    Backend: OpenAPIBackend,
    logger,
    controllers,
    callback: makeExpressCallback,
    root: '/'
  });
  router.use((request, response) => apiRoutes.handleRequest(request, request, response));
  return router;
};

export default buildOpenapiExpress;
export { API, buildOpenapiExpress, makeApi };
//# sourceMappingURL=openapi-express.module.js.map
