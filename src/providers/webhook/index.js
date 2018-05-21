/* @flow */
import WebhookProvider from './webhook'
import WebhookLoggingProvider from '../logger'
import WebhookNotificationCatcherProvider from './notificationCatcher'
// Types
import type {WebhookRequestType} from '../../models/notification-request'

export interface WebhookProviderType {
  id: string,
  send(request: WebhookRequestType): Promise<string>
}

export default function factory ({type, ...config}: Object): WebhookProviderType {
  switch (type) {
    // Development
    case 'logger':
      return new WebhookLoggingProvider(config, 'webhook')

    case 'notificationcatcher':
      return new WebhookNotificationCatcherProvider('webhook')

    // Custom
    case 'custom':
      return config

    // Providers
    case 'webhook':
      return new WebhookProvider()

    default:
      throw new Error(`Unknown webhook provider "${type}".`)
  }
}
