/**
 * @typedef {object} ApiSchema
 * @property {string} name
 * @property {string} version
 * @property {Api[]} apis
 * @property {string=} poweredBy
 * @property {string=} limit
 * @property {string=} staticFolder
 */

/**
 * @typedef {object} Api
 * @property {string} version
 * @property {object} specification
 * @property {object} controllers
 * @property {boolean=} requestValidation
 * @property {boolean=} responseValidation
 * @property {string=} secret
 */
export default {
  name: 'string',
  version: 'string',
  apis: {
    version: 'string',
    specification: 'object',
    controllers: 'object',
    requestValidation: 'boolean',
    responseValidation: 'boolean',
    '?secret': 'string'
  },
  '?poweredBy': 'string',
  '?limit': 'string',
  '?staticFolder': 'string'
}
