/* @flow */
import fetch from '../../util/request'
// Types
import type { SmsRequestType } from '../../models/notification-request'

export default class SmsSevenProvider {
  id: string = 'sms-seven-provider'
  apiKey: string

  constructor ({ apiKey }: Object) {
    this.apiKey = apiKey
  }

  /*
   * Note: 'nature' is not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const { from, text, to, type, ttl, messageClass } = request.customize ? (await request.customize(this.id, request)) : request
    const params = {
      flash: messageClass === 0,
      from,
      text,
      to,
      ttl,
      unicode: type === 'unicode'
    }
    const response = await fetch('https://gateway.seven.io/api/sms', {
      body: JSON.stringify(params),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        SentWith: 'Notifme',
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)',
        'X-Api-Key': this.apiKey
      },
      method: 'POST'
    })

    if (response.ok) {
      const { messages } = await response.json()
      const message = messages[0]

      return message.id
    } else {
      throw new Error(await response.text())
    }
  }
}
