class API {
  constructor () {
    this.version = 'v1'
    this.specification = {}
    this.controllers = {}
    this.secret = null
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
  setSpecifivation (specification) {
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
   * @param {string} scret
   */
  setSecret (secret) {
    if (secret.constructor !== String) {
      throw new Error('Invalid OpenAPI secret')
    }

    this.secret = secret
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
  static create ({ version, specification, controllers, secret }) {
    const api = new API()

    api.setVersion(version)
    api.setSpecifivation(specification)
    api.setControllers(controllers)
    api.setSecret(secret)

    return api
  }
}

export default API
