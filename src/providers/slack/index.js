/* @flow */
import SlackLoggingProvider from '../logger'
import SlackNotificationCatcherProvider from './notificationCatcher'
// Types
import type {SlackRequestType} from '../../models/notification-request'

export interface SlackProviderType {
  id: string,
  send(request: SlackRequestType): Promise<string>
}

export default function factory ({type, ...config}: Object): SlackProviderType {
  switch (type) {
    // Development
    case 'logger':
      return new SlackLoggingProvider(config, 'slack')

    case 'notificationcatcher':
      return new SlackNotificationCatcherProvider('slack')

    // Custom
    case 'custom':
      return config

    default:
      throw new Error(`Unknown slack provider "${type}".`)
  }
}
