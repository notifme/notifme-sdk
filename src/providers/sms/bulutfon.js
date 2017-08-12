/* @flow */
import Request from 'request-promise-native'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class BulutfonProvider {
  id: string
  config: Object

  constructor (config: Object) {
    this.id = 'sms-bulutfon-provider'
    this.config = {
      defaultTitle: config.defaultTitle,
      access_token: config.accessToken
    }
  }

  async send (request: SmsRequestType): Promise<string> {
    const { defaultTitle: title = request.from, access_token } = this.config

    let receivers = request.to
    if (Array.isArray(receivers)) {
      receivers = receivers.join(',')
    }

    try {
      const result = await Request
        .post('https://api.bulutfon.com/messages')
        .form({
          access_token,
          title,
          receivers,
          content: (request: any).text
        })
      return JSON.parse(result)['message']
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
