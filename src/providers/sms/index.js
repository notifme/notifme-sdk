/* @flow */
import SmsLoggerProvider from '../logger'
import Sms46elksProvider from './46elks'
import SmsCallrProvider from './callr'
import SmsClickatellProvider from './clickatell'
import SmsInfobipProvider from './infobip'
import SmsNexmoProvider from './nexmo'
import SmsNotificationCatcherProvider from './notificationCatcher'
import SmsOvhProvider from './ovh'
import SmsPlivoProvider from './plivo'
import SmsTwilioProvider from './twilio'
// Types
import type { SmsRequestType } from '../../models/notification-request'
import SmsSevenProvider from './seven'

export interface SmsProviderType {
  id: string,
  send(request: SmsRequestType): Promise<string>
}

export default function factory ({ type, ...config }: Object): SmsProviderType {
  switch (type) {
    // Development
    case 'logger':
      return new SmsLoggerProvider(config, 'sms')

    case 'notificationcatcher':
      return new SmsNotificationCatcherProvider('sms')

    // Custom
    case 'custom':
      return config

    // Providers
    case '46elks':
      return new Sms46elksProvider(config)

    case 'callr':
      return new SmsCallrProvider(config)

    case 'clickatell':
      return new SmsClickatellProvider(config)

    case 'infobip':
      return new SmsInfobipProvider(config)

    case 'nexmo':
      return new SmsNexmoProvider(config)

    case 'ovh':
      return new SmsOvhProvider(config)

    case 'plivo':
      return new SmsPlivoProvider(config)

    case 'twilio':
      return new SmsTwilioProvider(config)

    case 'seven':
      return new SmsSevenProvider(config)

    default:
      throw new Error(`Unknown sms provider "${type}".`)
  }
}
