/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { SmsRequestType } from '../../models/notification-request'

export default class SmsNotificationCatcherProvider extends NotificationCatcherProvider {
  async send (request: SmsRequestType): Promise<string> {
    const { to, from, text } = (request: any)
    return this.sendToCatcher({
      to: `${to}@sms`,
      from,
      subject: `${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`,
      text,
      headers: {
        'X-type': 'sms',
        'X-to': `[sms] ${to}`
      }
    })
  }
}
