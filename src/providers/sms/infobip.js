/* @flow */
import fetch from '../../util/request'
// Types
import type { SmsRequestType } from '../../models/notification-request'

export default class SmsInfobipProvider {
  id: string = 'sms-infobip-provider'
  apiKey: string

  constructor ({ username, password }: Object) {
    this.apiKey = Buffer.from(`${username}:${password}`).toString('base64')
  }

  /*
   * Note: 'nature', 'messageClass', 'type', 'ttl' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const { from, to, text } = request
    const response = await fetch('https://api.infobip.com/sms/1/text/single', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.apiKey}`,
        'User-Agent': 'notifme-sdk/v1 (+https://github.com/notifme/notifme-sdk)'
      },
      body: JSON.stringify({
        from,
        to,
        text
      })
    })

    const responseBody = await response.json()
    if (response.ok) {
      const message = responseBody.messages[0]
      if (message.status.groupId === 1) {
        return message.messageId
      } else {
        const error = message.status
        throw new Error(Object.keys(error).map((key) => `${key}: ${error[key]}`).join(', '))
      }
    } else if (responseBody.requestError && responseBody.requestError.serviceException) {
      const error = responseBody.requestError.serviceException
      const message = Object.keys(error).map((key) => `${key}: ${error[key]}`).join(', ')
      throw new Error(message)
    } else {
      throw new Error(JSON.stringify(responseBody))
    }
  }
}
