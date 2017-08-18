/* @flow */
import EmailLoggerProvider from './logger'
import EmailNotificationCatcherProvider from './notificationCatcher'
import EmailSendmailProvider from './sendmail'
import EmailSendGridProvider from './sendgrid'
import EmailSmtpProvider from './smtp'
import EmailSparkPostProvider from './sparkpost'
// Types
import type {EmailRequestType} from '../../models/notification-request'

export interface EmailProviderType {
  send(request: EmailRequestType): Promise<string>
}

export default class EmailProvider {
  id: string
  provider: EmailProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'logger':
        this.provider = new EmailLoggerProvider(config, 'email')
        break
      case 'notificationcatcher':
        this.provider = new EmailNotificationCatcherProvider('email')
        break
      case 'sendmail':
        this.provider = new EmailSendmailProvider(config)
        break
      case 'smtp':
        this.provider = new EmailSmtpProvider(config)
        break
      case 'sendgrid':
        this.provider = new EmailSendGridProvider(config)
        break
      case 'sparkpost':
        this.provider = new EmailSparkPostProvider(config)
        break
      default:
        throw new Error(`Unknown email provider "${type}".`)
    }
    this.id = this.provider.id
  }

  send (request: EmailRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
