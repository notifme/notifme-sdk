/* @flow */
import EmailSmtpProvider from './email/smtp'
// Types
import type { ChannelType } from '../index'
import type { EmailRequestType } from '../models/notification-request'

export default class NotificationCatcherProvider {
  id: string
  provider: EmailSmtpProvider

  static getConfig (channels: ChannelType[]) {
    return channels.reduce((config, channel: any) => ({
      ...config,
      [channel]: {
        providers: [{ type: 'notificationcatcher' }],
        multiProviderStrategy: 'no-fallback'
      }
    }), {})
  }

  constructor (channel: ChannelType) {
    this.id = `${channel}-notificationcatcher-provider`

    const options = process.env.NOTIFME_CATCHER_OPTIONS || {
      port: 1025,
      ignoreTLS: true
    }

    this.provider = new EmailSmtpProvider(options)
  }

  async sendToCatcher (request: EmailRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
