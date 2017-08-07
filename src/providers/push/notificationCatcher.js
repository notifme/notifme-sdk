/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type {PushRequestType} from '../../models/notification-request'

export default class PushNotificationCatcherProvider extends NotificationCatcherProvider {
  async send ({registrationToken, ...request}: PushRequestType): Promise<string> {
    return this.sendToCatcher({
      to: 'user@push.me',
      from: '-',
      subject: `${request.title.substring(0, 20)}${request.title.length > 20 ? '...' : ''}`,
      headers: {
        'X-type': 'push',
        'X-to': `[push] ${registrationToken.substring(0, 20)}...`,
        'X-payload': JSON.stringify(request)
      }
    })
  }
}
