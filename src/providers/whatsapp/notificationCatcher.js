/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { WhatsappRequestType } from '../../models/notification-request'

export default class WhatsappCatcherProvider extends NotificationCatcherProvider {
  async send (request: WhatsappRequestType): Promise<string> {
    const { from, to, text, ...rest } = request.customize ? (await request.customize(this.id, request)) : request
    this.sendToCatcher({
      to: `${to}@whatsapp`,
      from,
      subject: text ? `${text.substring(0, 20)}${text.length > 20 ? '...' : ''}` : '',
      text: JSON.stringify({ text, ...rest }, null, 2),
      headers: {
        'X-type': 'whatsapp',
        'X-to': `[whatsapp] ${to}`
      }
    })
    return ''
  }
}
