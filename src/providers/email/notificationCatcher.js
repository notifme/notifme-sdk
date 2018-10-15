/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { EmailRequestType } from '../../models/notification-request'

export default class EmailNotificationCatcherProvider extends NotificationCatcherProvider {
  async send ({ to, from, html, text, subject, replyTo }: EmailRequestType): Promise<string> {
    return this.sendToCatcher({
      to,
      from,
      html,
      text,
      subject,
      replyTo,
      headers: {
        'X-to': `[email] ${to}`
      }
    })
  }
}
