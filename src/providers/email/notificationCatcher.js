/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { EmailRequestType } from '../../models/notification-request'

export default class EmailNotificationCatcherProvider extends NotificationCatcherProvider {
  async send (request: EmailRequestType): Promise<string> {
    const { to, from, html, text, subject, replyTo, attachments } =
      request.customize ? (await request.customize(this.id, request)) : request
    return this.sendToCatcher({
      to,
      from,
      html,
      text,
      subject,
      replyTo,
      attachments,
      headers: {
        'X-to': `[email] ${to}`
      }
    })
  }
}
