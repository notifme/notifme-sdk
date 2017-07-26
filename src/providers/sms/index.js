/* @flow */
import SmsLoggerProvider from './logger'
// Types
import type {SmsRequestType} from '../../model-request'

export interface SmsProviderType {
  send(request: SmsRequestType): Promise<string>
}

export default class SmsProvider {
  id: string
  provider: SmsProviderType

  constructor (type: string, config: Object) {
    switch (type) {
      case 'logger':
        this.provider = new SmsLoggerProvider('sms')
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
