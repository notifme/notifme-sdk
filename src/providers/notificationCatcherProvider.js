/* @flow */
import EmailSmtpProvider from './email/smtp'
// Types
import type {ChannelType} from '../index'
import type {EmailRequestType} from '../models/notification-request'

export default class NotificationCatcherProvider {
  id: string
  provider: EmailSmtpProvider

  static getConfig (channels: ChannelType[]) {
    return channels.reduce((config, channel: any) => ({
      ...config,
      [channel]: {
        providers: [{type: 'notificationcatcher'}]
      }
    }), {})
  }

  constructor (channel: ChannelType) {
    this.id = `${channel}-notificationcatcher-provider`
    this.provider = new EmailSmtpProvider({
      port: 1025,
      ignoreTLS: true
    })
  }

  async sendToCatcher (request: EmailRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
