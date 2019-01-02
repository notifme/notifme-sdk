/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { PushRequestType } from '../../models/notification-request'

export default class PushNotificationCatcherProvider extends NotificationCatcherProvider {
  async send (request: PushRequestType): Promise<string> {
    const { registrationToken, title, ...rest } =
      request.customize ? (await request.customize(this.id, request)) : request
    return this.sendToCatcher({
      to: 'user@push.me',
      from: '-',
      subject: `${title.substring(0, 20)}${title.length > 20 ? '...' : ''}`,
      headers: {
        'X-type': 'push',
        'X-to': `[push] ${registrationToken.substring(0, 20)}...`,
        'X-payload': JSON.stringify({ title, ...rest })
      }
    })
  }
}
