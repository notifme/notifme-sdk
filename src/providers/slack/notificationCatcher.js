/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type {SlackRequestType} from '../../models/notification-request'

export default class SlackCatcherProvider extends NotificationCatcherProvider {
  async send ({text}: SlackRequestType): Promise<string> {
    return this.sendToCatcher({
      to: 'webhook@slack',
      from: '-',
      subject: 'Webhook',
      text
    })
  }
}
