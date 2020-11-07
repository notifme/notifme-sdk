/* @flow */
import TelegramProvider from './telegram'
import TelegramLoggingProvider from '../logger'
import TelegramNotificationCatcherProvider from './notificationCatcher'
// Types
import type { TelegramRequestType } from '../../models/notification-request'

export interface TelegramProviderType {
  id: string,
  send(request: TelegramRequestType): Promise<string>
}

export default function factory ({ type, ...config }: Object): TelegramProviderType {
  switch (type) {
    // Development
    case 'logger':
      return new TelegramLoggingProvider(config, 'telegram')

    case 'notificationcatcher':
      return new TelegramNotificationCatcherProvider('telegram')

    // Custom
    case 'custom':
      return config

    // Providers
    case 'webhook':
      return new TelegramProvider(config)

    default:
      throw new Error(`Unknown telegram provider "${type}".`)
  }
}
