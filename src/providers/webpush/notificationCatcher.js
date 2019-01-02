/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { WebpushRequestType } from '../../models/notification-request'

export default class WebpushNotificationCatcherProvider extends NotificationCatcherProvider {
  async send (request: WebpushRequestType): Promise<string> {
    const { subscription, title, ...rest } =
      request.customize ? (await request.customize(this.id, request)) : request
    return this.sendToCatcher({
      to: `${rest.userId ? rest.userId : 'user'}@webpush`,
      from: '-',
      subject: title,
      headers: {
        'X-type': 'webpush',
        'X-to': `[webpush] ${rest.userId ? rest.userId : ''}`,
        'X-payload': JSON.stringify({ title, ...rest })
      }
    })
  }
}
