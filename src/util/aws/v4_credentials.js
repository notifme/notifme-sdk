/* https://github.com/aws/aws-sdk-js/blob/master/lib/signers/v4_credentials.js */
import { hmac } from '../crypto'

/**
 * @api private
 */
var cachedSecret = {}

/**
 * @api private
 */
var cacheQueue = []

/**
 * @api private
 */
var maxCacheEntries = 50

/**
 * @api private
 */
var v4Identifier = 'aws4_request'

export default {
  /**
   * @api private
   *
   * @param date [String]
   * @param region [String]
   * @param serviceName [String]
   * @return [String]
   */
  createScope: function createScope (date, region, serviceName) {
    return [
      date.substr(0, 8),
      region,
      serviceName,
      v4Identifier
    ].join('/')
  },

  /**
   * @api private
   *
   * @param credentials [Credentials]
   * @param date [String]
   * @param region [String]
   * @param service [String]
   * @param shouldCache [Boolean]
   * @return [String]
   */
  getSigningKey: function getSigningKey (
    credentials,
    date,
    region,
    service,
    shouldCache
  ) {
    var credsIdentifier = hmac(credentials.secretAccessKey, credentials.accessKeyId, 'base64')
    var cacheKey = [credsIdentifier, date, region, service].join('_')
    shouldCache = shouldCache !== false
    if (shouldCache && (cacheKey in cachedSecret)) {
      return cachedSecret[cacheKey]
    }

    var kDate = hmac(
      'AWS4' + credentials.secretAccessKey,
      date,
      'buffer'
    )
    var kRegion = hmac(kDate, region, 'buffer')
    var kService = hmac(kRegion, service, 'buffer')

    var signingKey = hmac(kService, v4Identifier, 'buffer')
    if (shouldCache) {
      cachedSecret[cacheKey] = signingKey
      cacheQueue.push(cacheKey)
      if (cacheQueue.length > maxCacheEntries) {
        // remove the oldest entry (not the least recently used)
        delete cachedSecret[cacheQueue.shift()]
      }
    }

    return signingKey
  },

  /**
   * @api private
   *
   * Empties the derived signing key cache. Made available for testing purposes
   * only.
   */
  emptyCache: function emptyCache () {
    cachedSecret = {}
    cacheQueue = []
  }
}
