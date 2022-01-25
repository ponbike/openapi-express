/**
 * @typedef {Object} ApiSchema
 * @property {String} name
 * @property {String} version
 * @property {Api[]} apis
 * @property {String?} poweredBy
 * @property {String?} limit
 * @property {String?} staticFolder
 *
 * @typedef {Object} Api
 * @property {String} version
 * @property {object} specification
 * @property {object} controllers
 * @property {boolean} requestValidation
 * @property {boolean} responseValidation
 * @property {String?} secret
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
