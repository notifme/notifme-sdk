/* @flow */
import PushAdmProvider from './adm'
import PushApnProvider from './apn'
import PushFcmProvider from './fcm'
import PushLoggerProvider from '../logger'
import PushNotificationCatcherProvider from './notificationCatcher'
import PushWnsProvider from './wns'
// Types
import type {PushRequestType} from '../../models/notification-request'

export interface PushProviderType {
  id: string,
  send(request: PushRequestType): Promise<string>
}

export default function factory ({type, ...config}: Object): PushProviderType {
  switch (type) {
    case 'adm':
      return new PushAdmProvider(config)

    case 'apn':
      return new PushApnProvider(config)

    case 'fcm':
      return new PushFcmProvider(config)

    case 'notificationcatcher':
      return new PushNotificationCatcherProvider('push')

    case 'logger':
      return new PushLoggerProvider(config, 'push')

    case 'wns':
      return new PushWnsProvider(config)

    default:
      throw new Error(`Unknown push provider "${type}".`)
  }
}
