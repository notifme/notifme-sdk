/* @flow */
import fetch from 'node-fetch'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class SmsNexmoProvider {
  id: string
  credentials: Object

  constructor (config: Object) {
    this.id = 'sms-nexmo-provider'
    this.credentials = {api_key: config.apiKey, api_secret: config.apiSecret}
  }

  async send (request: SmsRequestType): Promise<string> {
    try {
      const response = await fetch('https://rest.nexmo.com/sms/json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...this.credentials,
          ...request
        })
      })

      if (response.ok) {
        const responseBody = await response.json()
        const message = responseBody.messages[0]

        // !! nexmo returns always 200 even for error
        if (message.status !== '0') {
          throw new Error(`status: ${message.status}, error: ${message['error-text']}`)
        } else {
          return message['message-id']
        }
      } else {
        throw new Error(response.status)
      }
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
