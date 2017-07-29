/* @flow */
import PushNotifications from 'node-pushnotifications'
// Types
import type {PushRequestType} from '../../models/notification-request'

export default class PushFcmProvider {
  id: string
  transporter: Object

  constructor (config: Object) {
    this.id = 'push-fcm-provider'
    this.transporter = new PushNotifications({gcm: config})
  }

  async send ({registrationToken, ...request}: PushRequestType): Promise<string> {
    const result = await this.transporter.send([registrationToken], request)
    if (result[0].failure > 0) {
      throw new Error(result[0].message[0].error)
    } else {
      return result[0].message[0].messageId
    }
  }
}
