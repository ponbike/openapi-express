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
      throw new Error('Invalid OpenAPI version')
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
      throw new Error('Invalid OpenAPI specification')
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
      throw new Error('Invalid OpenAPI controllers')
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
      throw new Error('Invalid OpenAPI secret')
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
      throw new Error('Invalid request validation')
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
      throw new Error('Invalid response validation')
    }
    this.responseValidation = val
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
  static create ({ version, specification, controllers, secret, requestValidation = false, responseValidation = false }) {
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
