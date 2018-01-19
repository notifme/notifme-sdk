/* @flow */
import VoiceLoggerProvider from '../logger'
import VoiceNotificationCatcherProvider from './notificationCatcher'
import VoiceTwilioProvider from './twilio'
// Types
import type {VoiceRequestType} from '../../models/notification-request'

export interface VoiceProviderType {
  id: string,
  send(request: VoiceRequestType): Promise<string>
}

export default function factory ({type, ...config}: Object): VoiceProviderType {
  switch (type) {
    // Development
    case 'logger':
      return new VoiceLoggerProvider(config, 'voice')

    case 'notificationcatcher':
      return new VoiceNotificationCatcherProvider('voice')

    case 'twilio':
      return new VoiceTwilioProvider(config)

    default:
      throw new Error(`Unknown voice provider "${type}".`)
  }
}
