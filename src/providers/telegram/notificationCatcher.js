/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { TelegramRequestType } from '../../models/notification-request'

export default class TelegramCatcherProvider extends NotificationCatcherProvider {
  async send (request: TelegramRequestType): Promise<string> {
    const { message } = request.customize ? (await request.customize(this.id, request)) : request
    this.sendToCatcher({
      to: 'public.channel@telegram',
      from: '-',
      subject: `${message.substring(0, 20)}${message.length > 20 ? '...' : ''}`,
      text: message,
      headers: {
        'X-type': 'telegram',
        'X-to': '[telegram public channel]'
      }
    })
    return ''
  }
}
