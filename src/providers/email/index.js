/* @flow */
import EmailLoggerProvider from '../logger'
import EmailNotificationCatcherProvider from './notificationCatcher'
import EmailSendmailProvider from './sendmail'
import EmailSmtpProvider from './smtp'
// Types
import type {EmailRequestType} from '../../models/notification-request'

export interface EmailProviderType {
  id: string,
  send(request: EmailRequestType): Promise<string>
}

export default function factory ({type, ...config}: Object): EmailProviderType {
  switch (type) {
    case 'logger':
      return new EmailLoggerProvider(config, 'email')

    case 'notificationcatcher':
      return new EmailNotificationCatcherProvider('email')

    case 'sendmail':
      return new EmailSendmailProvider(config)

    case 'smtp':
      return new EmailSmtpProvider(config)

    default:
      throw new Error(`Unknown email provider "${type}".`)
  }
}
