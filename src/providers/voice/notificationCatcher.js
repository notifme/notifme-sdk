/* @flow */
import NotificationCatcherProvider from '../notificationCatcherProvider'
// Types
import type {VoiceRequestType} from '../../models/notification-request'

export default class VoiceNotificationCatcherProvider extends NotificationCatcherProvider {
  async send (request: VoiceRequestType): Promise<string> {
    const {to, from, text} = (request: any)
    return this.sendToCatcher({
      to: `${to}@voice`,
      from,
      subject: `${text.substring(0, 20)}${text.length > 20 ? '...' : ''}`,
      text,
      headers: {
        'X-type': 'voice',
        'X-to': `[voice] ${to}`
      }
    })
  }
}
