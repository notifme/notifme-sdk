/* @flow */
import WhatsappInfobipProvider from './infobip'
import WhatsappLoggingProvider from '../logger'
import WhatsappNotificationCatcherProvider from './notificationCatcher'
// Types
import type { WhatsappRequestType } from '../../models/notification-request'

export interface WhatsappProviderType {
  id: string,
  send(request: WhatsappRequestType): Promise<string>
}

export default function factory ({ type, ...config }: Object): WhatsappProviderType {
  switch (type) {
    // Development
    case 'logger':
      return new WhatsappLoggingProvider(config, 'whatsapp')

    case 'notificationcatcher':
      return new WhatsappNotificationCatcherProvider('whatsapp')

    // Custom
    case 'custom':
      return config

    // Providers
    case 'infobip':
      return new WhatsappInfobipProvider(config)

    default:
      throw new Error(`Unknown whatsapp provider "${type}".`)
  }
}
