/* @flow */
import SmsLoggerProvider from '../logger'
import SmsNexmoProvider from './nexmo'
import SmsNotificationCatcherProvider from './notificationCatcher'
import SmsTwilioProvider from './twilio'
import Sms46elksProvider from './46elks'
import SmsPlivoProvider from './plivo'
// Types
import type {SmsRequestType} from '../../models/notification-request'

export interface SmsProviderType {
  id: string,
  send(request: SmsRequestType): Promise<string>
}

export default function factory ({type, ...config}: Object): SmsProviderType {
  switch (type) {
    case 'custom':
      return config

    case 'logger':
      return new SmsLoggerProvider(config, 'sms')

    case 'nexmo':
      return new SmsNexmoProvider(config)

    case 'notificationcatcher':
      return new SmsNotificationCatcherProvider('sms')

    case 'twilio':
      return new SmsTwilioProvider(config)

    case '46elks':
      return new Sms46elksProvider(config)

    case 'plivo':
      return new SmsPlivoProvider(config)

    default:
      throw new Error(`Unknown sms provider "${type}".`)
  }
}
