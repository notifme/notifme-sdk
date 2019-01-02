/* @flow */
import PushNotifications from 'node-pushnotifications'
// Types
import type { PushRequestType } from '../../models/notification-request'

export default class PushFcmProvider {
  id: string = 'push-fcm-provider'
  transporter: Object

  constructor (config: Object) {
    this.transporter = new PushNotifications({ gcm: config })
  }

  async send (request: PushRequestType): Promise<string> {
    const { registrationToken, ...rest } =
      request.customize ? (await request.customize(this.id, request)) : request
    const result = await this.transporter.send([registrationToken], rest)
    if (result[0].failure > 0) {
      throw new Error(result[0].message[0].error)
    } else {
      return result[0].message[0].messageId
    }
  }
}
