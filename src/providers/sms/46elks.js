/* @flow */
import Request from 'request-promise-native'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export default class Sms46elksProvider {
  id: string
  credentials: Object

  constructor (config: Object) {
    this.id = 'sms-46elks-provider'
    this.credentials = {
      username: config.apiUsername,
      password: config.apiPassword
    }
  }

  async send (request: SmsRequestType): Promise<string> {
    const {username, password} = this.credentials
    try {
      const result = await Request
        .post('https://api.46elks.com/a1/sms')
        .auth(username, password)
        .form({
          from: request.from,
          to: request.to,
          message: (request: any).text
        })
      return JSON.parse(result)['id']
    } catch (error) {
      throw new Error(error.message)
    }
  }
}
