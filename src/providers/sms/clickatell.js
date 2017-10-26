/* @flow */
import fetch from '../../util/request'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsClickatellProvider {
  id: string = 'sms-clickatell-provider'
  apiKey: string

  constructor (config: Object) {
    // One-way integration API key
    this.apiKey = config.apiKey
  }

  /*
   * Note: 'from', 'nature', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {id, to, text, type, ttl} = request
    const response = await fetch('https://platform.clickatell.com/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.apiKey,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({
        // no `from` for one-way integrations
        to: [to],
        content: text,
        charset: type === 'unicode' ? 'UCS2-BE' : 'UTF-8',
        ...(ttl ? {validityPeriod: ttl} : null),
        ...(id ? {clientMessageId: id} : null)
      })
    })

    if (response.ok) {
      const responseBody = await response.json()
      if (responseBody.error) {
        throw new Error(responseBody.error)
      } else {
        return responseBody.messages[0].apiMessageId
      }
    } else {
      throw new Error(await response.text())
    }
  }
}
