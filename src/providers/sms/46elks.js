/* @flow */
import fetch from '../../util/request'
import qs from 'querystring'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class Sms46elksProvider {
  id: string = 'sms-46elks-provider'
  apiKey: string

  constructor ({apiUsername, apiPassword}: Object) {
    this.apiKey = Buffer.from(`${apiUsername}:${apiPassword}`).toString('base64')
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {from, to, text} = request
    const response = await fetch('https://api.46elks.com/a1/sms', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.apiKey}`,
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
