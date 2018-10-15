/* @flow */
import type { VoiceRequestType } from './notification-request'

// TODO?: other Voice providers
export type VoiceProviderType = {
  type: 'logger'
} | {
  type: 'custom',
  id: string,
  send: (VoiceRequestType) => Promise<string>
} | {
  type: 'twilio',
  accountSid: string,
  authToken: string
}
