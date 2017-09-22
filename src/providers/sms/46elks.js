/* @flow */
import fetch from 'node-fetch'
import qs from 'querystring'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class Sms46elksProvider {
  id: string = 'sms-46elks-provider'
  credentials: Object

  constructor (config: Object) {
    this.credentials = {
      username: config.apiUsername,
      password: config.apiPassword
    }
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {username, password} = this.credentials
    const {from, to, text} = request
    const response = await fetch('https://api.46elks.com/a1/sms', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: qs.stringify({
        from,
        to,
        message: text
      })
    })

    if (response.ok) {
      const responseBody = await response.json()
      return responseBody.id
    } else {
      throw new Error(await response.text())
    }
  }
}
