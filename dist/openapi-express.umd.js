(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('express'), require('swagger-ui-express'), require('cors'), require('compression'), require('helmet'), require('express-pino-logger'), require('@ponbike/logger-stackdriver'), require('@ponbike/openapi-routes'), require('openapi-backend'), require('@hckrnews/express-callback'), require('@hckrnews/validator'), require('dotenv')) :
  typeof define === 'function' && define.amd ? define(['exports', 'express', 'swagger-ui-express', 'cors', 'compression', 'helmet', 'express-pino-logger', '@ponbike/logger-stackdriver', '@ponbike/openapi-routes', 'openapi-backend', '@hckrnews/express-callback', '@hckrnews/validator', 'dotenv'], factory) :
  (global = global || self, factory(global.openapiExpress = {}, global.express, global.swaggerUiExpress, global.cors, global.compression, global.helmet, global.expressPinoLogger, global.loggerStackdriver, global.openapiRoutes, global.openapiBackend, global.expressCallback, global.validator, global.dotenv));
}(this, (function (exports, express, swaggerUi, cors, compression, helmet, expressPino, loggerStackdriver, openapiRoutes, openapiBackend, expressCallback, validator, dotenv) {
  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
  var swaggerUi__default = /*#__PURE__*/_interopDefaultLegacy(swaggerUi);
  var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
  var compression__default = /*#__PURE__*/_interopDefaultLegacy(compression);
  var helmet__default = /*#__PURE__*/_interopDefaultLegacy(helmet);
  var expressPino__default = /*#__PURE__*/_interopDefaultLegacy(expressPino);
  var dotenv__default = /*#__PURE__*/_interopDefaultLegacy(dotenv);

  class API {
    constructor() {
      this.version = 'v1';
      this.specification = {};
      this.controllers = {};
      this.secret = null;
      this.requestValidation = false;
      this.responseValidation = false;
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


    setSpecification(specification) {
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
     * @param {string} secret
     */


    setSecret(secret) {
      if (secret && secret.constructor !== String) {
        throw new Error('Invalid OpenAPI secret');
      }

      this.secret = secret;
    }
    /**
     * set the request validation
     * 
     * @param {boolean} val
     */


    setRequestValidation(val) {
      if (val.constructor !== Boolean) {
        throw new Error('Invalid request validation');
      }

      this.requestValidation = val;
    }
    /**
     * set the response validation
     * 
     * @param {boolean} val
     */


    setResponseValidation(val) {
      if (val.constructor !== Boolean) {
        throw new Error('Invalid response validation');
      }

      this.responseValidation = val;
    }
    /**
     * Create an API entity
     *
     * @param {string} version
     * @param {object} specification
     * @param {object} controllers
     * @param {string} secret
     * @param {boolean} requestValidation
     * @param {boolean} responseValidation
     *
     * @return {object}
     */


    static create({
      version,
      specification,
      controllers,
      secret,
      requestValidation = false,
      responseValidation = false
    }) {
      const api = new API();
      api.setVersion(version);
      api.setSpecification(specification);
      api.setControllers(controllers);
      api.setSecret(secret);
      api.setRequestValidation(requestValidation);
      api.setResponseValidation(responseValidation);
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
      requestValidation: 'boolean',
      //    responseValidation: 'boolean',
      '?secret': 'string'
    },
    '?poweredBy': 'string',
    '?limit': 'string',
    '?staticFolder': 'string'
  };

  dotenv__default['default'].config();
  const logger = loggerStackdriver.logger();
  const apiValidator = new validator.Validator(apiSchema);
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
    if (!apiValidator.validate({
      name,
      version,
      apis,
      poweredBy,
      staticFolder
    })) {
      throw new Error('invalid api details, field ' + apiValidator.errors[0][0] + ' should be a ' + apiValidator.errors[0][1]);
    }

    const app = express__default['default']();
    const apiLogger = loggerStackdriver.logger(loggerOptions);
    app.set('name', name);
    app.use(cors__default['default']());
    app.use(compression__default['default']());
    app.use(helmet__default['default']());
    app.use(express__default['default'].json({
      limit
    }));
    app.use((request, response, next) => {
      response.setHeader('X-Powered-By', poweredBy);
      response.setHeader('X-Version', version);
      next();
    });
    app.use(expressPino__default['default']({
      logger: apiLogger
    }));
    app.set('logger', apiLogger);
    apis.forEach(api => {
      const apiRoutes = makeApi(api, apiLogger);
      app.use('/' + api.version, apiRoutes);
    });

    if (staticFolder) {
      app.use(express__default['default'].static(staticFolder));
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
    } = API.create(api);
    const router = express__default['default'].Router();
    router.use('/swagger', swaggerUi__default['default'].serve, swaggerUi__default['default'].setup(specification));
    router.get('/api-docs', (request, response) => response.json(specification));
    const {
      api: apiRoutes
    } = openapiRoutes.ApiRoutes.create({
      specification,
      secret,
      Backend: openapiBackend.OpenAPIBackend,
      logger: apiLogger,
      controllers,
      callback: expressCallback.makeExpressCallback,
      root: '/',
      responseValidation,
      requestValidation
    });
    router.use((request, response) => apiRoutes.handleRequest(request, request, response));
    return router;
  };

  exports.API = API;
  exports.apiSchema = apiSchema;
  exports.apiValidator = apiValidator;
  exports.buildOpenapiExpress = buildOpenapiExpress;
  exports.default = buildOpenapiExpress;
  exports.logger = logger;
  exports.makeApi = makeApi;

})));
//# sourceMappingURL=openapi-express.umd.js.map
