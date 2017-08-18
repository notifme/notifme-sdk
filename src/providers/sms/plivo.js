/* @flow */
import fetch from 'node-fetch'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsPlivoProvider {
  id: string
  credentials: Object

  constructor (config: Object) {
    this.id = 'sms-plivo-provider'
    this.credentials = {authId: config.authId, authToken: config.authToken}
  }

  /*
   * Note: 'type', 'nature', 'ttl', 'messageClass' are not supported.
   */
  async send (request: SmsRequestType): Promise<string> {
    const {authId, authToken} = this.credentials
    const {from, to, text} = request
    const response = await fetch(`https://api.plivo.com/v1/Account/${authId}/Message/`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${authId}:${authToken}`).toString('base64')}`,
        'Content-Type': 'application/json'
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
