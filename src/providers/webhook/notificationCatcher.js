/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type {WebhookRequestType} from '../../models/notification-request'

export default class WebhookCatcherProvider extends NotificationCatcherProvider {
  async send ({event, data, url}: WebhookRequestType): Promise<string> {
    this.sendToCatcher({
      to: url,
      from: '-',
      subject: event,
      text: JSON.stringify(data),
      headers: {
        'X-type': 'webhook',
        'X-to': url
      }
    })
    return ''
  }
}
