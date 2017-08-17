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

  async send (request: SmsRequestType): Promise<string> {
    const {authId, authToken} = this.credentials
    const basicAuth = Buffer.from(`${authId}:${authToken}`).toString('base64')
    const response = await fetch(`https://api.plivo.com/v1/Account/${authId}/Message/`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + basicAuth,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        src: request.from,
        dst: request.to,
        text: (request: any).text
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
