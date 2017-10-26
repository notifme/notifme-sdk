/* @flow */
import fetch from '../../util/request'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsPlivoProvider {
  id: string = 'sms-plivo-provider'
  authId: string
  apiKey: string

  constructor ({authId, authToken}: Object) {
    this.authId = authId
    this.apiKey = Buffer.from(`${authId}:${authToken}`).toString('base64')
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {from, to, text} = request
    const response = await fetch(`https://api.plivo.com/v1/Account/${this.authId}/Message/`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({
        src: from,
        dst: to,
        text
      })
    })

    if (response.ok) {
      const responseBody = await response.json()
      return responseBody.message_uuid[0]
    } else {
      throw new Error(response.status === 401 ? await response.text() : (await response.json()).error)
    }
  }
}
