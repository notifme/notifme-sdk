/* @flow */
import PushNotifications from 'node-pushnotifications'
// Types
import type { PushRequestType } from '../../models/notification-request'

export default class PushAdmProvider {
  id: string = 'push-adm-provider'
  transporter: Object

  constructor (config: Object) {
    this.transporter = new PushNotifications({ adm: {
      ...config,
      client_id: config.clientId,
      client_secret: config.clientSecret
    } })
  }

  async send ({ registrationToken, ...request }: PushRequestType): Promise<string> {
    const result = await this.transporter.send([registrationToken], request)
    if (result[0].failure > 0) {
      throw new Error(result[0].message[0].error)
    } else {
      return result[0].message[0].messageId
    }
  }
}
