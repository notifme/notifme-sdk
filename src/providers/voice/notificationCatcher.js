/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type { VoiceRequestType } from '../../models/notification-request'

export default class VoiceNotificationCatcherProvider extends NotificationCatcherProvider {
  async send (request: VoiceRequestType): Promise<string> {
    const { to, from, url } = (request: any)
    return this.sendToCatcher({
      to: `${to}@voice`,
      from,
      subject: `${to}@voice`,
      text: url,
      headers: {
        'X-type': 'voice',
        'X-to': `[voice] ${to}`
      }
    })
  }
}
