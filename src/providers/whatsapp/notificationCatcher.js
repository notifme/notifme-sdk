/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { WhatsappRequestType } from '../../models/notification-request'

export default class WhatsappCatcherProvider extends NotificationCatcherProvider {
  async send (request: WhatsappRequestType): Promise<string> {
    const { content } = request.customize ? (await request.customize(this.id, request)) : request
    this.sendToCatcher({
      to: `${to}@whatsapp`,
      from,
      html: JSON.stringify(content),
      headers: {
        'X-type': 'whatsapp',
        'X-to': `[whatsapp] ${to}`
      }
    })
    return ''
  }
}
