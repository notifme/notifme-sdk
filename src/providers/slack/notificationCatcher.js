/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { SlackRequestType } from '../../models/notification-request'

export default class SlackCatcherProvider extends NotificationCatcherProvider {
  async send (request: SlackRequestType): Promise<string> {
    const { text } = request.customize ? (await request.customize(this.id, request)) : request
    this.sendToCatcher({
      to: 'public.channel@slack',
      from: '-',
      subject: `${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`,
      text,
      headers: {
        'X-type': 'slack',
        'X-to': '[slack public channel]'
      }
    })
    return ''
  }
}
