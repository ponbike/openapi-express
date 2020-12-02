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

const logger = stackdriver();
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

function buildOpenapiExpress({
  name,
  version,
  apis,
  poweredBy = 'Pon.Bike',
  staticFolder = null
}) {
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
    app.use('/' + api.version, makeApi(api));
  });

  if (staticFolder) {
    if (staticFolder.constructor !== String) {
      throw new Error('staticFolder isnt a valid string to the static files folder');
    }

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

const makeApi = ({
  specification,
  controllers,
  secret
}) => {
  const router = express.Router();
  router.use('/swagger', swaggerUi.serve, swaggerUi.setup(specification));
  router.get('/api-docs', (request, response) => response.json(specification));
  router.use((request, response) => ApiRoutes.create({
    specification: specification,
    secret,
    Backend: OpenAPIBackend,
    logger,
    controllers,
    callback: makeExpressCallback,
    root: '/'
  }).handleRequest(request, request, response));
  return router;
};

export default buildOpenapiExpress;
//# sourceMappingURL=openapi-express.module.js.map
