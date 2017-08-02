/* @flow */
import Request from 'request-promise-native'
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
    const result = await Request.post('https://rest.nexmo.com/sms/json').form({
      ...this.credentials,
      ...request
    })
    const message = JSON.parse(result).messages[0]
    if (message.status !== '0') {
      throw new Error(`status: ${message.status}, error: ${message['error-text']}`)
    } else {
      return message['message-id']
    }
  }
}
