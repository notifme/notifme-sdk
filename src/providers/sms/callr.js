/* @flow */
import fetch from '../../util/request'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsCallrProvider {
  id: string = 'sms-callr-provider'
  apiKey: string

  constructor ({login, password}: Object) {
    this.apiKey = Buffer.from(`${login}:${password}`).toString('base64')
  }

  /*
   * Note: 'from', 'messageClass', 'ttl' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {id, userId, from, to, text, type, nature} = request
    const response = await fetch('https://api.callr.com/rest/v1.1/sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.apiKey}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({
        from,
        to,
        body: text,
        options: {
          force_encoding: type === 'unicode' ? 'UNICODE' : 'GSM',
          nature: nature === 'marketing' ? 'MARKETING' : 'ALERTING',
          ...(userId || id ? {user_data: userId || id} : null)
        }
      })
    })

    const responseBody = await response.json()
    if (response.ok) {
      return responseBody.data
    } else {
      const error = responseBody.data
      throw new Error(Object.keys(error).map((key) => `${key}: ${error[key]}`).join(', '))
    }
  }
}
