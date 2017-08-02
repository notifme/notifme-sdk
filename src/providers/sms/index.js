/* @flow */
import SmsLoggerProvider from './logger'
import SmsNexmoProvider from './nexmo'
import SmsTwilioProvider from './twilio'
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
      case 'twilio':
        this.provider = new SmsTwilioProvider(config, 'sms')
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
