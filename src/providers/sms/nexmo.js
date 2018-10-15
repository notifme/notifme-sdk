/* @flow */
import fetch from '../../util/request'
// Types
import type { SmsRequestType } from '../../models/notification-request'

export default class SmsNexmoProvider {
  id: string = 'sms-nexmo-provider'
  credentials: Object

  constructor (config: Object) {
    this.credentials = { api_key: config.apiKey, api_secret: config.apiSecret }
  }

  /*
   * Note: 'nature' is not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const { from, to, text, type, ttl, messageClass } = request
    const response = await fetch('https://rest.nexmo.com/sms/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({
        ...this.credentials,
        from,
        to,
        text,
        type,
        ttl,
        'message-class': messageClass
      })
    })

    if (response.ok) {
      const responseBody = await response.json()
      const message = responseBody.messages[0]

      // Nexmo always returns 200 even for error
      if (message.status !== '0') {
        throw new Error(`status: ${message.status}, error: ${message['error-text']}`)
      } else {
        return message['message-id']
      }
    } else {
      throw new Error(response.status)
    }
  }
}
