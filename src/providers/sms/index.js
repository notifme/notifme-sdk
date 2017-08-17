/* @flow */
import SmsLoggerProvider from './logger'
import SmsNexmoProvider from './nexmo'
import SmsNotificationCatcherProvider from './notificationCatcher'
import SmsTwilioProvider from './twilio'
import Sms46elksProvider from './46elks'
import SmsPlivoProvider from './plivo'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export interface SmsProviderType {
  send(request: SmsRequestType): Promise<string>
}

export default class SmsProvider {
  id: string
  provider: SmsProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'logger':
        this.provider = new SmsLoggerProvider(config, 'sms')
        break
      case 'nexmo':
        this.provider = new SmsNexmoProvider(config)
        break
      case 'notificationcatcher':
        this.provider = new SmsNotificationCatcherProvider('sms')
        break
      case 'twilio':
        this.provider = new SmsTwilioProvider(config)
        break
      case '46elks':
        this.provider = new Sms46elksProvider(config)
        break
      case 'plivo':
        this.provider = new SmsPlivoProvider(config)
        break
      default:
        throw new Error(`Unknown sms provider "${type}".`)
    }
    this.id = this.provider.id
  }

  send (request: SmsRequestType): Promise<string> {
    return this.provider.send(request)
  }
}
