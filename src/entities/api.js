import { ServerError } from '@hckrnews/error'

class API {
  constructor () {
    this.version = 'v1'
    this.specification = {}
    this.controllers = {}
    this.secret = null
    this.requestValidation = false
    this.responseValidation = false
  }

  /**
   * Set the version
   *
   * @param {string} version
   */
  setVersion (version) {
    if (!version || version.constructor !== String) {
      throw new ServerError({
        message: 'Invalid OpenAPI version',
        value: { version }
      })
    }

    this.version = version
  }

  /**
   * Set the specification
   *
   * @param {object} specification
   */
  setSpecification (specification) {
    if (!specification || specification.constructor !== Object) {
      throw new ServerError({
        message: 'Invalid OpenAPI specification',
        value: { specification }
      })
    }

    this.specification = specification
  }

  /**
   * Set the controllers
   *
   * @param {object} controllers
   */
  setControllers (controllers) {
    if (!controllers || controllers.constructor !== Object) {
      throw new ServerError({
        message: 'Invalid OpenAPI controllers',
        value: { controllers }
      })
    }

    this.controllers = controllers
  }

  /**
   * Set the secret
   *
   * @param {string} secret
   */
  setSecret (secret) {
    if (secret && secret.constructor !== String) {
      throw new ServerError({
        message: 'Invalid OpenAPI secret',
        value: { secret }
      })
    }

    this.secret = secret
  }

  /**
   * set the request validation
   *
   * @param {boolean} val
   */
  setRequestValidation (val) {
    if (val.constructor !== Boolean) {
      throw new ServerError({
        message: 'Invalid request validation',
        value: { requestValidation: val }
      })
    }
    this.requestValidation = val
  }

  /**
   * set the response validation
   *
   * @param {boolean} val
   */
  setResponseValidation (val) {
    if (val.constructor !== Boolean) {
      throw new ServerError({
        message: 'Invalid response validation',
        value: { responseValidation: val }
      })
    }
    this.responseValidation = val
  }

  /**
   * Create an API entity
   *
   * @param {object} data
   * @param {string} data.version
   * @param {object} data.specification
   * @param {object} data.controllers
   * @param {string} data.secret
   * @param {boolean=} data.requestValidation
   * @param {boolean=} data.responseValidation
   * @returns {object}
   */
  static create ({
    version,
    specification,
    controllers,
    secret,
    requestValidation = false,
    responseValidation = false
  }) {
    const api = new API()

    api.setVersion(version)
    api.setSpecification(specification)
    api.setControllers(controllers)
    api.setSecret(secret)
    api.setRequestValidation(requestValidation)
    api.setResponseValidation(responseValidation)

    return api
  }
}

export default API
